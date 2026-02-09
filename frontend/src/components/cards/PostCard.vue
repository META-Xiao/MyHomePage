<template>
  <a 
    ref="cardRef"
    :href="post.link"
    target="_blank"
    :style="cardStyle()"
    class="post-card glass-effect rounded-2xl p-8 block group"
  >
    <div class="post-header mb-4">
      <h3 class="post-title text-lg font-medium mb-3 leading-relaxed transition-colors group-hover:text-accent">
        {{ post.title }}
      </h3>
      <div class="post-meta text-xs text-white/40 flex items-center gap-2">
        <span class="post-category text-accent/70">{{ post.category }}</span>
        <span>·</span>
        <span>{{ post.date }}</span>
      </div>
    </div>
    
    <p class="post-excerpt text-sm text-white/70 leading-relaxed mb-6 line-clamp-3 transition-colors group-hover:text-white/90">
      {{ post.excerpt }}
    </p>
    
    <div class="post-footer flex justify-between items-center pt-4 border-t border-white/10 group-hover:border-white/20 transition-colors">
      <div class="post-tags flex gap-2 flex-wrap">
        <span 
          v-for="(tag, i) in post.tags" 
          :key="i"
          class="tag text-xs text-white/50 bg-white/5 px-2 py-1 rounded transition-all hover:bg-white/10 hover:text-accent"
        >
          {{ tag }}
        </span>
      </div>
      <div class="post-stats text-xs text-white/40 flex items-center gap-2">
        <span>👁 {{ post.views }}</span>
      </div>
    </div>
  </a>
</template>

<script setup>
import { use3DCard } from '@/composables/use3DCard'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const { cardRef, cardStyle } = use3DCard()
</script>

<style scoped>
.post-card {
  transform-style: preserve-3d;
  will-change: transform;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

