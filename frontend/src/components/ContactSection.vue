<template>
  <div class="contact-section container-custom">
    <h2 class="section-title">
      联系 <span class="gradient-text">CONTACT</span>
    </h2>
    
    <div class="contact-grid grid grid-cols-1 md:grid-cols-3 gap-6">
      <ContactCard 
        v-for="(contact, index) in contacts" 
        :key="index"
        :contact="contact"
      />
    </div>
  </div>
</template>

<script setup>
import ContactCard from './cards/ContactCard.vue'

const contacts = [
  {
    icon: 'ri:github-fill',
    title: 'GitHub',
    value: '@META-Xiao',
    link: 'https://github.com/META-Xiao'
  },
  {
    icon: 'ri:mail-line',
    title: 'Email',
    value: '2040426884@qq.com',
    link: 'mailto:2040426884@qq.com'
  },
  {
    icon: 'ri:qq-line',
    title: 'QQ',
    value: '2040426884',
    link: 'https://qm.qq.com/cgi-bin/qm/qr?k=2040426884'
  }
]
</script>

<style scoped>
.section-title {
  @apply text-3xl md:text-4xl font-light tracking-[0.3em] text-white/50 pb-10 mb-12;
  position: relative;
  font-family: 'Microsoft YaHei', '微软雅黑', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
  font-weight: 500;
}

.section-title .gradient-text {
  font-family: 'Brush Script MT', 'Lucida Handwriting', 'Segoe Script', 'Pacifico', cursive;
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0.1em;
}

.section-title::after {
  content: '';
  @apply block w-20 h-1 mt-8 rounded-full;
  background: linear-gradient(90deg, theme('colors.accent.DEFAULT'), theme('colors.accent.secondary'));
}
</style>

