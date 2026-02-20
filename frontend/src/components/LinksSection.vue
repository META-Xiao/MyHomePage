<template>
  <div class="links-section container-custom">
    <h2 class="section-title">
      友链 <span class="gradient-text">LINKS</span>
    </h2>
    
    <div v-if="loading" class="text-center text-white/50 py-10">
      加载中...
    </div>
    
    <div v-else-if="links.length === 0" class="text-center text-white/50 py-10">
      暂无友链
    </div>
    
    <div v-else class="links-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LinkCard 
        v-for="(link, index) in links" 
        :key="index"
        :link="link"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LinkCard from './cards/LinkCard.vue'
import { fetchLinks } from '../utils/api'

const links = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    links.value = await fetchLinks()
  } catch (error) {
    console.error('获取友链失败:', error)
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
</style>

