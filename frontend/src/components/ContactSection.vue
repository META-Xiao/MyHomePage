<template>
  <div class="contact-section container-custom">
    <h2 class="section-title">
      联系 <span class="gradient-text">CONTACT</span>
    </h2>
    
    <div class="contact-grid grid grid-cols-1 md:grid-cols-3 gap-6">
      <a 
        v-for="(contact, index) in contacts" 
        :key="index"
        :href="contact.link"
        target="_blank"
        class="contact-item glass-effect rounded-xl p-6 flex items-center card-hover"
      >
        <div 
          class="contact-icon w-16 h-16 rounded-full flex items-center justify-center text-3xl mr-5 flex-shrink-0"
          :style="{ background: contact.gradient }"
        >
          {{ contact.icon }}
        </div>
        <div class="contact-info">
          <h4 class="text-base font-medium mb-1">{{ contact.title }}</h4>
          <p class="text-sm text-white/60">{{ contact.value }}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
const contacts = [
  {
    icon: '📧',
    title: '邮箱',
    value: 'your@email.com',
    link: 'mailto:your@email.com',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    icon: '🐙',
    title: 'GitHub',
    value: '@yourusername',
    link: 'https://github.com/yourusername',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    icon: '🐦',
    title: 'Twitter',
    value: '@yourusername',
    link: 'https://twitter.com/yourusername',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
]
</script>

<style scoped>
.section-title {
  @apply text-3xl md:text-4xl font-light tracking-[0.3em] text-white/50 pb-10 mb-12;
  position: relative;
}

.section-title::after {
  content: '';
  @apply block w-20 h-1 mt-8 rounded-full;
  background: linear-gradient(90deg, theme('colors.accent.DEFAULT'), theme('colors.accent.secondary'));
}
</style>

