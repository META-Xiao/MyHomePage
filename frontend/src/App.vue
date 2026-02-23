<template>
  <div id="app" class="relative min-h-screen">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted, onBeforeMount } from 'vue'

console.log('[App] App.vue 组件开始初始化')

onBeforeMount(() => {
  console.log('[App] App.vue onBeforeMount')
})

onMounted(() => {
  console.log('[App] App.vue onMounted')
  // 页面加载动画
  document.body.style.opacity = '0'
  setTimeout(() => {
    document.body.style.transition = 'opacity 1s ease'
    document.body.style.opacity = '1'
    console.log('[App] 页面淡入动画完成')
  }, 100)
})
</script>

<style scoped>
#app {
  font-family: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

