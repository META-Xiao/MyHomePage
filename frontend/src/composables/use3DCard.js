import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 3D 卡片悬浮效果 - 物理触感
 * 鼠标悬浮时卡片会根据鼠标位置倾斜
 */
export function use3DCard() {
  const cardRef = ref(null)
  const isHovered = ref(false)
  const rotateX = ref(0)
  const rotateY = ref(0)
  const scale = ref(1)

  const handleMouseMove = (e) => {
    if (!cardRef.value) return

    const card = cardRef.value
    const rect = card.getBoundingClientRect()
    
    // 计算鼠标相对于卡片中心的位置 (-1 到 1)
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    
    // 计算旋转角度（最大 12 度）
    rotateY.value = x * 12
    rotateX.value = -y * 12
    
    // 悬浮时轻微放大
    scale.value = 1.02
  }

  const handleMouseEnter = () => {
    isHovered.value = true
  }

  const handleMouseLeave = () => {
    isHovered.value = false
    rotateX.value = 0
    rotateY.value = 0
    scale.value = 1
  }

  const cardStyle = () => ({
    transform: `perspective(1000px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) scale(${scale.value}) translateZ(${isHovered.value ? '20px' : '0'})`,
    transition: isHovered.value 
      ? 'transform 0.1s ease-out, box-shadow 0.3s ease-out' 
      : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease-out',
    boxShadow: isHovered.value 
      ? '0 20px 40px rgba(0, 212, 255, 0.15), 0 0 0 1px rgba(0, 212, 255, 0.1)' 
      : '0 4px 12px rgba(0, 0, 0, 0.1)'
  })

  onMounted(() => {
    if (cardRef.value) {
      cardRef.value.addEventListener('mousemove', handleMouseMove)
      cardRef.value.addEventListener('mouseenter', handleMouseEnter)
      cardRef.value.addEventListener('mouseleave', handleMouseLeave)
    }
  })

  onUnmounted(() => {
    if (cardRef.value) {
      cardRef.value.removeEventListener('mousemove', handleMouseMove)
      cardRef.value.removeEventListener('mouseenter', handleMouseEnter)
      cardRef.value.removeEventListener('mouseleave', handleMouseLeave)
    }
  })

  return {
    cardRef,
    cardStyle,
    isHovered
  }
}

