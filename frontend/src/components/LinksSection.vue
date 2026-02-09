<template>
  <div class="links-section container-custom">
    <h2 class="section-title">
      友链 <span class="gradient-text">LINKS</span>
    </h2>
    
    <div class="links-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LinkCard 
        v-for="(link, index) in links" 
        :key="index"
        :link="link"
      />
    </div>
  </div>
</template>

<script setup>
import LinkCard from './cards/LinkCard.vue'

const links = [
  {
    name: 'GitHub',
    description: '代码托管平台',
    url: 'https://github.com',
    icon: '🐙',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    name: 'MX-Space',
    description: '开源博客系统',
    url: 'https://mx-space.js.org/',
    icon: '📝',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    name: 'Vue.js',
    description: '渐进式 JavaScript 框架',
    url: 'https://vuejs.org/',
    icon: '💚',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    name: 'Tailwind CSS',
    description: '实用优先的 CSS 框架',
    url: 'https://tailwindcss.com/',
    icon: '🎨',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    name: 'Node.js',
    description: 'JavaScript 运行时',
    url: 'https://nodejs.org/',
    icon: '🟢',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    name: 'Docker',
    description: '容器化平台',
    url: 'https://www.docker.com/',
    icon: '🐳',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  }
]
</script>

<style scoped>
.section-title {
  @apply text-3xl md:text-4xl font-light tracking-[0.3em] text-white/50 pb-10 mb-12;
  position: relative;
}

.section-title::after {
  content: '';
  @apply block w-20 h-1 mt-8 rounded-full;
  background: linear-gradient(90deg, theme('colors.accent.DEFAULT'), theme('colors.accent.secondary'));
}
</style>

