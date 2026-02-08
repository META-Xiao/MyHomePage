<template>
  <nav class="side-navigation fixed left-8 bottom-0 z-[2333] transform -rotate-90 origin-bottom-left">
    <div class="flex items-center gap-3 font-mono text-sm">
      <a 
        v-for="(item, index) in navItems" 
        :key="item.id"
        :href="`#${item.id}`"
        :class="['nav-link', { active: activeSection === item.id }]"
        @click.prevent="scrollToSection(item.id)"
      >
        {{ item.label }}
      </a>
      <span class="clip"></span>
      <span class="time text-white/40 text-xs">{{ currentTime }}</span>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const navItems = [
  { id: 'intro', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'projects', label: '项目' },
  { id: 'posts', label: '文章' },
  { id: 'links', label: '友链' },
  { id: 'contact', label: '联系' }
]

const activeSection = ref('intro')
const currentTime = ref('')

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

const handleScroll = () => {
  const sections = navItems.map(item => ({
    id: item.id,
    element: document.getElementById(item.id)
  }))
  
  for (const section of sections) {
    if (section.element) {
      const rect = section.element.getBoundingClientRect()
      if (rect.top <= 200 && rect.bottom >= 200) {
        activeSection.value = section.id
        break
      }
    }
  }
}

onMounted(() => {
  updateTime()
  const timeInterval = setInterval(updateTime, 1000)
  window.addEventListener('scroll', handleScroll)
  
  onUnmounted(() => {
    clearInterval(timeInterval)
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<style scoped>
.nav-link {
  @apply inline-block text-white/50 no-underline mx-3 transition-all duration-300 tracking-wider;
}

.nav-link:hover,
.nav-link.active {
  @apply opacity-100 text-accent;
  text-shadow: 0 0 10px theme('colors.accent.DEFAULT');
}

.clip {
  @apply inline-block h-[3px] w-[3px] bg-white rounded-full mx-2;
}

@media (max-width: 768px) {
  .side-navigation {
    @apply left-0 bottom-0 transform-none w-full px-5 py-4 overflow-x-auto whitespace-nowrap;
    background: linear-gradient(180deg, transparent, rgba(10, 14, 39, 0.95));
  }
  
  .nav-link {
    @apply text-xs mx-2;
  }
}
</style>

