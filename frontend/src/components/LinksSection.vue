<template>
  <div class="links-section container-custom">
    <h2 class="section-title">
      友链 <span class="gradient-text">LINKS</span>
    </h2>
    
    <div class="links-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <a 
        v-for="(link, index) in links" 
        :key="index"
        :href="link.url"
        target="_blank"
        class="link-item glass-effect rounded-xl p-5 flex items-center card-hover"
      >
        <div class="avatar w-16 h-16 rounded-full flex items-center justify-center text-3xl mr-4 flex-shrink-0"
             :style="{ background: link.gradient }">
          <span v-if="link.icon">{{ link.icon }}</span>
          <img v-else-if="link.avatar" :src="link.avatar" :alt="link.name" class="w-full h-full rounded-full object-cover">
        </div>
        <div class="link-info flex-1 overflow-hidden">
          <h5 class="link-name text-base font-medium mb-1">{{ link.name }}</h5>
          <p class="link-desc text-xs text-white/60 truncate">{{ link.description }}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
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

