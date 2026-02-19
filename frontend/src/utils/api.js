import axios from 'axios'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: 'https://api.teslongxiao.cn/api/v2',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 获取文章列表 - 适配 Mix Space API
export const fetchPosts = async (page = 1, size = 10) => {
  try {
    const response = await apiClient.get('/posts', {
      params: { 
        page, 
        size,
        sortBy: 'created',
        sortOrder: -1
      }
    })
    
    // 适配 Mix Space API 数据格式
    const posts = response.data || []
    return posts.map(post => ({
      title: post.title,
      category: post.category?.name || '未分类',
      date: new Date(post.created).toLocaleDateString('zh-CN'),
      excerpt: post.text?.substring(0, 120) + '...' || post.summary || '暂无摘要',
      tags: post.tags || [],
      views: post.count?.read || 0,
      link: `https://teslongxiao.cn/posts/${post.category?.slug || 'post'}/${post.slug}`
    }))
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return []
  }
}

// 获取文章详情
export const fetchPostDetail = async (id) => {
  try {
    const response = await apiClient.get(`/posts/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch post detail:', error)
    return null
  }
}

// 获取友链列表
export const fetchLinks = async () => {
  try {
    const response = await apiClient.get('/links')
    return response.data || []
  } catch (error) {
    console.error('Failed to fetch links:', error)
    return []
  }
}

// 获取项目列表
export const fetchProjects = async () => {
  try {
    const response = await apiClient.get('/projects')
    return response.data || []
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return []
  }
}

// 获取站点统计信息
export const fetchSiteStats = async () => {
  try {
    const response = await apiClient.get('/stats')
    return response.data
  } catch (error) {
    console.error('Failed to fetch site stats:', error)
    return null
  }
}

export default apiClient

