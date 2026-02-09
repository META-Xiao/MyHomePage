<template>
  <div 
    ref="cardRef"
    :style="cardStyle()"
    class="project-card glass-effect rounded-2xl p-8 group cursor-pointer"
  >
    <div class="project-header flex justify-between items-start mb-4">
      <h3 class="project-title text-xl font-medium tracking-wide transition-colors group-hover:text-accent">
        {{ project.title }}
      </h3>
      <span 
        :class="['project-status text-xs px-3 py-1 rounded-full border transition-all duration-300', project.statusClass]"
      >
        {{ project.status }}
      </span>
    </div>
    
    <p class="project-desc text-sm text-white/70 leading-relaxed mb-6 transition-colors group-hover:text-white/90">
      {{ project.description }}
    </p>
    
    <div class="project-footer flex justify-between items-center pt-5 border-t border-white/10 group-hover:border-white/20 transition-colors">
      <div class="project-tags flex gap-2 flex-wrap">
        <span 
          v-for="(tag, i) in project.tags" 
          :key="i"
          class="tag text-xs text-white/60 bg-white/5 px-3 py-1 rounded-md border border-white/5 transition-all duration-300 hover:bg-white/10 hover:border-accent hover:text-accent"
        >
          {{ tag }}
        </span>
      </div>
      <a 
        :href="project.link" 
        target="_blank"
        class="project-link text-accent text-sm font-medium hover:translate-x-2 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]"
        @click.stop
      >
        访问 →
      </a>
    </div>
  </div>
</template>

<script setup>
import { use3DCard } from '@/composables/use3DCard'

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

const { cardRef, cardStyle } = use3DCard()
</script>

<style scoped>
.project-card {
  transform-style: preserve-3d;
  will-change: transform;
}
</style>

