<template>
  <div class="home-page">
    <!-- 星轨背景 - 延伸到下方 -->
    <StarTrackBackground />
    
    <!-- 灰色背景 - 滚动后才显示 -->
    <div class="gray-background" :style="{ top: grayBgTop, height: grayBgHeight, opacity: scrollProgress }"></div>
    
    <!-- 侧边导航 -->
    <SideNavigation />
    
    <!-- 首页介绍 -->
    <section id="intro" class="intro-section">
      <HeroSection />
    </section>

    <!-- 关于我 -->
    <section id="about" class="section-wrapper">
      <AboutSection />
    </section>

    <!-- 我会在哪儿 -->
    <section id="projects" class="section-wrapper">
      <FindSection />
    </section>

    <!-- 最新文章 -->
    <section id="posts" class="section-wrapper">
      <PostsSection />
    </section>

    <!-- 友情链接 -->
    <section id="links" class="section-wrapper">
      <LinksSection />
    </section>

    <!-- 联系方式 -->
    <section id="contact" class="section-wrapper">
      <ContactSection />
    </section>

    <!-- 页脚 -->
    <FooterSection />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import StarTrackBackground from '@/components/StarTrackBackground.vue'
import SideNavigation from '@/components/SideNavigation.vue'
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import FindSection from '@/components/FindSection.vue'
import PostsSection from '@/components/PostsSection.vue'
import LinksSection from '@/components/LinksSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import FooterSection from '@/components/FooterSection.vue'

const isScrolled = ref(false)
const scrollProgress = ref(0)

// 计算灰色背景的位置和高度
const grayBgTop = computed(() => {
  const start = 100
  const end = 38.2
  const top = start - (start - end) * scrollProgress.value
  return `${top}vh`
})

const grayBgHeight = computed(() => {
  const start = 0
  const end = 61.8
  const height = start + end * scrollProgress.value
  return `${height}vh`
})

const handleScroll = () => {
  const scrollY = window.scrollY
  const triggerDistance = window.innerHeight * 0.6  // 滚动 60vh 才完全上移
  
  // 计算进度 (0 到 1)
  scrollProgress.value = Math.min(scrollY / triggerDistance, 1)
  isScrolled.value = scrollProgress.value > 0
}

onMounted(() => {
  // 初始化滚动动画观察器 - 双向弹出效果
  const observerOptions = {
    threshold: 0.2,  // 元素露出 20% 就触发
    rootMargin: '0px 0px -80px 0px'  // 提前 80px 触发
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 判断滚动方向
        const isScrollingDown = entry.boundingClientRect.top > 0
        if (isScrollingDown) {
          // 向下滚动：从下方弹出
          entry.target.classList.remove('animate-bounce-in-up')
          entry.target.classList.add('animate-bounce-in-down')
        } else {
          // 向上滚动：从上方弹出
          entry.target.classList.remove('animate-bounce-in-down')
          entry.target.classList.add('animate-bounce-in-up')
        }
      } else {
        // 离开视口时移除动画类，可以重新触发
        entry.target.classList.remove('animate-bounce-in-down', 'animate-bounce-in-up')
      }
    })
  }, observerOptions)

  // 观察所有需要动画的元素
  document.querySelectorAll('.section-wrapper').forEach(el => {
    observer.observe(el)
  })
  
  // 监听滚动
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll() // 初始检查
})
</script>

<style scoped>
.home-page {
  position: relative;
  min-height: 100vh;
}

/* 灰色背景 - 动态调整 */
.gray-background {
  position: fixed;
  left: 0;
  width: 100%;
  background: #202020;
  z-index: 0;
  pointer-events: none;
  transition: all 0.1s linear;  /* 线性过渡，跟随滚动 */
}

.intro-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.section-wrapper {
  position: relative;
  z-index: 2;
  padding: 120px 0;
  opacity: 0;
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

/* 从下方弹出 - 向下滚动时 */
.section-wrapper.animate-bounce-in-down {
  animation: bounceInDown 0.7s cubic-bezier(0.34, 1.35, 0.64, 1) forwards;
}

/* 从上方弹出 - 向上滚动时 */
.section-wrapper.animate-bounce-in-up {
  animation: bounceInUp 0.7s cubic-bezier(0.34, 1.35, 0.64, 1) forwards;
}

@keyframes bounceInDown {
  0% {
    opacity: 0;
    transform: translateY(60px) scale(0.96);
  }
  60% {
    opacity: 1;
    transform: translateY(-8px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bounceInUp {
  0% {
    opacity: 0;
    transform: translateY(-60px) scale(0.96);
  }
  60% {
    opacity: 1;
    transform: translateY(8px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .intro-section {
    padding-bottom: 80px;
  }
  
  .section-wrapper {
    padding: 80px 0;
  }
}
</style>

