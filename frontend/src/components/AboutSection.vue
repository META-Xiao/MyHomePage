<template>
  <div class="about-section container-custom">
    <h2 class="section-title">
      关于 <span class="gradient-text">ABOUT</span>
    </h2>
    
    <div class="intro-content mb-16">
      <img 
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=TesLongXiao" 
        alt="Avatar" 
        class="avatar float-right ml-10 mb-6 w-40 h-40 rounded-full border-4 border-white/10 transition-all duration-300 hover:scale-105 hover:rotate-6 hover:border-accent hover:shadow-lg hover:shadow-accent/30"
      >
      <div class="text-white/70 leading-8 text-base">
        <p class="mb-4">
          你好！我是 <span class="text-accent font-medium">TesLongXiao</span>，一名热爱技术的开发者。
        </p>
        <p class="mb-4">
          这里是我的个人空间，记录着我在技术探索路上的点点滴滴。
          我喜欢折腾各种有趣的技术，从前端到后端，从服务器运维到自动化部署。
        </p>
        <p>
          欢迎来到我的数字世界！
        </p>
      </div>
    </div>

    <!-- 技术栈 -->
    <div class="tech-stack grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-16">
      <div 
        v-for="(tech, index) in techStack" 
        :key="index"
        class="tech-item glass-effect rounded-2xl p-6 text-center card-hover"
      >
        <div 
          class="tech-icon w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-4xl shadow-lg"
          :style="{ background: tech.gradient }"
        >
          {{ tech.icon }}
        </div>
        <div class="tech-name text-base font-medium mb-2 tracking-wide">{{ tech.name }}</div>
        <div class="tech-desc text-xs text-white/60 leading-relaxed">{{ tech.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const techStack = [
  {
    icon: '🚀',
    name: '前端开发',
    desc: 'Vue / React / TypeScript',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    icon: '⚙️',
    name: '后端开发',
    desc: 'Node.js / Python / Go',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    icon: '🐳',
    name: '容器化',
    desc: 'Docker / Kubernetes',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    icon: '☁️',
    name: '云服务',
    desc: 'Linux / Nginx / CI/CD',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    icon: '📊',
    name: '数据库',
    desc: 'MySQL / MongoDB / Redis',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    icon: '🎨',
    name: '设计工具',
    desc: 'Figma / Photoshop',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
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

.intro-content::after {
  content: '';
  @apply block clear-both;
}

@media (max-width: 768px) {
  .avatar {
    @apply float-none mx-auto block w-32 h-32 mb-8;
  }
}
</style>

