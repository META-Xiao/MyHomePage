import express from 'express'
import cors from 'cors'
import axios from 'axios'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 8081

// MX-Space API 配置
const MX_SPACE_API = process.env.MX_SPACE_API || 'https://api.teslongxiao.cn/api/v2'
const MX_SPACE_TOKEN = process.env.MX_SPACE_TOKEN || 'txoo508lo5rf9g46mo93pkgvj0y586x2uhbkocz0t3e'
const BLOG_URL = process.env.BLOG_URL || 'https://blog.teslongxiao.cn'

console.log('[INFO] MX-Space API 地址:', MX_SPACE_API)
console.log('[INFO] MX-Space Token 已配置:', MX_SPACE_TOKEN ? '是' : '否')

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, '../frontend/dist')))

const mxClient = axios.create({
  baseURL: MX_SPACE_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Authorization': `Bearer ${MX_SPACE_TOKEN}`
  }
})

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mxSpaceApi: MX_SPACE_API
  })
})

app.get('/api/posts', async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query
    const url = '/posts'
    console.log(`[DEBUG] 请求 URL: ${MX_SPACE_API}${url}`)
    console.log(`[DEBUG] 请求参数:`, { page, size })
    
    const response = await mxClient.get(url, {
      params: {
        page,
        size,
        select: 'title text category created modified slug tags'
      }
    })
    
    console.log(`[DEBUG] 响应状态: ${response.status}`)
    console.log(`[DEBUG] 响应数据结构:`, Object.keys(response.data))
    
    // 处理不同的数据结构
    const postsData = response.data.data || response.data || []
    
    const posts = postsData.map(post => ({
      id: post._id || post.id,
      title: post.title || '无标题',
      excerpt: post.text ? post.text.substring(0, 150).replace(/<[^>]*>/g, '') + '...' : '',
      category: post.category?.name || '未分类',
      categorySlug: post.category?.slug || 'default',
      date: post.created ? new Date(post.created).toLocaleDateString('zh-CN') : '',
      tags: post.tags || [],
      views: post.count?.read || 0,
      link: `${BLOG_URL}/posts/${post.category?.slug || 'default'}/${post.slug}`
    }))
    
    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        size: parseInt(size),
        total: response.data.pagination?.total || posts.length
      }
    })
  } catch (error) {
    console.error('[ERROR] 获取文章列表失败:', error.message)
    if (error.response) {
      console.error('[ERROR] 响应状态:', error.response.status)
      console.error('[ERROR] 响应数据:', JSON.stringify(error.response.data))
      console.error('[ERROR] 响应头:', JSON.stringify(error.response.headers))
    }
    res.status(500).json({
      success: false,
      message: '获取文章列表失败',
      error: error.message
    })
  }
})

app.get('/api/posts/latest', async (req, res) => {
  try {
    const { size = 6 } = req.query
    const response = await mxClient.get('/posts/latest', {
      params: { size }
    })
    
    const posts = response.data.map(post => ({
      id: post._id || post.id,
      title: post.title,
      excerpt: post.text ? post.text.substring(0, 100).replace(/<[^>]*>/g, '') + '...' : '',
      category: post.category?.name || '未分类',
      date: new Date(post.created).toLocaleDateString('zh-CN'),
      link: `${BLOG_URL}/posts/${post.category?.slug || 'default'}/${post.slug}`
    }))
    
    res.json({
      success: true,
      data: posts
    })
  } catch (error) {
    console.error('[ERROR] 获取最新文章失败:', error.message)
    res.status(500).json({
      success: false,
      message: '获取最新文章失败',
      error: error.message
    })
  }
})

app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params
    const response = await mxClient.get(`/posts/${id}`)
    
    res.json({
      success: true,
      data: response.data
    })
  } catch (error) {
    console.error('[ERROR] 获取文章详情失败:', error.message)
    res.status(500).json({
      success: false,
      message: '获取文章详情失败',
      error: error.message
    })
  }
})

app.get('/api/categories', async (req, res) => {
  try {
    const response = await mxClient.get('/categories')
    
    res.json({
      success: true,
      data: response.data
    })
  } catch (error) {
    console.error('[ERROR] 获取分类列表失败:', error.message)
    res.status(500).json({
      success: false,
      message: '获取分类列表失败',
      error: error.message
    })
  }
})

app.get('/api/links', async (req, res) => {
  try {
    const response = await mxClient.get('/links')
    
    console.log('[DEBUG] 友链原始数据:', JSON.stringify(response.data).substring(0, 200))
    
    // MX-Space 返回的友链数据结构
    const linksData = Array.isArray(response.data) ? response.data : response.data.data || []
    
    const links = linksData.map(link => ({
      name: link.name,
      url: link.url,
      description: link.description || link.desc || '',
      icon: link.avatar || link.icon || 'mdi:link-variant',
      type: link.type || 'friend'
    }))
    
    res.json({
      success: true,
      data: links
    })
  } catch (error) {
    console.error('[ERROR] 获取友链列表失败:', error.message)
    if (error.response) {
      console.error('[ERROR] 响应状态:', error.response.status)
      console.error('[ERROR] 响应数据:', JSON.stringify(error.response.data))
    }
    res.status(500).json({
      success: false,
      message: '获取友链列表失败',
      error: error.message
    })
  }
})

app.get('/api/stats', async (req, res) => {
  try {
    const response = await mxClient.get('/aggregate/stat')
    
    res.json({
      success: true,
      data: {
        posts: response.data.posts || 0,
        categories: response.data.categories || 0,
        comments: response.data.comments || 0,
        views: response.data.allViews || 0,
        likes: response.data.allLikes || 0
      }
    })
  } catch (error) {
    console.error('[ERROR] 获取统计信息失败:', error.message)
    res.status(500).json({
      success: false,
      message: '获取统计信息失败',
      error: error.message
    })
  }
})

app.get('/api/says', async (req, res) => {
  try {
    const { size = 5 } = req.query
    const response = await mxClient.get('/says', {
      params: { size }
    })
    
    res.json({
      success: true,
      data: response.data
    })
  } catch (error) {
    console.error('[ERROR] 获取说说失败:', error.message)
    res.status(500).json({
      success: false,
      message: '获取说说失败',
      error: error.message
    })
  }
})

app.get('/api/recently', async (req, res) => {
  try {
    const response = await mxClient.get('/aggregate/timeline', {
      params: { size: 10 }
    })
    
    res.json({
      success: true,
      data: response.data
    })
  } catch (error) {
    console.error('[ERROR] 获取最近动态失败:', error.message)
    res.status(500).json({
      success: false,
      message: '获取最近动态失败',
      error: error.message
    })
  }
})

app.use((err, req, res, next) => {
  console.error('[ERROR] 服务器错误:', err)
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: err.message
  })
})


app.get('*', (req, res) => {

  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: '接口不存在'
    })
  }

  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})


app.listen(PORT, '0.0.0.0', () => {
  console.log(`[INFO] ========================================`)
  console.log(`[INFO] Server is running on http://0.0.0.0:${PORT}`)
  console.log(`[INFO] MX-Space API: ${MX_SPACE_API}`)
  console.log(`[INFO] Blog URL: ${BLOG_URL}`)
  console.log(`[INFO] Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`[INFO] ========================================`)
})

export default app

