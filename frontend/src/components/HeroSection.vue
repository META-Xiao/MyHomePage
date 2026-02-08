<template>
  <div class="hero-section container-custom text-center">
    <div class="animate-fade-in-up">
      <div class="circle flex justify-center gap-2 mb-8">
        <span class="dot"></span>
        <span class="dot delay-200"></span>
        <span class="dot delay-400"></span>
      </div>
      
      <h1 class="text-5xl md:text-7xl font-bold mb-6 gradient-text tracking-wide">
        {{ greeting }}
      </h1>
      
      <h2 class="text-xl md:text-3xl font-light text-white/70 tracking-widest">
        {{ currentSlogan }}
      </h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const greeting = ref('你好，世界')
const currentSlogan = ref('探索数字世界的无限可能')

const slogans = [
  '探索数字世界的无限可能',
  '用代码创造美好未来',
  '记录技术成长的每一步',
  '分享知识，传递价值',
  '热爱技术，享受创造',
  '让想法变成现实'
]

let sloganIndex = 0

const updateGreeting = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    greeting.value = '早上好'
  } else if (hour >= 12 && hour < 14) {
    greeting.value = '中午好'
  } else if (hour >= 14 && hour < 18) {
    greeting.value = '下午好'
  } else if (hour >= 18 && hour < 22) {
    greeting.value = '晚上好'
  } else {
    greeting.value = '夜深了'
  }
}

const rotateSlogan = () => {
  sloganIndex = (sloganIndex + 1) % slogans.length
  currentSlogan.value = slogans[sloganIndex]
}

onMounted(() => {
  updateGreeting()
  setInterval(rotateSlogan, 8000)
})
</script>

<style scoped>
.dot {
  @apply inline-block w-3.5 h-3.5 rounded-full animate-pulse;
}

.dot:nth-child(1) {
  background-color: #ff493f;
}

.dot:nth-child(2) {
  background-color: #f7c900;
}

.dot:nth-child(3) {
  background-color: #00ff37;
}
</style>

