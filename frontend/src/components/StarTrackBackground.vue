<template>
  <div 
    ref="containerRef"
    class="star-track-background" 
    :style="{ transform: starTransform }"
  >
    <canvas ref="canvasRef" id="startrack" :style="canvasTransform"></canvas>
    
    <!-- 渐变遮罩-->
    <div class="cover" :style="{ opacity: coverOpacity }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const canvasRef = ref(null)
const containerRef = ref(null)
const scrollProgress = ref(0)
const mouseX = ref(0)
const mouseY = ref(0)
let animationId = null

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
    this.floatingParticles = []  // 漂浮粒子
    this.maxStars = 200
    this.maxShootingStars = 3
    this.maxFloatingParticles = 50
    
    // 真实恒星颜色（根据温度）
    this.starColors = [
      { color: 'rgba(155, 176, 255, 1)', name: '蓝巨星', weight: 0.05 },      // O型星 - 最热
      { color: 'rgba(170, 191, 255, 1)', name: '蓝白星', weight: 0.08 },      // B型星
      { color: 'rgba(202, 215, 255, 1)', name: '白星', weight: 0.12 },        // A型星
      { color: 'rgba(248, 247, 255, 1)', name: '黄白星', weight: 0.25 },      // F型星
      { color: 'rgba(255, 244, 234, 1)', name: '黄矮星', weight: 0.30 },      // G型星（太阳）
      { color: 'rgba(255, 210, 161, 1)', name: '橙矮星', weight: 0.15 },      // K型星
      { color: 'rgba(255, 204, 111, 1)', name: '红巨星', weight: 0.05 }       // M型星 - 最冷
    ]
    
    // 地球自转方向（从西向东，画面上从右向左）
    this.driftVelocity = {
      x: -0.05,  // 向左漂移（很慢）
      y: 0
    }
    
    this.init()
  }
  
  init() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight  // 全屏高度
    this.createStars()
  }
  
  // 根据权重随机选择恒星颜色
  getRandomStarColor() {
    const random = Math.random()
    let cumulative = 0
    
    for (const star of this.starColors) {
      cumulative += star.weight
      if (random <= cumulative) {
        return star.color
      }
    }
    
    return this.starColors[4].color  // 默认黄矮星
  }
  
  createStars() {
    this.stars = []
    for (let i = 0; i < this.maxStars; i++) {
      const isPermanent = Math.random() > 0.3  // 70% 是恒星（不消失）
      
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1,
        color: this.getRandomStarColor(),
        isPermanent: isPermanent,  // 是否是恒星
        driftSpeed: isPermanent ? 1 : 0.3  // 恒星漂移慢，粒子漂移快
      })
    }
  }
  
  // 创建漂浮粒子（大气流动效果）
  createFloatingParticle() {
    if (this.floatingParticles.length < this.maxFloatingParticles && Math.random() < 0.05) {
      this.floatingParticles.push({
        x: Math.random() * this.canvas.width,
        y: this.canvas.height + 20,  // 从底部生成
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        color: this.getRandomStarColor(),
        // 上浮速度
        floatSpeed: Math.random() * 0.5 + 0.3,
        // 横向漂移（模拟大气流动）
        driftX: (Math.random() - 0.5) * 0.3,
        // 生命周期
        life: 1,
        fadeSpeed: Math.random() * 0.003 + 0.002
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
    this.ctx.fillStyle = star.color.replace('1)', `${star.opacity})`)
    this.ctx.fill()
    
    // 较大的恒星有光晕
    if (star.radius > 1) {
      const gradient = this.ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.radius * 3
      )
      // 使用恒星本身的颜色作为光晕
      const glowColor = star.color.replace('rgba(', '').replace(')', '').split(',')
      gradient.addColorStop(0, `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, ${star.opacity * 0.3})`)
      gradient.addColorStop(1, `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, 0)`)
      this.ctx.fillStyle = gradient
      this.ctx.beginPath()
      this.ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2)
      this.ctx.fill()
    }
  }
  
  // 绘制漂浮粒子
  drawFloatingParticle(particle) {
    this.ctx.beginPath()
    this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
    this.ctx.fillStyle = particle.color.replace('1)', `${particle.opacity * particle.life})`)
    this.ctx.fill()
    
    // 小光晕
    const gradient = this.ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.radius * 2
    )
    const glowColor = particle.color.replace('rgba(', '').replace(')', '').split(',')
    gradient.addColorStop(0, `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, ${particle.opacity * particle.life * 0.4})`)
    gradient.addColorStop(1, `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, 0)`)
    this.ctx.fillStyle = gradient
    this.ctx.beginPath()
    this.ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2)
    this.ctx.fill()
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
    this.ctx.strokeStyle = 'rgba(155, 176, 255, 0.08)'  // 使用蓝色调，更真实
    this.ctx.lineWidth = 0.5
    
    for (let i = 0; i < this.stars.length; i++) {
      if (!this.stars[i].isPermanent) continue  // 只连接恒星
      
      for (let j = i + 1; j < this.stars.length; j++) {
        if (!this.stars[j].isPermanent) continue
        
        const dx = this.stars[i].x - this.stars[j].x
        const dy = this.stars[i].y - this.stars[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 150) {
          this.ctx.beginPath()
          this.ctx.moveTo(this.stars[i].x, this.stars[i].y)
          this.ctx.lineTo(this.stars[j].x, this.stars[j].y)
          this.ctx.globalAlpha = (150 - distance) / 150 * 0.2
          this.ctx.stroke()
          this.ctx.globalAlpha = 1
        }
      }
    }
  }
  
  update() {
    // 更新恒星闪烁
    this.stars.forEach(star => {
      // 闪烁效果
      star.opacity += star.twinkleSpeed * star.twinkleDirection
      if (star.opacity <= 0.3 || star.opacity >= 1) {
        star.twinkleDirection *= -1
      }
      
      // 地球自转带来的漂移（从右向左）
      star.x += this.driftVelocity.x * star.driftSpeed
      star.y += this.driftVelocity.y * star.driftSpeed
      
      // 边界循环（从左边消失，从右边出现）
      if (star.x < -10) {
        star.x = this.canvas.width + 10
      }
      if (star.x > this.canvas.width + 10) {
        star.x = -10
      }
    })
    
    // 更新流星
    this.shootingStars = this.shootingStars.filter(star => {
      star.x += Math.cos(star.angle) * star.speed
      star.y += Math.sin(star.angle) * star.speed
      star.opacity -= 0.01
      return star.opacity > 0 && star.x < this.canvas.width + 100 && star.y < this.canvas.height + 100
    })
    
    // 更新漂浮粒子
    this.floatingParticles = this.floatingParticles.filter(particle => {
      // 上浮
      particle.y -= particle.floatSpeed
      // 横向漂移（大气流动）
      particle.x += particle.driftX
      // 地球自转漂移
      particle.x += this.driftVelocity.x * 2  // 粒子漂移更快
      
      // 生命周期衰减
      particle.life -= particle.fadeSpeed
      
      // 边界循环
      if (particle.x < -10) {
        particle.x = this.canvas.width + 10
      }
      if (particle.x > this.canvas.width + 10) {
        particle.x = -10
      }
      
      // 移除消失的粒子
      return particle.life > 0 && particle.y > -20
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
    
    // 绘制漂浮粒子
    this.createFloatingParticle()
    this.floatingParticles.forEach(particle => this.drawFloatingParticle(particle))
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
})
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
}
</style>

