<template>
  <div class="hero-section container-custom">
    <div class="hero-layout">
      <!-- 左侧：三体星系 -->
      <div class="star-system-container animate-fade-in-up">
        <TripleStarSystem />
      </div>
      
      <!-- 右下角：文字内容 -->
      <div class="hero-content">
        <!-- 三色圆点 -->
        <div class="circle">
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div class="hero-text-group animate-fade-in-up">
          <h1 class="hero-title">
            {{ mainTitle }}
          </h1>
          
          <h2 class="hero-subtitle" id="slogan">
            {{ currentSlogan }}
          </h2>
        </div>
        
        <!-- 底部签名 -->
        <div class="hero-footer animate-fade-in-up">
          <div class="circle-inline">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="signature">teslongxiao.cn の デジタル空間</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TripleStarSystem from './TripleStarSystem.vue'

const mainTitle = ref('即使是最小的 margin')
const currentSlogan = ref('也值得被认真对待')

const titles = [
  { main: '即使是最小的 margin', sub: '也值得被认真对待' },
  { main: '在 git push 之前', sub: '记得先 pull 一下吧' },
  { main: '代码如诗', sub: '每一行都是艺术' },
  { main: '折腾是态度', sub: '创造是信仰' }
]

let titleIndex = 0

const rotateTitle = () => {
  const slogan = document.getElementById('slogan')
  if (slogan) {
    slogan.classList.add('fade-out')
    
    setTimeout(() => {
      titleIndex = (titleIndex + 1) % titles.length
      mainTitle.value = titles[titleIndex].main
      currentSlogan.value = titles[titleIndex].sub
      
      slogan.classList.remove('fade-out')
      slogan.classList.add('fade-in')
      
      setTimeout(() => {
        slogan.classList.remove('fade-in')
      }, 500)
    }, 500)
  }
}

onMounted(() => {
  setInterval(rotateTitle, 10000)
})
</script>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-layout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  gap: 60px;
}

/* 左侧：三体星系 */
.star-system-container {
  flex: 0 0 500px;
  animation-delay: 0.2s;
}

/* 右侧：文字内容 */
.hero-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  min-height: 400px;
  padding-bottom: 40px;
}

.hero-text-group {
  margin-bottom: 40px;
  animation-delay: 0.4s;
}

/* 三色圆点 - 顶部 */
.circle {
  margin-bottom: 20px;
}

.circle span {
  display: inline-block;
  width: 13px;
  height: 13px;
  background-color: #fff;
  border-radius: 100%;
  margin-right: 5px;
}

.circle span:first-child {
  background-color: #ff493f;
}

.circle span:nth-child(2) {
  background-color: #f7c900;
}

.circle span:nth-child(3) {
  background-color: #00ff37;
}

/* 标题样式 */
.hero-title {
  font-weight: 400;
  font-size: 42px;
  line-height: 1.5em;
  letter-spacing: 0.5em;
  color: #fff;
  margin-bottom: 0.6em;
  animation: float 6s ease-in-out infinite;
}

.hero-subtitle {
  font-weight: 400;
  font-size: 22px;
  line-height: 1.5em;
  letter-spacing: 0.2em;
  color: #fff;
  animation: float 6s ease-in-out infinite;
  animation-delay: 0.5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 标题切换动画 */
#slogan {
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}

#slogan.fade-in {
  opacity: 1;
  transform: translateY(0);
}

#slogan.fade-out {
  opacity: 0;
  transform: translateY(-10px);
}

/* 底部签名 */
.hero-footer {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  font-family: 'Roboto', 'Consolas', monospace;
  display: flex;
  align-items: center;
  gap: 10px;
  animation-delay: 0.6s;
}

.circle-inline {
  display: inline-flex;
  gap: 5px;
}

.circle-inline span {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 100%;
}

.circle-inline span:first-child {
  background-color: #ff493f;
}

.circle-inline span:nth-child(2) {
  background-color: #f7c900;
}

.circle-inline span:nth-child(3) {
  background-color: #00ff37;
}

.signature {
  letter-spacing: 0.1em;
}

/* 移动端适配 */
@media (max-width: 1024px) {
  .hero-layout {
    flex-direction: column;
    gap: 40px;
  }
  
  .star-system-container {
    flex: 0 0 auto;
  }
  
  .hero-content {
    align-items: center;
    text-align: center;
    padding-bottom: 0;
  }
  
  .circle {
    text-align: center;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-subtitle {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .star-system-container {
    transform: scale(0.8);
  }
  
  .hero-title {
    font-size: 26px;
  }
  
  .hero-subtitle {
    font-size: 14px;
  }
  
  .hero-footer {
    font-size: 12px;
  }
}

/* 大屏幕适配 */
@media screen and (min-width: 1400px) {
  .hero-title {
    font-size: 52px;
  }
  
  .hero-subtitle {
    font-size: 28px;
  }
}
</style>

