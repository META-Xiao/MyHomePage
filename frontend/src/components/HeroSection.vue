<template>
  <div class="hero-section container-custom">
    <!-- 左下角：文字内容 -->
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const mainTitle = ref('加载中...')
const currentSlogan = ref('')

// 获取一言
const fetchHitokoto = async () => {
  try {
    const response = await axios.get('https://v1.hitokoto.cn/?c=a&c=b&c=d&c=i')
    const data = response.data
    mainTitle.value = data.hitokoto
    currentSlogan.value = data.from ? `—— ${data.from}` : ''
  } catch (error) {
    console.error('获取一言失败:', error)
    mainTitle.value = '即使是最小的 margin'
    currentSlogan.value = '也值得被认真对待'
  }
}

const rotateHitokoto = () => {
  const slogan = document.getElementById('slogan')
  const title = document.querySelector('.hero-title')
  
  if (slogan && title) {
    slogan.classList.add('fade-out')
    title.classList.add('fade-out')
    
    setTimeout(async () => {
      await fetchHitokoto()
      
      slogan.classList.remove('fade-out')
      slogan.classList.add('fade-in')
      title.classList.remove('fade-out')
      title.classList.add('fade-in')
      
      setTimeout(() => {
        slogan.classList.remove('fade-in')
        title.classList.remove('fade-in')
      }, 500)
    }, 500)
  }
}

onMounted(() => {
  fetchHitokoto()
  setInterval(rotateHitokoto, 15000) // 每15秒切换一次
})
</script>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding-bottom: 80px;
}

/* 左下角：文字内容 */
.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 800px;
}

.hero-text-group {
  margin-bottom: 30px;
  animation-delay: 0.2s;
}

/* 三色圆点 */
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
  font-weight: 700;
  font-size: 32px;
  line-height: 1.5em;
  letter-spacing: 0.3em;
  color: #fff;
  margin-bottom: 0.6em;
  animation: float 6s ease-in-out infinite;
  font-family: 'Microsoft YaHei', '微软雅黑', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}

.hero-subtitle {
  font-weight: 400;
  font-size: 18px;
  line-height: 1.5em;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.8);
  animation: float 6s ease-in-out infinite;
  animation-delay: 0.5s;
  font-family: 'Microsoft YaHei', '微软雅黑', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
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

#slogan.fade-in,
.hero-title.fade-in {
  opacity: 1;
  transform: translateY(0);
}

#slogan.fade-out,
.hero-title.fade-out {
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
  animation-delay: 0.4s;
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
@media (max-width: 768px) {
  .hero-section {
    align-items: center;
    justify-content: center;
    padding-bottom: 40px;
  }
  
  .hero-content {
    align-items: center;
    text-align: center;
  }
  
  .hero-title {
    font-size: 22px;
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
    font-size: 42px;
  }
  
  .hero-subtitle {
    font-size: 24px;
  }
}
</style>

