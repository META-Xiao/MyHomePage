<template>
  <div class="home-page">
    <!-- Loading 动画 -->
    <LoadingScreen @loaded="onLoadingComplete" />
    
    <!-- 星轨背景 - 延伸到下方 -->
    <StarTrackBackground />
    
    <!-- 波浪遮罩 + 灰色背景  -->
    <div ref="transitionLayer" class="transition-layer">
      <!-- 多重动态波浪 -->
      <svg class="wave-separator" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path 
          ref="wave1"
          class="wave-path wave-1"
          d="M0,60 C360,30 720,90 1080,60 C1260,45 1350,75 1440,60 L1440,120 L0,120 Z" 
          fill="rgba(32, 32, 32, 0.4)"
        />
        <path 
          ref="wave2"
          class="wave-path wave-2"
          d="M0,50 C360,80 720,20 1080,50 C1260,65 1350,35 1440,50 L1440,120 L0,120 Z" 
          fill="rgba(32, 32, 32, 0.6)"
        />
        <path 
          ref="wave3"
          class="wave-path wave-3"
          d="M0,40 C360,10 720,70 1080,40 C1260,25 1350,55 1440,40 L1440,120 L0,120 Z" 
          fill="#202020"
        />
      </svg>
      <!-- 灰色背景紧接波浪 -->
      <div class="gray-background"></div>
    </div>
    
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
import { ref, onMounted } from 'vue'
import anime from 'animejs'
import LoadingScreen from '@/components/LoadingScreen.vue'
import StarTrackBackground from '@/components/StarTrackBackground.vue'
import SideNavigation from '@/components/SideNavigation.vue'
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import FindSection from '@/components/FindSection.vue'
import PostsSection from '@/components/PostsSection.vue'
import LinksSection from '@/components/LinksSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import FooterSection from '@/components/FooterSection.vue'

const transitionLayer = ref(null)
const wave1 = ref(null)
const wave2 = ref(null)
const wave3 = ref(null)
let scrollAnimation = null

// Loading 完成回调
const onLoadingComplete = () => {
  console.log('Loading complete!')
}

// 生成波浪路径
const generateWavePath = (baseY, amplitude, frequency, phase, segments = 6) => {
  const width = 1440
  const segmentWidth = width / segments
  
  // 起点使用与循环一致的频率计算
  const startY = baseY + amplitude * Math.sin((0 * frequency + phase) * Math.PI / 180)
  let path = `M0,${startY}`
  
  for (let i = 0; i < segments; i++) {
    const x = i * segmentWidth
    const y = baseY + amplitude * Math.sin((i * frequency + phase) * Math.PI / 180)
    const nextX = (i + 1) * segmentWidth
    const nextY = baseY + amplitude * Math.sin(((i + 1) * frequency + phase) * Math.PI / 180)
    
    // 贝塞尔曲线控制点
    const cpX = x + segmentWidth / 2
    const cpY = (y + nextY) / 2 + amplitude * 0.3 * Math.sin((i * frequency + phase + 45) * Math.PI / 180)
    
    path += ` C${cpX},${cpY} ${cpX},${cpY} ${nextX},${nextY}`
  }
  
  path += ` L1440,120 L0,120 Z`
  return path
}

const handleScroll = () => {
  const scrollY = window.scrollY
  const triggerDistance = window.innerHeight * 0.6
  const progress = Math.min(scrollY / triggerDistance, 1)
  
  // 计算过渡层的位置（从 100vh 移动到 25vh，让灰色背景占 75vh）
  const startTop = 100
  const endTop = 25
  const currentTop = startTop - (startTop - endTop) * progress
  
  if (transitionLayer.value && !scrollAnimation) {
    anime({
      targets: transitionLayer.value,
      top: `${currentTop}vh`,
      duration: 0,
      easing: 'linear'
    })
  }
}

onMounted(() => {
  if (transitionLayer.value) {
    transitionLayer.value.style.top = '100vh'
  }
  
  const animateWaves = () => {
    // 第一层波浪 - 慢速、大振幅、低频、随机基准高度
    anime({
      targets: { phase: 0, baseY: 60 },
      phase: 360,
      baseY: [
        { value: 55, duration: 6000, easing: 'easeInOutQuad' },
        { value: 65, duration: 6000, easing: 'easeInOutQuad' }
      ],
      duration: 12000,
      easing: 'linear',
      loop: true,
      update: function(anim) {
        if (wave1.value) {
          const phase = anim.animations[0].currentValue
          const baseY = anim.animations[1].currentValue
          const path = generateWavePath(baseY, 15, 60, phase, 4)
          wave1.value.setAttribute('d', path)
        }
      }
    })
    
    // 第二层波浪 - 中速、中振幅、中频、随机基准高度
    anime({
      targets: { phase: 0, baseY: 50 },
      phase: 360,
      baseY: [
        { value: 45, duration: 4000, easing: 'easeInOutQuad' },
        { value: 55, duration: 4000, easing: 'easeInOutQuad' }
      ],
      duration: 8000,
      easing: 'linear',
      loop: true,
      update: function(anim) {
        if (wave2.value) {
          const phase = anim.animations[0].currentValue
          const baseY = anim.animations[1].currentValue
          const path = generateWavePath(baseY, 20, 90, phase, 5)
          wave2.value.setAttribute('d', path)
        }
      }
    })
    
    // 第三层波浪 - 快速、小振幅、高频（前景深色，保持固定）
    anime({
      targets: { phase: 0 },
      phase: 360,
      duration: 5000,
      easing: 'linear',
      loop: true,
      update: function(anim) {
        if (wave3.value) {
          const phase = anim.animations[0].currentValue
          const path = generateWavePath(40, 12, 120, phase, 6)
          wave3.value.setAttribute('d', path)
        }
      }
    })
  }
  
  animateWaves()
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -80px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const isScrollingDown = entry.boundingClientRect.top > 0
        if (isScrollingDown) {
          entry.target.classList.remove('animate-bounce-in-up')
          entry.target.classList.add('animate-bounce-in-down')
        } else {
          entry.target.classList.remove('animate-bounce-in-down')
          entry.target.classList.add('animate-bounce-in-up')
        }
      } else {
        entry.target.classList.remove('animate-bounce-in-down', 'animate-bounce-in-up')
      }
    })
  }, observerOptions)

  document.querySelectorAll('.section-wrapper').forEach(el => {
    observer.observe(el)
  })
  
  let ticking = false
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll()
        ticking = false
      })
      ticking = true
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true })
  handleScroll()
})
</script>

<style scoped>
.home-page {
  position: relative;
  min-height: 100vh;
}

/* 过渡层 - 波浪 + 灰色背景紧密贴合 */
.transition-layer {
  position: fixed;
  left: 0;
  top: 100vh;
  width: 100%;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  will-change: top;
}

/* 波浪分隔符 */
.wave-separator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120px;
  display: block;
}

/* 波浪路径 - 多层叠加 */
.wave-path {
  will-change: d;
}

/* 灰色背景紧接波浪底部 */
.gray-background {
  position: absolute;
  top: 120px;
  left: 0;
  width: 100%;
  height: calc(100vh - 120px);
  background: #202020;
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

