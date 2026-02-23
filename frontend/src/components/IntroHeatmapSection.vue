<template>
  <div ref="cardRef" class="single-section">
    <!-- 左侧：自我介绍卡片 -->
    <div class="intro-card">
      <!-- 水滴装饰 -->
      <div class="water-drop">
        <div class="highlight"></div>
      </div>
      
      <!-- 右上角时钟 -->
      <div class="clock">
        <svg class="clock-svg" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="minuteGradient">
              <stop offset="0%" style="stop-color:#fff;stop-opacity:0.05" />
              <stop offset="33%" style="stop-color:#fff;stop-opacity:0.3" />
              <stop offset="67%" style="stop-color:#fff;stop-opacity:0.7" />
              <stop offset="100%" style="stop-color:#fff;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="hourGradient">
              <stop offset="0%" style="stop-color:#fff;stop-opacity:0.05" />
              <stop offset="33%" style="stop-color:#fff;stop-opacity:0.25" />
              <stop offset="67%" style="stop-color:#fff;stop-opacity:0.6" />
              <stop offset="100%" style="stop-color:#fff;stop-opacity:0.9" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <!-- 分钟轨道背景 -->
          <circle 
            class="track-bg" 
            cx="100" 
            cy="100" 
            r="85"
          />
          
          <!-- 时钟轨道背景 -->
          <circle 
            class="track-bg" 
            cx="100" 
            cy="100" 
            r="65"
          />
          
          <!-- 分钟轨迹（圆环） -->
          <circle 
            class="minute-trail" 
            cx="100" 
            cy="100" 
            r="85"
            :style="{ strokeDashoffset: minuteTrailOffset }"
          />
          
          <!-- 时钟轨迹（圆环） -->
          <circle 
            class="hour-trail" 
            cx="100" 
            cy="100" 
            r="65"
            :style="{ strokeDashoffset: hourTrailOffset }"
          />
          
          <!-- 分钟指针（高亮点） -->
          <circle 
            class="minute-hand" 
            :cx="minuteX" 
            :cy="minuteY" 
            r="10"
          />
          
          <!-- 时钟指针（高亮点） -->
          <circle 
            class="hour-hand" 
            :cx="hourX" 
            :cy="hourY" 
            r="8"
          />
        </svg>
      </div>
      
      <!-- 自我介绍文字 -->
      <div class="intro-content">
        <h3 class="intro-hello">Hello</h3>
        <h2 class="intro-name">
          I'm <span class="name-highlight">Meta Xiao</span>
        </h2>
        <p class="intro-hobbies">Into algo, CS, AI, electronics & DIY</p>
      </div>
    </div>
    
    <!-- 右侧：热力图 -->
    <div class="heatmap-card">
    <div ref="chartRef" class="chart-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'

interface HeatmapData {
  date: string
  value: number
  blog: number
  github: number
  oj: number
  details?: {
    blog: number
    github: number
    codeforces: number
    nowcoder: number
    atcoder: number
  }
}

const props = defineProps<{
  year?: string | number
  data?: HeatmapData[]
}>()

const chartRef = ref<HTMLElement>()
const cardRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null
let observer: IntersectionObserver | null = null
let clockTimer: number | null = null

const activeDays = computed(() => {
  return props.data?.filter(item => item.value > 0).length || 0
})

// 时钟相关
const minuteX = ref(100)
const minuteY = ref(15)
const hourX = ref(100)
const hourY = ref(35)
const minuteTrailOffset = ref(534)
const hourTrailOffset = ref(408)

const updateClock = () => {
  const now = new Date()
  const hours = now.getHours() % 12
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  
  const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * Math.PI / 180
  const hourAngle = ((hours + minutes / 60) * 30 - 90) * Math.PI / 180
  
  minuteX.value = 100 + 85 * Math.cos(minuteAngle)
  minuteY.value = 100 + 85 * Math.sin(minuteAngle)
  hourX.value = 100 + 65 * Math.cos(hourAngle)
  hourY.value = 100 + 65 * Math.sin(hourAngle)
  
  const minuteCircumference = 2 * Math.PI * 85
  const hourCircumference = 2 * Math.PI * 65
  const minuteProgress = (minutes + seconds / 60) / 60
  const hourProgress = (hours + minutes / 60) / 12
  
  minuteTrailOffset.value = minuteCircumference * (1 - minuteProgress * 0.67)
  hourTrailOffset.value = hourCircumference * (1 - hourProgress * 0.67)
}

