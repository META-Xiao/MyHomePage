<template>
  <div 
    class="skill-card"
    :style="{ background: tech.color }"
  >
    <div class="skill-card-content">
      <Icon :icon="tech.icon" class="skill-icon" />
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  tech: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.skill-card {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
  pointer-events: none;
  filter: brightness(var(--recommend-dark-degree, 0.9));
}

.skill-card-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.skill-icon {
  width: 70px;
  height: 70px;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

/* 响应式 */
@media (max-width: 768px) {
  .skill-card {
    width: 100px;
    height: 100px;
  }
  
  .skill-icon {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .skill-card {
    width: 80px;
    height: 80px;
  }
  
  .skill-icon {
    width: 48px;
    height: 48px;
  }
}
</style>

