<template>
  <div 
    ref="containerRef"
    class="star-track-background" 
    :style="{ transform: starTransform }"
  >
    <canvas ref="canvasRef" id="startrack" :style="canvasTransform"></canvas>
    
    <!-- 三体星系前景 -->
    <canvas ref="starsCanvasRef" id="triple-stars" :style="canvasTransform"></canvas>
    
    <!-- 渐变遮罩-->
    <div class="cover" :style="{ opacity: coverOpacity }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Matter from 'matter-js'

const canvasRef = ref(null)
const starsCanvasRef = ref(null)
const containerRef = ref(null)
const scrollProgress = ref(0)
const mouseX = ref(0)
const mouseY = ref(0)
let animationId = null
let starsAnimationId = null
let engine, runner
let trails = []
const maxTrailLength = 150

// 计算星空位移（向上移动 61.8vh）
const starTransform = computed(() => {
  const maxMove = -61.8  // 向上移动到只剩 38.2vh 可见
  const translateY = maxMove * scrollProgress.value
  return `translateY(${translateY}vh)`
})

// 计算 Canvas 视差效果（只在未滚动时生效）
const canvasTransform = computed(() => {
  if (scrollProgress.value > 0.1) {
    // 滚动后关闭互动效果
    return {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1.1)',
      transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
    }
  }
  
  // 鼠标位置转换为相机旋转角度（最大 ±5 度）
  const rotateY = mouseX.value * 5  // 水平旋转
  const rotateX = -mouseY.value * 5  // 垂直旋转（反向）
  
  return {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`,
    transition: 'transform 0.15s ease-out'
  }
})

// 计算遮罩透明度
const coverOpacity = computed(() => {
  return scrollProgress.value
})

// 监听滚动 - 根据滚动距离计算进度
const handleScroll = () => {
  const scrollY = window.scrollY
  const triggerDistance = window.innerHeight * 0.6  // 滚动 60vh 才完全上移
  
  // 计算进度 (0 到 1)
  scrollProgress.value = Math.min(scrollY / triggerDistance, 1)
}

// 监听鼠标移动 - 视差效果
const handleMouseMove = (e) => {
  if (scrollProgress.value > 0.1) return  // 滚动后不响应
  
  const { clientX, clientY } = e
  const { innerWidth, innerHeight } = window
  
  // 将鼠标位置转换为 -1 到 1 的范围
  mouseX.value = (clientX / innerWidth - 0.5) * 2
  mouseY.value = (clientY / innerHeight - 0.5) * 2
}

class StarTrack {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.stars = []
    this.shootingStars = []
    this.maxStars = 200
    this.maxShootingStars = 3
    
    this.init()
  }
  
  init() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight  // 全屏高度
    this.createStars()
  }
  
  createStars() {
    this.stars = []
    for (let i = 0; i < this.maxStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1
      })
    }
  }
  
  createShootingStar() {
    if (this.shootingStars.length < this.maxShootingStars && Math.random() < 0.01) {
      this.shootingStars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height * 0.3,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 10 + 10,
        opacity: 1,
        angle: Math.PI / 4
      })
    }
  }
  
  drawStar(star) {
    this.ctx.beginPath()
    this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
    this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
    this.ctx.fill()
    
    if (star.radius > 1) {
      const gradient = this.ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.radius * 3
      )
      gradient.addColorStop(0, `rgba(0, 212, 255, ${star.opacity * 0.3})`)
      gradient.addColorStop(1, 'rgba(0, 212, 255, 0)')
      this.ctx.fillStyle = gradient
      this.ctx.beginPath()
      this.ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2)
      this.ctx.fill()
    }
  }
  
  drawShootingStar(star) {
    this.ctx.save()
    this.ctx.translate(star.x, star.y)
    this.ctx.rotate(star.angle)
    
    const gradient = this.ctx.createLinearGradient(0, 0, star.length, 0)
    gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
    gradient.addColorStop(0.3, `rgba(0, 212, 255, ${star.opacity * 0.8})`)
    gradient.addColorStop(1, 'rgba(0, 212, 255, 0)')
    
    this.ctx.strokeStyle = gradient
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(star.length, 0)
    this.ctx.stroke()
    
    this.ctx.beginPath()
    this.ctx.arc(0, 0, 2, 0, Math.PI * 2)
    this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
    this.ctx.fill()
    
    this.ctx.restore()
  }
  
  drawConstellation() {
    this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)'
    this.ctx.lineWidth = 1
    
    for (let i = 0; i < this.stars.length; i++) {
      for (let j = i + 1; j < this.stars.length; j++) {
        const dx = this.stars[i].x - this.stars[j].x
        const dy = this.stars[i].y - this.stars[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 150) {
          this.ctx.beginPath()
          this.ctx.moveTo(this.stars[i].x, this.stars[i].y)
          this.ctx.lineTo(this.stars[j].x, this.stars[j].y)
          this.ctx.globalAlpha = (150 - distance) / 150 * 0.3
          this.ctx.stroke()
          this.ctx.globalAlpha = 1
        }
      }
    }
  }
  
  update() {
    this.stars.forEach(star => {
      star.opacity += star.twinkleSpeed * star.twinkleDirection
      if (star.opacity <= 0.2 || star.opacity >= 1) {
        star.twinkleDirection *= -1
      }
    })
    
    this.shootingStars = this.shootingStars.filter(star => {
      star.x += Math.cos(star.angle) * star.speed
      star.y += Math.sin(star.angle) * star.speed
      star.opacity -= 0.01
      return star.opacity > 0 && star.x < this.canvas.width + 100 && star.y < this.canvas.height + 100
    })
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height)
    gradient.addColorStop(0, 'rgba(10, 14, 39, 0.3)')
    gradient.addColorStop(0.5, 'rgba(26, 31, 58, 0.2)')
    gradient.addColorStop(1, 'rgba(10, 14, 39, 0)')
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    this.drawConstellation()
    this.update()
    this.stars.forEach(star => this.drawStar(star))
    this.createShootingStar()
    this.shootingStars.forEach(star => this.drawShootingStar(star))
  }
}

onMounted(() => {
  if (canvasRef.value) {
    const starTrack = new StarTrack(canvasRef.value)
    
    const animate = () => {
      starTrack.animate()
      animationId = requestAnimationFrame(animate)
    }
    animate()
    
    const handleResize = () => {
      starTrack.init()
    }
    
    // 初始化时检查滚动位置
    handleScroll()
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    })
  }
  
  // 初始化三体星系
  if (starsCanvasRef.value) {
    initTripleStars()
  }
})

// 初始化三体星系
function initTripleStars() {
  const canvas = starsCanvasRef.value
  const width = window.innerWidth
  const height = window.innerHeight
  canvas.width = width
  canvas.height = height

  // 创建 Matter.js 引擎
  engine = Matter.Engine.create({
    gravity: { x: 0, y: 0, scale: 0 }
  })

  // 三颗恒星位置（屏幕中心偏右上）
  const centerX = width * 0.6
  const centerY = height * 0.4

  // 主星 A - 橙黄色
  const starA = Matter.Bodies.circle(centerX - 100, centerY, 25, {
    isStatic: false,
    mass: 120,
    frictionAir: 0,
    render: {
      fillStyle: '#FFA500',
      strokeStyle: '#FFD700',
      lineWidth: 3
    }
  })
  Matter.Body.setVelocity(starA, { x: 0, y: 1.8 })

  // 主星 B - 橙红色
  const starB = Matter.Bodies.circle(centerX + 100, centerY, 22, {
    isStatic: false,
    mass: 110,
    frictionAir: 0,
    render: {
      fillStyle: '#FF6B35',
      strokeStyle: '#FF8C42',
      lineWidth: 3
    }
  })
  Matter.Body.setVelocity(starB, { x: 0, y: -2 })

  // 伴星 Proxima - 红色小星
  const starC = Matter.Bodies.circle(centerX, centerY - 150, 15, {
    isStatic: false,
    mass: 50,
    frictionAir: 0,
    render: {
      fillStyle: '#DC143C',
      strokeStyle: '#FF1744',
      lineWidth: 2
    }
  })
  Matter.Body.setVelocity(starC, { x: 1.3, y: 0 })

  // 添加到世界
  Matter.World.add(engine.world, [starA, starB, starC])

  // 初始化轨迹
  trails = [
    { points: [], color: '#FFA500' },
    { points: [], color: '#FF6B35' },
    { points: [], color: '#DC143C' }
  ]

  const ctx = canvas.getContext('2d')
  const bodies = [starA, starB, starC]

  // 引力计算
  Matter.Events.on(engine, 'beforeUpdate', () => {
    const G = 0.4 // 引力常数

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const bodyA = bodies[i]
        const bodyB = bodies[j]

        const dx = bodyB.position.x - bodyA.position.x
        const dy = bodyB.position.y - bodyA.position.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 0) {
          const force = (G * bodyA.mass * bodyB.mass) / (distance * distance)
          const fx = (force * dx) / distance
          const fy = (force * dy) / distance

          Matter.Body.applyForce(bodyA, bodyA.position, { x: fx / bodyA.mass, y: fy / bodyA.mass })
          Matter.Body.applyForce(bodyB, bodyB.position, { x: -fx / bodyB.mass, y: -fy / bodyB.mass })
        }
      }
    }
  })

  // 自定义渲染循环
  function renderTripleStars() {
    if (scrollProgress.value > 0.1) {
      // 滚动后停止渲染
      ctx.clearRect(0, 0, width, height)
      return
    }

    ctx.clearRect(0, 0, width, height)

    // 绘制轨迹
    bodies.forEach((body, index) => {
      const trail = trails[index]
      trail.points.push({ x: body.position.x, y: body.position.y })
      
      if (trail.points.length > maxTrailLength) {
        trail.points.shift()
      }

      // 绘制轨迹线
      if (trail.points.length > 1) {
        for (let i = 1; i < trail.points.length; i++) {
          const alpha = (i / trail.points.length * 0.6).toFixed(2)
          ctx.strokeStyle = trail.color + Math.floor(alpha * 255).toString(16).padStart(2, '0')
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(trail.points[i - 1].x, trail.points[i - 1].y)
          ctx.lineTo(trail.points[i].x, trail.points[i].y)
          ctx.stroke()
        }
      }
    })

    // 绘制恒星（带发光效果）
    bodies.forEach((body) => {
      const pos = body.position
      const radius = body.circleRadius
      const color = body.render.fillStyle

      // 外层光晕（Bloom效果）
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 4)
      gradient.addColorStop(0, color + 'AA')
      gradient.addColorStop(0.3, color + '40')
      gradient.addColorStop(1, color + '00')
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius * 4, 0, Math.PI * 2)
      ctx.fill()

      // 中层光晕
      const gradient2 = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 2)
      gradient2.addColorStop(0, color + 'FF')
      gradient2.addColorStop(0.5, color + '80')
      gradient2.addColorStop(1, color + '00')
      
      ctx.fillStyle = gradient2
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius * 2, 0, Math.PI * 2)
      ctx.fill()

      // 恒星本体
      ctx.fillStyle = color
      ctx.strokeStyle = body.render.strokeStyle
      ctx.lineWidth = body.render.lineWidth
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    })

    starsAnimationId = requestAnimationFrame(renderTripleStars)
  }

  // 启动引擎
  runner = Matter.Runner.create()
  Matter.Runner.run(runner, engine)
  renderTripleStars()
  
  onUnmounted(() => {
    if (runner) Matter.Runner.stop(runner)
    if (engine) Matter.Engine.clear(engine)
    if (starsAnimationId) cancelAnimationFrame(starsAnimationId)
  })
}
</script>

<style scoped>
/* 星空背景 - 线性向上移动 */
.star-track-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
  transition: transform 0.1s linear;  /* 线性过渡，跟随滚动 */
  will-change: transform;
}

#startrack {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  will-change: transform;
  transform-origin: center center;
  z-index: 1;
}

#triple-stars {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  will-change: transform;
  transform-origin: center center;
  z-index: 2;
  pointer-events: none;
}

.cover {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 40%;
  width: 100%;
  background: linear-gradient(0deg, #202020 0%, rgba(32, 32, 32, 0) 100%);
  pointer-events: none;
  transition: opacity 0.1s linear;  /* 线性过渡，跟随滚动 */
  z-index: 3;
}
</style>

