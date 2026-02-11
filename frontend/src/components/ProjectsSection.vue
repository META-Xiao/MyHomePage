<template>
  <div class="find-section container-custom">
    <h2 class="section-title">
      我会在哪儿？
    </h2>
    
    <div class="links">
      <div class="col-3">
        <a 
          v-for="(item, index) in topLinks" 
          :key="index"
          :href="item.link"
          target="_blank"
          class="item scroll-animate"
          :class="{ visible: isVisible }"
        >
          <div class="inner">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
          <div class="bg" :style="{ backgroundColor: item.color }"></div>
        </a>
      </div>
      
      <div class="links-grid">
        <a 
          v-for="(item, index) in bottomLinks" 
          :key="index"
          :href="item.link"
          target="_blank"
          class="item scroll-animate"
          :class="{ visible: isVisible }"
        >
          <div class="inner">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
          <div class="bg" :style="{ backgroundColor: item.color }"></div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

const topLinks = [
  {
    name: '我的博客！',
    icon: '📖',
    link: 'https://teslongxiao.cn',
    color: '#3b82f6'
  },
  {
    name: '网站统计',
    icon: '📊',
    link: '#',
    color: '#f59e0b'
  },
  {
    name: '服务器状态',
    icon: '💻',
    link: '#',
    color: '#10b981'
  }
]

const bottomLinks = [
  {
    name: 'Telegram',
    icon: '✈️',
    link: '#',
    color: '#0088cc'
  },
  {
    name: 'Twitter',
    icon: '🐦',
    link: '#',
    color: '#1da1f2'
  },
  {
    name: 'CloudMusic',
    icon: '🎵',
    link: '#',
    color: '#c20c0c'
  },
  {
    name: 'Bilibili',
    icon: '📺',
    link: '#',
    color: '#fb7299'
  },
  {
    name: 'Github',
    icon: '🐙',
    link: 'https://github.com',
    color: '#333'
  }
]

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    },
    { threshold: 0.2 }
  )
  
  const section = document.querySelector('.find-section')
  if (section) {
    observer.observe(section)
  }
})
</script>

<style scoped>
.find-section {
  padding: 80px 0;
}

.section-title {
  font-size: 26px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.5);
  padding-bottom: 30px;
  font-weight: 400;
  position: relative;
}

.section-title:after {
  content: '';
  display: block;
  width: 10%;
  height: 5px;
  background-color: rgba(255, 255, 255, 0.5);
  margin-top: 30px;
}

.links {
  width: 100%;
}

.col-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
}

.item {
  position: relative;
  height: 80px;
  line-height: 80px;
  padding: 5px 0;
  text-align: center;
  transition: all 0.2s;
  opacity: 0.9;
  text-decoration: none;
  color: #fff;
  overflow: hidden;
}

.item:hover {
  opacity: 1;
  transform: translateY(-10px);
}

.item .inner {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.item i {
  font-size: 24px;
  font-style: normal;
  margin-bottom: 5px;
}

.item span {
  display: block;
  font-size: 14px;
  letter-spacing: 0.05em;
}

.item .bg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.8%;
  z-index: 0;
  transition: all 0.15s;
}

.item:hover .bg {
  height: 100%;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 3px 20px rgba(0, 0, 0, 0.28);
}

/* 滚动动画 */
.scroll-animate {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.scroll-animate.visible {
  opacity: 0.9;
  transform: translateY(0);
}

.scroll-animate:hover.visible {
  opacity: 1;
}

/* 响应式 */
@media (max-width: 768px) {
  .col-3 {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .links-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .item {
    height: 60px;
    line-height: 60px;
    font-size: 13px;
    padding: 5px 0;
  }
  
  .item i {
    font-size: 20px;
  }
  
  .item span {
    font-size: 12px;
  }
}
</style>
