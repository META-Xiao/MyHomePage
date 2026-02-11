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
    statusClass: 'status-running',
    description: '基于 MX-Space 搭建的个人博客系统，使用 Shiro 作为前端主题，记录技术成长和生活感悟。',
    tags: ['Next.js', 'TypeScript', 'NestJS'],
    link: 'https://teslongxiao.cn',
    bgGradient: 'linear-gradient(135deg, rgba(30, 58, 138, 0.12), rgba(49, 46, 129, 0.08), rgba(30, 27, 75, 0.12))',
    borderGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.25))',
    rotation: -1.5
  },
  {
    title: '服务器监控',
    status: '在线',
    statusClass: 'status-online',
    description: '使用哪吒监控实时监控服务器状态，保障服务稳定运行，及时发现和处理问题。',
    tags: ['监控', '运维', 'Docker'],
    link: '#',
    bgGradient: 'linear-gradient(135deg, rgba(22, 78, 99, 0.12), rgba(21, 94, 117, 0.08), rgba(15, 23, 42, 0.12))',
    borderGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(20, 184, 166, 0.15), rgba(16, 185, 129, 0.25))',
    rotation: 2
  },
  {
    title: '个人主页',
    status: '开发中',
    statusClass: 'status-dev',
    description: '使用 Vue 3 和现代化 UI 框架打造的个人主页，展示项目和技术栈。',
    tags: ['Vue 3', 'Tailwind CSS', 'Canvas'],
    link: '#',
    bgGradient: 'linear-gradient(135deg, rgba(76, 29, 149, 0.12), rgba(91, 33, 182, 0.08), rgba(55, 48, 163, 0.12))',
    borderGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(124, 58, 237, 0.15), rgba(109, 40, 217, 0.25))',
    rotation: -2
  },
  {
    title: 'API 服务',
    status: '规划中',
    statusClass: 'status-plan',
    description: '基于 Node.js 的 RESTful API 服务，为前端应用提供数据支持和业务逻辑。',
    tags: ['Node.js', 'Express', 'MongoDB'],
    link: '#',
    bgGradient: 'linear-gradient(135deg, rgba(30, 64, 175, 0.12), rgba(55, 48, 163, 0.08), rgba(49, 46, 129, 0.12))',
    borderGradient: 'linear-gradient(135deg, rgba(79, 70, 229, 0.25), rgba(99, 102, 241, 0.15), rgba(67, 56, 202, 0.25))',
    rotation: 1.5
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

