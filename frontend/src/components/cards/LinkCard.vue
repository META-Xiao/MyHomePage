<template>
  <a 
    ref="cardRef"
    :href="link.url"
    target="_blank"
    :style="cardStyle()"
    class="link-item glass-effect rounded-xl p-5 flex items-center group"
  >
    <div class="avatar w-16 h-16 rounded-full flex items-center justify-center text-3xl mr-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
         :style="{ background: link.gradient }">
      <span v-if="link.icon">{{ link.icon }}</span>
      <img v-else-if="link.avatar" :src="link.avatar" :alt="link.name" class="w-full h-full rounded-full object-cover">
    </div>
    <div class="link-info flex-1 overflow-hidden">
      <h5 class="link-name text-base font-medium mb-1 transition-colors group-hover:text-accent">{{ link.name }}</h5>
      <p class="link-desc text-xs text-white/60 truncate transition-colors group-hover:text-white/80">{{ link.description }}</p>
    </div>
  </a>
</template>

<script setup>
import { use3DCard } from '@/composables/use3DCard'

const props = defineProps({
  link: {
    type: Object,
    required: true
  }
})

const { cardRef, cardStyle } = use3DCard()
</script>

<style scoped>
.link-item {
  transform-style: preserve-3d;
  will-change: transform;
}
</style>

