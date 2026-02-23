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
          {{ displayedTitle }}<span class="cursor" v-show="currentCursor === 'title'" :class="{ 'fade-out-cursor': fadeCursor }">|</span>
        </h1>
        
        <h2 class="hero-subtitle" id="slogan">
          {{ displayedSlogan }}<span class="cursor" v-show="currentCursor === 'slogan'" :class="{ 'fade-out-cursor': fadeCursor }">|</span>
        </h2>
      </div>
      
      <!-- 底部签名 -->
      <div class="hero-footer animate-fade-in-up">
        <div class="circle-inline">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="signature">www.teslongxiao.cn の デジタル空間</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const mainTitle = ref('')
const currentSlogan = ref('')
const displayedTitle = ref('')
const displayedSlogan = ref('')
const currentCursor = ref('') // 'title', 'slogan', 或 ''
const fadeCursor = ref(false)

let typingTimer = null
let rotateTimer = null

// 获取一言
const fetchHitokoto = async () => {
  try {
    const response = await axios.get('https://v1.hitokoto.cn/?c=a&c=b&c=d&c=i')
    const data = response.data
    return {
      title: data.hitokoto,
      slogan: data.from ? `—— ${data.from}` : ''
    }
  } catch (error) {
    console.error('获取一言失败:', error)
    return {
      title: '即使是最小的 margin',
      slogan: '也值得被认真对待'
    }
  }
}

// 打字机效果
const typeWriter = async (text, target, cursorPosition, speed = 80) => {
  currentCursor.value = cursorPosition
  fadeCursor.value = false
  
  for (let i = 0; i <= text.length; i++) {
    target.value = text.substring(0, i)
    await new Promise(resolve => setTimeout(resolve, speed))
  }
}

// Backspace 删除效果
const backspace = async (target, cursorPosition, speed = 30) => {
  currentCursor.value = cursorPosition
  fadeCursor.value = false
  
  const text = target.value
  for (let i = text.length; i >= 0; i--) {
    target.value = text.substring(0, i)
    await new Promise(resolve => setTimeout(resolve, speed))
  }
}

// 完整的打字循环
const typewriterCycle = async () => {
  // 等待10秒
  await new Promise(resolve => setTimeout(resolve, 10000))
  
  // 删除当前内容
  await backspace(displayedSlogan, 'slogan', 30)
  await backspace(displayedTitle, 'title', 30)
  
  // 隐藏光标
  currentCursor.value = ''
  
  // 等待一小段时间
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 获取新内容
  const newContent = await fetchHitokoto()
  mainTitle.value = newContent.title
  currentSlogan.value = newContent.slogan
  
  // 打字显示新内容
  await typeWriter(newContent.title, displayedTitle, 'title', 80)
  await new Promise(resolve => setTimeout(resolve, 300))
  await typeWriter(newContent.slogan, displayedSlogan, 'slogan', 60)
  
  // 打完字后等待3秒，然后淡出光标
  await new Promise(resolve => setTimeout(resolve, 3000))
  fadeCursor.value = true
  
  // 淡出动画完成后隐藏光标
  await new Promise(resolve => setTimeout(resolve, 1000))
  currentCursor.value = ''
}

// 启动循环
const startTypingLoop = async () => {
  const initialContent = await fetchHitokoto()
  mainTitle.value = initialContent.title
  currentSlogan.value = initialContent.slogan
  
  await typeWriter(initialContent.title, displayedTitle, 'title', 80)
  await new Promise(resolve => setTimeout(resolve, 300))
  await typeWriter(initialContent.slogan, displayedSlogan, 'slogan', 60)
  
  // 打完字后等待3秒，然后淡出光标
  await new Promise(resolve => setTimeout(resolve, 3000))
  fadeCursor.value = true
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  currentCursor.value = ''
  
  // 设置循环
  const loop = async () => {
    await typewriterCycle()
    rotateTimer = setTimeout(loop, 0)
  }
  
  rotateTimer = setTimeout(loop, 0)
}

onMounted(() => {
  startTypingLoop()
})

onUnmounted(() => {
  if (typingTimer) clearTimeout(typingTimer)
  if (rotateTimer) clearTimeout(rotateTimer)
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
  min-height: 1.5em;
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
  min-height: 1.5em;
}

/* 光标样式 */
.cursor {
  display: inline-block;
  width: 2px;
  margin-left: 4px;
  color: #ffffff;
  font-weight: 300;
  animation: blink 0.7s step-end infinite;
  transition: opacity 1s ease-out;
}

.cursor.fade-out-cursor {
  opacity: 0;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
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

