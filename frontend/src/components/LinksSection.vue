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
    icon: 'skill-icons:github-light'
  },
  {
    name: 'MX-Space',
    description: '开源博客系统',
    url: 'https://mx-space.js.org/',
    icon: 'skill-icons:nextjs-light'
  },
  {
    name: 'Vue.js',
    description: '渐进式 JavaScript 框架',
    url: 'https://vuejs.org/',
    icon: 'skill-icons:vuejs-light'
  },
  {
    name: 'Tailwind CSS',
    description: '实用优先的 CSS 框架',
    url: 'https://tailwindcss.com/',
    icon: 'skill-icons:tailwindcss-light'
  },
  {
    name: 'Node.js',
    description: 'JavaScript 运行时',
    url: 'https://nodejs.org/',
    icon: 'skill-icons:nodejs-light'
  },
  {
    name: 'Docker',
    description: '容器化平台',
    url: 'https://www.docker.com/',
    icon: 'skill-icons:docker'
  }
]
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

