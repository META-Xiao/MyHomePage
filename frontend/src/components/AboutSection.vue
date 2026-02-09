<template>
  <div class="about-section container-custom">
    <h2 class="section-title">
      关于 <span class="gradient-text">ABOUT</span>
    </h2>
    
    <div class="intro-content mb-16">
      <img 
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=MetaXiao" 
        alt="Avatar" 
        class="avatar float-right ml-10 mb-6 w-40 h-40 rounded-full border-4 border-white/10 transition-all duration-500 hover:scale-110 hover:rotate-12 hover:border-accent hover:shadow-2xl hover:shadow-accent/50"
      >
      <div class="text-white/70 leading-8 text-base">
        <p class="mb-4">
          你好！我是 <span class="text-accent font-medium">MetaXiao</span>，一名热爱技术的开发者。
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
      <TechCard 
        v-for="(tech, index) in techStack" 
        :key="index"
        :tech="tech"
        :index="index"
      />
    </div>
  </div>
</template>

<script setup>
import TechCard from './cards/TechCard.vue'

const techStack = [
  {
    icon: 'skill-icons:vuejs-light',
    name: '前端开发',
    desc: 'Vue / React / TypeScript'
  },
  {
    icon: 'skill-icons:nodejs-light',
    name: '后端开发',
    desc: 'Node.js / Python / Go'
  },
  {
    icon: 'skill-icons:docker',
    name: '容器化',
    desc: 'Docker / Kubernetes'
  },
  {
    icon: 'skill-icons:linux-light',
    name: '云服务',
    desc: 'Linux / Nginx / CI/CD'
  },
  {
    icon: 'skill-icons:mongodb',
    name: '数据库',
    desc: 'MySQL / MongoDB / Redis'
  },
  {
    icon: 'skill-icons:figma-light',
    name: '设计工具',
    desc: 'Figma / Photoshop'
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

