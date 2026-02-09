<template>
  <div 
    ref="cardRef"
    :style="cardStyle()"
    class="tech-item glass-effect rounded-2xl p-6 text-center group cursor-pointer"
  >
    <div class="tech-icon w-20 h-20 mx-auto mb-5 flex items-center justify-center transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
      <Icon :icon="tech.icon" width="64" height="64" />
    </div>
    <div class="tech-name text-base font-medium mb-2 tracking-wide transition-colors group-hover:text-accent">
      {{ tech.name }}
    </div>
    <div class="tech-desc text-xs text-white/60 leading-relaxed transition-colors group-hover:text-white/80">
      {{ tech.desc }}
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { use3DCard } from '@/composables/use3DCard'

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

const { cardRef, cardStyle } = use3DCard()
</script>

<style scoped>
.tech-item {
  transform-style: preserve-3d;
  will-change: transform;
}
</style>

