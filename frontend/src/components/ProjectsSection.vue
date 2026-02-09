<template>
  <div class="projects-section container-custom">
    <h2 class="section-title">
      项目 <span class="gradient-text">PROJECTS</span>
    </h2>
    
    <div class="projects-grid grid grid-cols-1 md:grid-cols-2 gap-8">
      <ProjectCard 
        v-for="(project, index) in projects" 
        :key="index"
        :project="project"
        :index="index"
      />
    </div>
  </div>
</template>

<script setup>
import ProjectCard from './cards/ProjectCard.vue'

const projects = [
  {
    title: 'MX-Space 博客系统',
    status: '运行中',
    statusClass: 'bg-accent/20 text-accent border-accent',
    description: '基于 MX-Space 搭建的个人博客系统，使用 Shiro 作为前端主题，记录技术成长和生活感悟。',
    tags: ['Next.js', 'TypeScript', 'NestJS'],
    link: 'https://teslongxiao.cn'
  },
  {
    title: '服务器监控',
    status: '在线',
    statusClass: 'bg-green-500/20 text-green-400 border-green-400',
    description: '使用哪吒监控实时监控服务器状态，保障服务稳定运行，及时发现和处理问题。',
    tags: ['监控', '运维', 'Docker'],
    link: '#'
  },
  {
    title: '个人主页',
    status: '开发中',
    statusClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-400',
    description: '使用 Vue 3 和 Aceternity UI 打造的现代化个人主页，展示项目和技术栈。',
    tags: ['Vue 3', 'Tailwind CSS', 'Canvas'],
    link: '#'
  },
  {
    title: 'API 服务',
    status: '规划中',
    statusClass: 'bg-purple-500/20 text-purple-400 border-purple-400',
    description: '基于 Node.js 的 RESTful API 服务，为前端应用提供数据支持和业务逻辑。',
    tags: ['Node.js', 'Express', 'MongoDB'],
    link: '#'
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

