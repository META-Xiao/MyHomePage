import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.PROD ? 'https://api.teslongxiao.cn/api/v2' : '/api/v2',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 获取文章列表
export const fetchPosts = async (page = 1, size = 10) => {
  try {
    const response = await apiClient.get('/posts', {
      params: { 
        page, 
        size
      }
    })
    
    const posts = response.data || []
    return posts.map(post => ({
      title: post.title,
      category: post.category?.name || '未分类',
      date: new Date(post.created).toLocaleDateString('zh-CN'),
      excerpt: post.text?.substring(0, 120) || post.summary || '暂无摘要',
      tags: post.tags || [],
      views: post.count?.read || 0,
      link: `https://teslongxiao.cn/posts/${post.category?.slug || 'post'}/${post.slug}`
    }))
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return []
  }
}

export const fetchPostDetail = async (id) => {
  try {
    const response = await apiClient.get(`/posts/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch post detail:', error)
    return null
  }
}

export const fetchLinks = async () => {
  try {
    const response = await apiClient.get('/links')
    return response.data || []
  } catch (error) {
    console.error('Failed to fetch links:', error)
    return []
  }
}

export const fetchProjects = async () => {
  try {
    const response = await apiClient.get('/projects')
    return response.data || []
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return []
  }
}

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

