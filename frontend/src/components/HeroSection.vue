<template>
  <div class="hero-section container-custom text-center">
    <div class="animate-fade-in-up">
      <div class="circle flex justify-center gap-2 mb-8">
        <span class="dot"></span>
        <span class="dot delay-200"></span>
        <span class="dot delay-400"></span>
      </div>
      
      <h1 class="text-5xl md:text-8xl font-bold mb-8 gradient-text tracking-wide leading-tight hero-title">
        {{ mainTitle }}
      </h1>
      
      <h2 class="text-xl md:text-3xl font-light text-white/70 tracking-[0.3em] mb-12 hero-subtitle">
        {{ currentSlogan }}
      </h2>
      
      <div class="hero-footer text-sm text-white/40 font-mono">
        <span class="dot-separator">🟢</span>
        <span class="dot-separator">🟡</span>
        <span class="dot-separator">🔴</span>
        <span class="ml-4">libxcnya.so の Catnest</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mainTitle = ref('即使是最小的 margin')
const currentSlogan = ref('也值得被认真对待')

const titles = [
  { main: '即使是最小的 margin', sub: '也值得被认真对待' },
  { main: '代码如诗', sub: '每一行都是艺术' },
  { main: '不止于技术', sub: '更在于热爱' },
  { main: '折腾是一种态度', sub: '创造是一种信仰' }
]

let titleIndex = 0

const rotateTitle = () => {
  titleIndex = (titleIndex + 1) % titles.length
  mainTitle.value = titles[titleIndex].main
  currentSlogan.value = titles[titleIndex].sub
}

onMounted(() => {
  setInterval(rotateTitle, 10000)
})
</script>

<style scoped>
.hero-section {
  @apply relative;
}

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

.hero-title {
  animation: float 6s ease-in-out infinite;
  text-shadow: 0 0 40px rgba(0, 212, 255, 0.3);
}

.hero-subtitle {
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

.dot-separator {
  @apply inline-block mx-1;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.dot-separator:nth-child(1) {
  animation-delay: 0s;
}

.dot-separator:nth-child(2) {
  animation-delay: 0.3s;
}

.dot-separator:nth-child(3) {
  animation-delay: 0.6s;
}

.hero-footer {
  animation: fadeIn 2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

