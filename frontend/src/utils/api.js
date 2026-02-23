import axios from 'axios'

// 创建 axios 实例 - 通过后端代理访问 Mix Space API
const apiClient = axios.create({
  baseURL: '/api',
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

// 获取文章列表 - 后端已经处理好数据格式
export const fetchPosts = async (page = 1, size = 10) => {
  try {
    const response = await apiClient.get('/posts', {
      params: { 
        page, 
        size
      }
    })
    
    // 后端返回格式: { success: true, data: [...] }
    return response.data || []
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

 export const fetchHeatmapData = async (year) => {
  try {
    const response = await apiClient.get('/heatmap', {
      params: { year }
    })
    return response.data || []
  } catch (error) {
    console.error('Failed to fetch heatmap data:', error)
    return []
  }
}

export default apiClient

