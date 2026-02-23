// 性能监控工具
export function logPerformance() {
  if (typeof window === 'undefined') return

  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
      const connectTime = perfData.responseEnd - perfData.requestStart
      const renderTime = perfData.domComplete - perfData.domLoading
      const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart

      console.group(' 性能指标')
      console.log(`页面总加载时间: ${pageLoadTime}ms`)
      console.log(`服务器连接时间: ${connectTime}ms`)
      console.log(`DOM 渲染时间: ${renderTime}ms`)
      console.log(`DOM Ready 时间: ${domReadyTime}ms`)
      console.groupEnd()

      // 检测慢加载
      if (pageLoadTime > 3000) {
        console.warn('⚠️  页面加载较慢，超过 3 秒')
      }
      if (connectTime > 1000) {
        console.warn('⚠️  服务器响应较慢，超过 1 秒')
      }
    }, 0)
  })
}

// 监控资源加载
export function logResourceTiming() {
  if (typeof window === 'undefined') return

  window.addEventListener('load', () => {
    setTimeout(() => {
      const resources = window.performance.getEntriesByType('resource')
      
      console.group('📦 资源加载详情')
      
      // 按类型分组
      const grouped = {}
      resources.forEach(resource => {
        const type = resource.initiatorType
        if (!grouped[type]) grouped[type] = []
        grouped[type].push({
          name: resource.name.split('/').pop(),
          duration: Math.round(resource.duration),
          size: resource.transferSize
        })
      })

      Object.keys(grouped).forEach(type => {
        const items = grouped[type]
        const totalTime = items.reduce((sum, item) => sum + item.duration, 0)
        const totalSize = items.reduce((sum, item) => sum + (item.size || 0), 0)
        
        console.log(`${type}: ${items.length} 个文件, ${totalTime}ms, ${(totalSize / 1024).toFixed(2)}KB`)
        
        // 显示最慢的资源
        const slowest = items.sort((a, b) => b.duration - a.duration).slice(0, 3)
        slowest.forEach(item => {
          if (item.duration > 500) {
            console.warn(`  ⚠️  ${item.name}: ${item.duration}ms`)
          }
        })
      })
      
      console.groupEnd()
    }, 0)
  })
}

