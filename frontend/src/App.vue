<template>
  <div id="app" class="relative min-h-screen">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 页面加载动画
  document.body.style.opacity = '0'
  setTimeout(() => {
    document.body.style.transition = 'opacity 1s ease'
    document.body.style.opacity = '1'
  }, 100)
})
</script>

<style scoped>
#app {
  font-family: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
}
</style>

