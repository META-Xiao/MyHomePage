console.log('[Main] 开始加载应用...')
console.time('[Main] 总加载时间')

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/main.css'
import { logPerformance, logResourceTiming } from './utils/performance'

console.log('[Main] Vue 和样式已导入')

// 启动性能监控
logPerformance()
logResourceTiming()

// 路由配置
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => {
        console.log('[Router] 开始加载 Home.vue...')
        console.time('[Router] Home.vue 加载时间')
        return import('./views/Home.vue').then(module => {
          console.timeEnd('[Router] Home.vue 加载时间')
          console.log('[Router] Home.vue 加载完成')
          return module
        })
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  }
})

console.log('[Main] 路由配置完成')

const app = createApp(App)
console.log('[Main] App 实例创建完成')

app.use(router)
console.log('[Main] 路由已注册')

app.mount('#app')
console.log('[Main] App 已挂载到 DOM')
console.timeEnd('[Main] 总加载时间')

