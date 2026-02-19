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
    const data = await fetchPosts(1, 10)
    posts.value = data
  } catch (error) {
    console.error('Failed to fetch posts:', error)
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

