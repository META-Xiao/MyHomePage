<template>
  <div class="star-track-background" :class="{ shrink: isScrolled }">
    <canvas ref="canvasRef" id="startrack"></canvas>
    <!-- 渐变遮罩-->
    <div class="cover"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
const isScrolled = ref(false)
let animationId = null

// 监听滚动
const handleScroll = () => {
  isScrolled.value = window.scrollY > 100
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
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
    
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    })
  }
})
</script>

<style scoped>
/* 星空背景 - 带滚动动画 */
.star-track-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;  /* 初始全屏 */
  z-index: 0;
  overflow: hidden;
  transition: height 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

/* 滚动后收缩到黄金分割比 */
.star-track-background.shrink {
  height: 38.2vh;
}

#startrack {
  height: 100%;
  width: 100%;
}

.cover {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 30%;
  width: 100%;
  background: linear-gradient(0deg, #202020 0%, rgba(32, 32, 32, 0) 100%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

/* 滚动后显示渐变遮罩 */
.star-track-background.shrink .cover {
  opacity: 1;
}
</style>

