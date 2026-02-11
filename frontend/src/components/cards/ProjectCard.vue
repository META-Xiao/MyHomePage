<template>
  <div 
    ref="cardRef"
    class="project-card-wrapper"
    :style="{ transform: `rotate(${cardRotation}deg)` }"
  >
    <div 
      class="project-card group cursor-pointer"
      :class="{ 'is-hovered': isHovered }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- 暗色背景渐变 -->
      <div 
        class="dark-bg" 
        :style="{ background: project.bgGradient }"
      ></div>
      
      <!-- 微弱发光边框 -->
      <div 
        class="glow-border" 
        :style="{ background: project.borderGradient }"
      ></div>
      
      <!-- 噪点纹理 -->
      <div class="noise-texture"></div>
      
      <!-- 玻璃层 -->
      <div class="glass-layer"></div>
      
      <!-- 内容层 -->
      <div class="content-layer">
        <div class="project-header">
          <h3 class="project-title">
            {{ project.title }}
          </h3>
          <span 
            :class="['project-status', project.statusClass]"
          >
            <span class="status-dot"></span>
            {{ project.status }}
          </span>
        </div>
        
        <p class="project-desc">
          {{ project.description }}
        </p>
        
        <div class="project-footer">
          <div class="project-tags">
            <span 
              v-for="(tag, i) in project.tags" 
              :key="i"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
          <a 
            v-if="project.link !== '#'"
            :href="project.link" 
            target="_blank"
            class="project-link"
            @click.stop
          >
            <span>访问</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

const cardRef = ref(null)
const isHovered = ref(false)

// 卡片倾斜角度（悬停时归零）
const cardRotation = computed(() => {
  if (isHovered.value) {
    return 0  // 悬停时"站直"
  }
  return props.project.rotation || 0
})

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
}
</script>

<style scoped>
.project-card-wrapper {
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}

.project-card {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  min-height: 280px;
  will-change: transform;
  isolation: isolate;
  transform-style: preserve-3d;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.project-card.is-hovered {
  transform: scale(1.05) translateZ(20px);
}

/* 暗色背景渐变 */
.dark-bg {
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  opacity: 1;
  z-index: 0;
  transition: opacity 0.4s ease;
}

.group.is-hovered .dark-bg {
  opacity: 0.7;
}

/* 微弱发光边框 */
.glow-border {
  position: absolute;
  inset: -1px;
  border-radius: 1.5rem;
  opacity: 0.2;
  transition: opacity 0.4s ease;
  z-index: 1;
  filter: blur(6px);
}

.group.is-hovered .glow-border {
  opacity: 0.5;
  animation: borderPulse 2s ease-in-out infinite;
}

@keyframes borderPulse {
  0%, 100% {
    opacity: 0.5;
    filter: blur(6px);
  }
  50% {
    opacity: 0.7;
    filter: blur(10px);
  }
}

/* 噪点纹理 */
.noise-texture {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.08;
  mix-blend-mode: overlay;
  z-index: 2;
}

/* 玻璃层 */
.glass-layer {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1.5rem;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 3;
}

.group.is-hovered .glass-layer {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

/* 内容层 */
.content-layer {
  position: relative;
  z-index: 4;
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
  font-family: 'Space Grotesk', 'Microsoft YaHei', '微软雅黑', sans-serif;
}

.group.is-hovered .project-title {
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 0 20px rgba(59, 130, 246, 0.25);
}

/* 状态标签 - 弹跳动画 */
.project-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  padding: 0.4rem 0.8rem;
  border-radius: 9999px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.group.is-hovered .project-status {
  animation: statusBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes statusBounce {
  0% {
    transform: translateY(0) scale(1);
  }
  30% {
    transform: translateY(-8px) scale(1.1);
  }
  50% {
    transform: translateY(-4px) scale(1.05);
  }
  70% {
    transform: translateY(-6px) scale(1.08);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.3);
  }
}

.status-running {
  background: rgba(251, 191, 36, 0.12);
  border: 1px solid rgba(251, 191, 36, 0.25);
  color: rgb(252, 211, 77);
}

.status-running .status-dot {
  background: rgb(252, 211, 77);
  box-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
}

.status-online {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.25);
  color: rgb(52, 211, 153);
}

.status-online .status-dot {
  background: rgb(52, 211, 153);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.status-dev {
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.25);
  color: rgb(96, 165, 250);
}

.status-dev .status-dot {
  background: rgb(96, 165, 250);
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}

.status-plan {
  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.25);
  color: rgb(167, 139, 250);
}

.status-plan .status-dot {
  background: rgb(167, 139, 250);
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.5);
}

.project-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 1.5rem;
  flex-grow: 1;
  transition: color 0.3s ease;
}

.group.is-hovered .project-desc {
  color: rgba(255, 255, 255, 0.75);
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  gap: 1rem;
  transition: border-color 0.3s ease;
}

.group.is-hovered .project-footer {
  border-color: rgba(255, 255, 255, 0.12);
}

.project-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex: 1;
}

.tag {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.04);
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(10px);
}

.tag:hover {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.25);
  color: rgb(147, 197, 253);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.project-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.project-link:hover {
  color: rgb(147, 197, 253);
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.25);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.project-link:hover .arrow-icon {
  transform: translateX(4px);
}

/* 响应式 */
@media (max-width: 768px) {
  .content-layer {
    padding: 1.5rem;
  }
  
  .project-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .project-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .project-link {
    width: 100%;
    justify-content: center;
  }
}
</style>
