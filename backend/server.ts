import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
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

app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

app.get('/api/posts', async (req: Request, res: Response) => {
  try {
    const { page = 1, size = 10 } = req.query;
    
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
    
    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page as string),
        size: parseInt(size as string),
        total: response.data.pagination?.total || posts.length
      }
    });
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
    const response = await mxClient.get('/links');
    
    const linksData = Array.isArray(response.data) ? response.data : response.data.data || [];
    
    const links = linksData.map((link: any) => ({
      name: link.name,
      url: link.url,
      description: link.description || link.desc || '',
      icon: link.avatar || link.icon || 'mdi:link-variant',
      type: link.type || 'friend'
    }));
    
    res.json({
      success: true,
      data: links
    });
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
    
    console.log(`[API] Fetching heatmap data for year ${year}...`);
    
    const data = await aggregateHeatmapData(parseInt(year as string));
    
    res.json({
      success: true,
      data: data,
      meta: {
        year: parseInt(year as string),
        totalDays: data.length,
        activeDays: data.filter(d => d.value > 0).length,
        sources: ['blog', 'github', 'codeforces', 'nowcoder', 'atcoder']
      }
    });
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

