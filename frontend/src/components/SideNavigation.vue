<template>
  <nav class="side-navigation">
    <div class="nav-content">
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
      <span class="time">{{ currentTime }}</span>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const navItems = [
  { id: 'intro', label: '首页' },
  { id: 'about', label: '关于' },
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
  const timeInterval = setInterval(updateTime, 60000)
  window.addEventListener('scroll', handleScroll)
  
  onUnmounted(() => {
    clearInterval(timeInterval)
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<style scoped>
.side-navigation {
  position: fixed;
  left: 20px;
  bottom: 0;
  z-index: 2333;
  transform: rotate(-90deg) translateZ(0);
  transform-origin: 0 0;
  transition: all 0.3s ease-out;
  vertical-align: middle;
  font-family: 'Roboto', 'Tahoma', 'Consolas', 'Microsoft YaHei', sans-serif;
  /* 完全透明，无背景 */
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.clip {
  display: inline-block;
  height: 3px;
  width: 3px;
  background: #fff;
  border-radius: 100%;
  vertical-align: middle;
}

.nav-link {
  display: inline-block;
  font-size: 13px;
  color: #fff;
  text-decoration: none;
  margin: 0 10px;
  opacity: 0.4;
  transition: all 0.3s;
  vertical-align: middle;
}

.nav-link.active,
.nav-link:hover {
  text-decoration: underline;
  opacity: 1;
}

.time {
  display: inline-block;
  font-size: 13px;
  color: #fff;
  text-decoration: none;
  margin: 0 10px;
  opacity: 1;
  vertical-align: middle;
  font-family: 'Brush Script MT', 'Lucida Handwriting', 'Segoe Script', cursive;
  font-style: italic;
}

@media (max-width: 768px) {
  .side-navigation {
    padding: 15px 0;
    overflow: auto;
    font-size: 13px;
    left: 0;
    right: 0;
    top: inherit;
    bottom: 0;
    transform: rotate(0) translateZ(0);
    transform-origin: 0 100%;
    white-space: nowrap;
    width: 100%;
    background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.8));
  }
  
  .nav-content {
    overflow-x: auto;
    padding: 0 5%;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
  }
  
  .nav-content::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Opera */
  }
}

@media screen and (min-width: 1400px) {
  .nav-link,
  .time {
    font-size: 18px;
  }
}
</style>

