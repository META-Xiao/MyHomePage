<template>
  <div class="home-page">
    <!-- 星轨背景 - 延伸到下方 -->
    <StarTrackBackground />
    
    <!-- 灰色背景 - 从底部开始 -->
    <div class="gray-background"></div>
    
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

    <!-- 项目展示 -->
    <section id="projects" class="section-wrapper">
      <ProjectsSection />
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
import { onMounted } from 'vue'
import StarTrackBackground from '@/components/StarTrackBackground.vue'
import SideNavigation from '@/components/SideNavigation.vue'
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import PostsSection from '@/components/PostsSection.vue'
import LinksSection from '@/components/LinksSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import FooterSection from '@/components/FooterSection.vue'

onMounted(() => {
  // 初始化滚动动画观察器
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up')
      }
    })
  }, observerOptions)

  // 观察所有需要动画的元素
  document.querySelectorAll('.section-wrapper').forEach(el => {
    observer.observe(el)
  })
})
</script>

<style scoped>
.home-page {
  position: relative;
  min-height: 100vh;
}

/* 灰色背景从 75vh 开始，覆盖剩余所有内容 */
.gray-background {
  position: absolute;
  top: 75vh;
  left: 0;
  width: 100%;
  min-height: calc(100% - 75vh);
  background: #1a1a1a;
  z-index: 1;
}

.intro-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  margin-left: 120px;
}

.section-wrapper {
  position: relative;
  z-index: 2;
  padding: 120px 0;
  opacity: 0;
  transform: translateY(50px);
  margin-left: 120px;
}

.section-wrapper.animate-fade-in-up {
  animation: fadeInUp 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .intro-section {
    margin-left: 0;
    padding-bottom: 80px;
  }
  
  .section-wrapper {
    padding: 80px 0;
    margin-left: 0;
  }
}
</style>

