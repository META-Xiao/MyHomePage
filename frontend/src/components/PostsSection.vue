<template>
  <div class="posts-section container-custom">
    <h2 class="section-title">
      文章 <span class="gradient-text">POSTS</span>
    </h2>
    
    <div v-if="loading" class="loading-container text-center py-16">
      <div class="loading flex justify-center gap-2 mb-6">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <p class="text-white/50">正在加载文章...</p>
    </div>
    
    <div v-else class="posts-grid grid grid-cols-1 md:grid-cols-2 gap-8">
      <PostCard 
        v-for="(post, index) in posts" 
        :key="index"
        :post="post"
      />
    </div>
    
    <div class="view-more-container text-center mt-12">
      <a href="https://teslongxiao.cn" target="_blank" class="btn-primary">
        查看更多文章 →
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchPosts } from '@/utils/api'
import PostCard from './cards/PostCard.vue'

const loading = ref(true)
const posts = ref([])

onMounted(async () => {
  try {
    const data = await fetchPosts()
    posts.value = data
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    // 使用模拟数据
    posts.value = [
      {
        title: '使用 Vue 3 和 Tailwind CSS 构建现代化网站',
        category: '前端开发',
        date: '2024-02-08',
        excerpt: '探索如何使用 Vue 3 的组合式 API 和 Tailwind CSS 快速构建美观且高性能的现代化网站...',
        tags: ['Vue', 'Tailwind', 'Web'],
        views: 1234,
        link: 'https://teslongxiao.cn'
      },
      {
        title: 'Docker 容器化部署实践指南',
        category: '运维',
        date: '2024-02-05',
        excerpt: '详细介绍如何使用 Docker 进行应用容器化，包括 Dockerfile 编写、镜像构建和容器编排...',
        tags: ['Docker', 'DevOps'],
        views: 856,
        link: 'https://teslongxiao.cn'
      },
      {
        title: 'Node.js 性能优化技巧',
        category: '后端开发',
        date: '2024-02-01',
        excerpt: '分享 Node.js 应用性能优化的实用技巧，包括异步处理、内存管理和缓存策略...',
        tags: ['Node.js', '性能优化'],
        views: 2341,
        link: 'https://teslongxiao.cn'
      },
      {
        title: 'Canvas 动画效果实现',
        category: '前端开发',
        date: '2024-01-28',
        excerpt: '使用 Canvas API 创建炫酷的动画效果，包括粒子系统、星空背景等视觉特效...',
        tags: ['Canvas', 'Animation'],
        views: 1567,
        link: 'https://teslongxiao.cn'
      }
    ]
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.section-title {
  @apply text-3xl md:text-4xl font-light tracking-[0.3em] text-white/50 pb-10 mb-12;
  position: relative;
  font-family: 'Microsoft YaHei', '微软雅黑', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
  font-weight: 500;
}

.section-title .gradient-text {
  font-family: 'Brush Script MT', 'Lucida Handwriting', 'Segoe Script', 'Pacifico', cursive;
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0.1em;
}

.section-title::after {
  content: '';
  @apply block w-20 h-1 mt-8 rounded-full;
  background: linear-gradient(90deg, theme('colors.accent.DEFAULT'), theme('colors.accent.secondary'));
}

.dot {
  @apply inline-block w-3 h-3 rounded-full bg-accent animate-pulse;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

