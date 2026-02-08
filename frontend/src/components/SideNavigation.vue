<template>
  <nav class="side-navigation fixed left-0 top-0 h-screen z-[2333] flex flex-col justify-between py-12 px-6">
    <!-- Logo 和时间 -->
    <div class="nav-header">
      <div class="logo-wrapper mb-8 group cursor-pointer">
        <div class="circle flex gap-1.5 mb-3">
          <span class="dot bg-[#ff493f]"></span>
          <span class="dot bg-[#f7c900]"></span>
          <span class="dot bg-[#00ff37]"></span>
        </div>
        <div class="text-xs text-white/40 font-mono tracking-wider group-hover:text-accent transition-colors">
          {{ currentTime }}
        </div>
      </div>
    </div>

    <!-- 导航链接 -->
    <div class="nav-links flex flex-col gap-6 flex-1 justify-center">
      <a 
        v-for="(item, index) in navItems" 
        :key="item.id"
        :href="`#${item.id}`"
        :class="['nav-link group', { active: activeSection === item.id }]"
        @click.prevent="scrollToSection(item.id)"
        :style="{ transitionDelay: `${index * 50}ms` }"
      >
        <span class="nav-link-text">{{ item.label }}</span>
        <span class="nav-link-line"></span>
      </a>
    </div>

    <!-- 底部信息 -->
    <div class="nav-footer">
      <div class="writing-mode-vertical text-xs text-white/30 font-mono tracking-widest hover:text-accent transition-colors cursor-default">
        libxcnya.so の Catnest
      </div>
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
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
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
.side-navigation {
  width: 120px;
  background: linear-gradient(90deg, rgba(10, 14, 39, 0.95), transparent);
  backdrop-filter: blur(10px);
}

.dot {
  @apply inline-block w-2.5 h-2.5 rounded-full;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

.nav-link {
  @apply relative flex flex-col items-start text-white/50 no-underline transition-all duration-500;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 14px;
  letter-spacing: 0.2em;
  padding: 8px 0;
}

.nav-link-text {
  @apply relative z-10 transition-all duration-500;
}

.nav-link-line {
  @apply absolute left-[-12px] top-1/2 w-0 h-[2px] bg-accent transition-all duration-500;
  transform: translateY(-50%);
  opacity: 0;
}

.nav-link:hover .nav-link-text,
.nav-link.active .nav-link-text {
  @apply text-accent;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
  transform: translateX(-8px);
}

.nav-link:hover .nav-link-line,
.nav-link.active .nav-link-line {
  width: 40px;
  opacity: 1;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.8);
}

.nav-link.active .nav-link-line {
  animation: pulse-line 2s ease-in-out infinite;
}

@keyframes pulse-line {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.8);
  }
  50% {
    opacity: 0.5;
    box-shadow: 0 0 20px rgba(0, 212, 255, 1);
  }
}

.writing-mode-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .side-navigation {
    @apply left-0 bottom-0 top-auto h-auto w-full px-5 py-4 flex-row items-center;
    background: linear-gradient(180deg, transparent, rgba(10, 14, 39, 0.98));
  }
  
  .nav-header {
    @apply hidden;
  }
  
  .nav-links {
    @apply flex-row gap-4 overflow-x-auto whitespace-nowrap flex-1 justify-start;
  }
  
  .nav-link {
    @apply text-xs;
    writing-mode: horizontal-tb;
  }
  
  .nav-link-line {
    @apply left-0 top-auto bottom-[-8px] w-full h-[2px];
  }
  
  .nav-link:hover .nav-link-text,
  .nav-link.active .nav-link-text {
    transform: translateY(-4px);
  }
  
  .nav-footer {
    @apply hidden;
  }
}
</style>

