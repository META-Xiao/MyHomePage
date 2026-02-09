<template>
  <div class="triple-star-system">
    <canvas ref="canvasRef" class="star-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Matter from 'matter-js'

const canvasRef = ref(null)
let engine, render, runner
let trails = []
const maxTrailLength = 100

onMounted(() => {
  if (!canvasRef.value) return

  // 创建 Matter.js 引擎
  engine = Matter.Engine.create({
    gravity: { x: 0, y: 0, scale: 0 }
  })

  const canvas = canvasRef.value
  const width = 500
  const height = 500
  canvas.width = width
  canvas.height = height

  // 创建渲染器
  render = Matter.Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width: width,
      height: height,
      wireframes: false,
      background: 'transparent'
    }
  })

  // 三颗恒星（南门二系统：Alpha Centauri A, B, Proxima）
  const centerX = width / 2
  const centerY = height / 2

  // 主星 A - 橙黄色
  const starA = Matter.Bodies.circle(centerX - 80, centerY, 20, {
    isStatic: false,
    mass: 100,
    frictionAir: 0,
    render: {
      fillStyle: '#FFA500',
      strokeStyle: '#FFD700',
      lineWidth: 3
    }
  })
  Matter.Body.setVelocity(starA, { x: 0, y: 2 })

  // 主星 B - 橙红色
  const starB = Matter.Bodies.circle(centerX + 80, centerY, 18, {
    isStatic: false,
    mass: 90,
    frictionAir: 0,
    render: {
      fillStyle: '#FF6B35',
      strokeStyle: '#FF8C42',
      lineWidth: 3
    }
  })
  Matter.Body.setVelocity(starB, { x: 0, y: -2.2 })

  // 伴星 Proxima - 红色小星
  const starC = Matter.Bodies.circle(centerX, centerY - 120, 12, {
    isStatic: false,
    mass: 40,
    frictionAir: 0,
    render: {
      fillStyle: '#DC143C',
      strokeStyle: '#FF1744',
      lineWidth: 2
    }
  })
  Matter.Body.setVelocity(starC, { x: 1.5, y: 0 })

  // 添加到世界
  Matter.World.add(engine.world, [starA, starB, starC])

  // 初始化轨迹
  trails = [
    { points: [], color: '#FFA500' },
    { points: [], color: '#FF6B35' },
    { points: [], color: '#DC143C' }
  ]

  // 自定义渲染循环
  const ctx = canvas.getContext('2d')
  
  function customRender() {
    // 清空画布
    ctx.clearRect(0, 0, width, height)

    // 绘制轨迹
    const bodies = [starA, starB, starC]
    bodies.forEach((body, index) => {
      const trail = trails[index]
      trail.points.push({ x: body.position.x, y: body.position.y })
      
      if (trail.points.length > maxTrailLength) {
        trail.points.shift()
      }

      // 绘制轨迹线
      if (trail.points.length > 1) {
        ctx.beginPath()
        ctx.moveTo(trail.points[0].x, trail.points[0].y)
        
        for (let i = 1; i < trail.points.length; i++) {
          const alpha = i / trail.points.length
          ctx.strokeStyle = trail.color + Math.floor(alpha * 100).toString(16).padStart(2, '0')
          ctx.lineWidth = 1
          ctx.lineTo(trail.points[i].x, trail.points[i].y)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(trail.points[i].x, trail.points[i].y)
        }
      }
    })

    // 绘制恒星（带发光效果）
    bodies.forEach((body, index) => {
      const pos = body.position
      const radius = body.circleRadius
      const color = body.render.fillStyle

      // 外层光晕
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 3)
      gradient.addColorStop(0, color + '80')
      gradient.addColorStop(0.5, color + '20')
      gradient.addColorStop(1, color + '00')
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius * 3, 0, Math.PI * 2)
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
  }

  // 引力计算
  Matter.Events.on(engine, 'beforeUpdate', () => {
    const bodies = [starA, starB, starC]
    const G = 0.5 // 引力常数

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

  // 启动引擎和渲染
  runner = Matter.Runner.create()
  Matter.Runner.run(runner, engine)

  // 自定义渲染循环
  function animate() {
    customRender()
    requestAnimationFrame(animate)
  }
  animate()
})

onUnmounted(() => {
  if (render) Matter.Render.stop(render)
  if (runner) Matter.Runner.stop(runner)
  if (engine) Matter.Engine.clear(engine)
})
</script>

<style scoped>
.triple-star-system {
  position: relative;
  width: 500px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.star-canvas {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px rgba(255, 165, 0, 0.3));
}
</style>

