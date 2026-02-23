import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import Redis from 'ioredis';
import { aggregateHeatmapData } from './services/heatmapService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8081;

const MX_SPACE_API = process.env.MX_SPACE_API || '';
const MX_SPACE_TOKEN = process.env.MX_SPACE_TOKEN || '';
const BLOG_URL = process.env.BLOG_URL || '';

console.log('[Server] MX-Space API:', MX_SPACE_API);
console.log('[Server] Token configured:', !!MX_SPACE_TOKEN);

// Redis 配置
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(REDIS_URL, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
  lazyConnect: true
});

// Redis 连接状态
let redisConnected = false;

redis.on('connect', () => {
  console.log('[Redis] Connected successfully');
  redisConnected = true;
});

redis.on('error', (err) => {
  console.warn('[Redis] Connection error:', err.message);
  redisConnected = false;
});

redis.on('close', () => {
  console.warn('[Redis] Connection closed');
  redisConnected = false;
});

// 尝试连接 Redis
redis.connect().catch((err) => {
  console.warn('[Redis] Failed to connect:', err.message);
  console.warn('[Redis] Running without cache');
});

// 缓存 TTL 配置（秒）
const CACHE_TTL = {
  POSTS: 5 * 60,      // 5 分钟
  LINKS: 30 * 60,     // 30 分钟
  HEATMAP: 60 * 60    // 1 小时
};

// Redis 缓存辅助函数
async function getCache<T>(key: string): Promise<T | null> {
  if (!redisConnected) return null;
  
  try {
    const data = await redis.get(key);
    if (data) {
      console.log(`[Cache] Hit: ${key}`);
      return JSON.parse(data) as T;
    }
    return null;
  } catch (error: any) {
    console.warn(`[Cache] Get error: ${error.message}`);
    return null;
  }
}

async function setCache<T>(key: string, data: T, ttl: number): Promise<void> {
  if (!redisConnected) return;
  
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
    console.log(`[Cache] Set: ${key} (TTL: ${ttl}s)`);
  } catch (error: any) {
    console.warn(`[Cache] Set error: ${error.message}`);
  }
}

async function clearCache(): Promise<void> {
  if (!redisConnected) return;
  
  try {
    await redis.flushdb();
    console.log('[Cache] Cleared all cache');
  } catch (error: any) {
    console.warn(`[Cache] Clear error: ${error.message}`);
  }
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const mxClient = axios.create({
  baseURL: MX_SPACE_API,
  timeout: 10000,
  headers: {
    'Authorization': `Bearer ${MX_SPACE_TOKEN}`,
    'User-Agent': 'Mozilla/5.0'
  }
});

app.get('/health', async (req: Request, res: Response) => {
  let cacheSize = 0;
  if (redisConnected) {
    try {
      cacheSize = await redis.dbsize();
    } catch (error) {
      // ignore
    }
  }
  
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    cache: {
      enabled: redisConnected,
      size: cacheSize,
      ttl: {
        posts: `${CACHE_TTL.POSTS}s`,
        links: `${CACHE_TTL.LINKS}s`,
        heatmap: `${CACHE_TTL.HEATMAP}s`
      }
    }
  });
});

// 清除缓存的管理接口
app.post('/api/cache/clear', async (req: Request, res: Response) => {
  await clearCache();
  res.json({
    success: true,
    message: 'Cache cleared successfully'
  });
});

app.get('/api/posts', async (req: Request, res: Response) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const cacheKey = `posts:${page}:${size}`;
    
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    
    const response = await mxClient.get('/posts', {
      params: {
        page,
        size,
        select: 'title text category created modified slug tags'
      }
    });
    
    const postsData = response.data.data || response.data || [];
    
    const posts = postsData.map((post: any) => ({
      id: post._id || post.id,
      title: post.title || 'Untitled',
      excerpt: post.text ? post.text.substring(0, 150).replace(/<[^>]*>/g, '') + '...' : '',
      category: post.category?.name || 'Uncategorized',
      categorySlug: post.category?.slug || 'default',
      date: post.created ? new Date(post.created).toLocaleDateString('zh-CN') : '',
      tags: post.tags || [],
      views: post.count?.read || 0,
      link: `${BLOG_URL}/posts/${post.category?.slug || 'default'}/${post.slug}`
    }));
    
    const result = {
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page as string),
        size: parseInt(size as string),
        total: response.data.pagination?.total || posts.length
      }
    };
    
    // 存入缓存
    await setCache(cacheKey, result, CACHE_TTL.POSTS);
    
    res.json(result);
  } catch (error: any) {
    console.warn(`[API] Posts fetch failed: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: error.message
    });
  }
});

app.get('/api/links', async (req: Request, res: Response) => {
  try {
    const cacheKey = 'links';
    
    
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    
    const response = await mxClient.get('/links');
    
    const linksData = Array.isArray(response.data) ? response.data : response.data.data || [];
    
    const links = linksData.map((link: any) => ({
      name: link.name,
      url: link.url,
      description: link.description || link.desc || '',
      icon: link.avatar || link.icon || 'mdi:link-variant',
      type: link.type || 'friend'
    }));
    
    const result = {
      success: true,
      data: links
    };
    
    // 存入缓存
    await setCache(cacheKey, result, CACHE_TTL.LINKS);
    
    res.json(result);
  } catch (error: any) {
    console.warn(`[API] Links fetch failed: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch links',
      error: error.message
    });
  }
});

app.get('/api/heatmap', async (req: Request, res: Response) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const cacheKey = `heatmap:${year}`;
    
    
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      console.log(`[API] Returning cached heatmap for year ${year}`);
      return res.json(cachedData);
    }
    
    console.log(`[API] Fetching heatmap data for year ${year}...`);
    
    const data = await aggregateHeatmapData(parseInt(year as string));
    
    const result = {
      success: true,
      data: data,
      meta: {
        year: parseInt(year as string),
        totalDays: data.length,
        activeDays: data.filter(d => d.value > 0).length,
        sources: ['blog', 'github', 'codeforces', 'nowcoder', 'atcoder']
      }
    };
    
    // 存入缓存
    await setCache(cacheKey, result, CACHE_TTL.HEATMAP);
    
    res.json(result);
  } catch (error: any) {
    console.warn(`[API] Heatmap fetch failed: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch heatmap data',
      error: error.message
    });
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Server] Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

app.get('*', (req: Request, res: Response) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'API not found'
    });
  }
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log('[Server] ========================================');
  console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('[Server] ========================================');
});

export default app;

