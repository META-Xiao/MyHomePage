<template>
  <a 
    ref="cardRef"
    :href="link.url"
    target="_blank"
    :style="cardStyle()"
    class="link-item glass-effect rounded-xl p-5 flex items-center group"
  >
    <div class="avatar w-16 h-16 flex items-center justify-center mr-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
      <img 
        v-if="link.icon && isImageUrl(link.icon)" 
        :src="thumbnailUrl"
        :data-src="link.icon"
        :alt="link.name" 
        class="w-full h-full rounded-full object-cover border-2 border-white/10"
        loading="lazy"
        decoding="async"
        width="64"
        height="64"
        @load="onImageLoad"
        @error="handleImageError"
      />
      <Icon v-else :icon="link.icon || 'ri:link'" width="48" height="48" />
    </div>
    <div class="link-info flex-1 overflow-hidden">
      <h5 class="link-name text-base font-medium mb-1 transition-colors group-hover:text-accent">{{ link.name }}</h5>
      <p class="link-desc text-xs text-white/60 truncate transition-colors group-hover:text-white/80">{{ link.description }}</p>
    </div>
  </a>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { use3DCard } from '@/composables/use3DCard'
import { computed, ref } from 'vue'

const props = defineProps({
  link: {
    type: Object,
    required: true
  }
})

const { cardRef, cardStyle } = use3DCard()
const imageLoaded = ref(false)

// 判断是否是图片 URL
const isImageUrl = (url) => {
  if (!url) return false
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image')
}

// 生成缩略图 URL（如果是 OSS）
const thumbnailUrl = computed(() => {
  if (!props.link.icon) return ''
  
  if (props.link.icon.includes('aliyuncs.com')) {
    return `${props.link.icon}?x-oss-process=image/resize,w_100,h_100/quality,q_60`
  }

  return props.link.icon
})

// 图片加载完成后，替换为高清图
const onImageLoad = (e) => {
  if (imageLoaded.value) return
  imageLoaded.value = true
  
  setTimeout(() => {
    const img = e.target
    const hdSrc = img.getAttribute('data-src')
    if (hdSrc && hdSrc !== img.src) {
      const hdImg = new Image()
      hdImg.onload = () => {
        img.src = hdSrc
      }
      hdImg.src = hdSrc
    }
  }, 100)
}

// 图片加载失败时的处理
const handleImageError = (e) => {
  console.warn('图片加载失败:', props.link.icon)
  e.target.style.display = 'none'
}
</script>

<style scoped>
.link-item {
  transform-style: preserve-3d;
  will-change: transform;
}
</style>