// 滚动动画观察器
const setupScrollAnimation = () => {
  if (!cardRef.value) return
  
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    {
      threshold: 0.2,
      rootMargin: '0px'
    }
  )
  
  observer.observe(cardRef.value)
}

// 计算日期范围：今天往前推 365*95% 天 + 往后 5% 天
const getDateRange = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const totalDays = 365
  const pastDays = Math.floor(totalDays * 0.95)
  const futureDays = Math.ceil(totalDays * 0.05)
  
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - pastDays)
  
  const endDate = new Date(today)
  endDate.setDate(endDate.getDate() + futureDays)
  
  return [
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  ]
}

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const option: echarts.EChartsOption = {
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const dateData = props.data?.find(item => item.date === params.data[0])
        if (!dateData || dateData.value === 0) {
          return `
            <div style="font-family: 'JetBrains Mono', monospace;">
              <div style="font-weight: 600; margin-bottom: 6px; color: #fff;">${params.data[0]}</div>
              <div style="color: #666;">No activity</div>
            </div>
          `
        }
        
        const lines = []
        lines.push(`<div style="font-family: 'JetBrains Mono', monospace;">`)
        lines.push(`<div style="font-weight: 600; margin-bottom: 8px; color: #fff;">${params.data[0]}</div>`)
        
        if (dateData.blog > 0) {
          lines.push(`<div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">`)
          lines.push(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`)
          lines.push(`<span style="color: #00d4ff;">Blog: ${dateData.blog}</span>`)
          lines.push(`</div>`)
        }
        
        if (dateData.github > 0) {
          lines.push(`<div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">`)
          lines.push(`<svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`)
          lines.push(`<span style="color: #fff;">Commits: ${dateData.github}</span>`)
          lines.push(`</div>`)
        }
        
        if (dateData.oj > 0) {
          lines.push(`<div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">`)
          lines.push(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`)
          lines.push(`<span style="color: #ffd700;">AC: ${dateData.oj}</span>`)
          lines.push(`</div>`)
        }
        
        lines.push(`</div>`)
        return lines.join('')
      },
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      extraCssText: 'backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);'
    },
    visualMap: {
      show: false,
      min: 0,
      max: 100,
      type: 'piecewise',
      pieces: [
        { min: 0, max: 0, color: '#1a1f26' },
        { min: 1, max: 20, color: '#3d5a80' },
        { min: 21, max: 40, color: '#5b7fa6' },
        { min: 41, max: 60, color: '#7ba3cc' },
        { min: 61, max: 80, color: '#98c1d9' },
        { min: 81, color: '#b8d4e8' }
      ]
    },
    calendar: {
      top: 30,
      left: 30,
      right: 10,
      bottom: 10,
      cellSize: [15, 15],
      range: getDateRange(),
      itemStyle: {
        borderWidth: 2,
        borderColor: 'rgba(13, 17, 23, 0.8)',
        color: '#161b22',
        borderRadius: 3
      },
      yearLabel: { 
        show: false 
      },
      monthLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontWeight: 600,
        nameMap: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        margin: 15
      },
      dayLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11,
        fontWeight: 500,
        firstDay: 1,
        nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        margin: 10
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.15)',
          width: 2,
          type: 'solid'
        }
      }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: props.data?.map(item => [item.date, item.value]) || [],
      itemStyle: {
        borderRadius: 3
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(123, 163, 204, 0.6)',
          borderColor: 'rgba(184, 212, 232, 0.8)',
          borderWidth: 2
        }
      }
    }
  }

  chartInstance.setOption(option)
}

const handleResize = () => {
  chartInstance?.resize()
}

watch(() => props.data, () => {
  if (chartInstance && props.data) {
    chartInstance.setOption({
      series: {
        data: props.data.map(item => [item.date, item.value])
      }
    })
  }
}, { deep: true })

onMounted(() => {
  initChart()
  setupScrollAnimation()
  updateClock()
  clockTimer = window.setInterval(updateClock, 1000)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (clockTimer) clearInterval(clockTimer)
  observer?.disconnect()
  chartInstance?.dispose()
})
</script>

<style scoped>
.single-section {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.19, 1, 0.22, 1),
              transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}

.single-section.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 左侧自我介绍卡片 */
.intro-card {
  position: relative;
  flex: 0 0 28%;
  max-width: 28%;
  min-width: 0;
  height: 260px;
  padding: 2.5rem;
  border-radius: 12px;
  background: linear-gradient(120deg, #133c4e 0%, #287c9f 25%, #58b0d5 50%, #aad7e9 75%, #d6ecf5 100%);
  background-size: 200%;
  animation: gradient 15s ease infinite;
  box-shadow: inset 0 0 80px rgba(255, 255, 255, 0.15),
              inset 0 0 20px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.intro-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.06;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.intro-card::after {
  display: none;
}

/* 水滴装饰 */
.water-drop {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 80px;
  height: 80px;
  box-shadow: inset 10px 10px 10px rgba(0, 0, 0, 0.05),
              15px 20px 15px rgba(0, 0, 0, 0.05),
              15px 15px 20px rgba(0, 0, 0, 0.05),
              inset -15px -15px 15px rgba(255, 255, 255, 0.3);
  border-radius: 60% 40% 64% 36% / 34% 36% 64% 66%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}

.water-drop:hover {
  animation: water-animate 2s linear infinite alternate;
}

@keyframes water-animate {
  0% {
    border-radius: 60% 40% 64% 36% / 34% 36% 64% 66%;
  }
  50% {
    border-radius: 55% 45% 58% 42% / 54% 39% 61% 46%;
  }
  100% {
    border-radius: 41% 59% 35% 65% / 71% 32% 68% 29%;
  }
}

.water-drop .highlight {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  filter: blur(3px);
}

/* 时钟 */
.clock {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 100px;
  height: 100px;
}

.clock-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.2));
}

/* 轨道背景 */
.track-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 6;
}

/* 轨迹圆环 */
.minute-trail,
.hour-trail {
  fill: none;
  stroke-linecap: round;
  transform-origin: center;
  transform: rotate(-90deg);
}

.minute-trail {
  stroke: url(#minuteGradient);
  stroke-width: 6;
  stroke-dasharray: 534;
  transition: stroke-dashoffset 0.5s ease-out;
  filter: url(#glow);
}

.hour-trail {
  stroke: url(#hourGradient);
  stroke-width: 6;
  stroke-dasharray: 408;
  transition: stroke-dashoffset 0.5s ease-out;
  filter: url(#glow);
}

/* 指针高亮点 */
.minute-hand {
  fill: #fff;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 12px rgba(255, 255, 255, 0.4));
  transition: cx 0.5s ease-out, cy 0.5s ease-out;
}

.hour-hand {
  fill: #fff;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  transition: cx 0.5s ease-out, cy 0.5s ease-out;
}

/* 自我介绍内容 */
.intro-content {
  position: relative;
  z-index: 1;
}

.intro-hello {
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 140, 66, 0.3);
  -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.3);
  letter-spacing: 0.05em;
}

.intro-name {
  font-family: 'Cinzel', serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 1.2rem;
  line-height: 1.4;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.name-highlight {
  background: linear-gradient(135deg, #ff6b6b, #ffd93d, #ff8c42, #ff6b9d);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s ease infinite;
  font-weight: 700;
  text-shadow: 0 0 30px rgba(255, 107, 107, 0.5);
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.intro-hobbies {
  font-family: 'ZCOOL XiaoWei', 'Ma Shan Zheng', 'Liu Jian Mao Cao', 'Zhi Mang Xing', cursive;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.8;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* 右侧热力图卡片 */
.heatmap-card {
  position: relative;
  flex: 1;
  min-width: 0;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(18, 18, 18, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.05);
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heatmap-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.15;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.chart-container {
  width: 100%;
  height: 200px;
  position: relative;
  z-index: 1;
}

@media (max-width: 1024px) {
  .single-section {
    flex-direction: column;
  }
  
  .intro-card {
    flex: 1;
    max-width: 100%;
  }
}
</style>

