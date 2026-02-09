<template>
  <a 
    ref="cardRef"
    :href="contact.link"
    target="_blank"
    :style="cardStyle()"
    class="contact-item glass-effect rounded-xl p-6 flex items-center group"
  >
    <div 
      class="contact-icon w-16 h-16 rounded-full flex items-center justify-center text-3xl mr-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
      :style="{ background: contact.gradient }"
    >
      {{ contact.icon }}
    </div>
    <div class="contact-info">
      <h4 class="text-base font-medium mb-1 transition-colors group-hover:text-accent">{{ contact.title }}</h4>
      <p class="text-sm text-white/60 transition-colors group-hover:text-white/80">{{ contact.value }}</p>
    </div>
  </a>
</template>

<script setup>
import { use3DCard } from '@/composables/use3DCard'

const props = defineProps({
  contact: {
    type: Object,
    required: true
  }
})

const { cardRef, cardStyle } = use3DCard()
</script>

<style scoped>
.contact-item {
  transform-style: preserve-3d;
  will-change: transform;
}
</style>

