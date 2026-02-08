<template>
  <div class="projects-section container-custom">
    <h2 class="section-title">
      项目 <span class="gradient-text">PROJECTS</span>
    </h2>
    
    <div class="projects-grid grid grid-cols-1 md:grid-cols-2 gap-8">
      <div 
        v-for="(project, index) in projects" 
        :key="index"
        class="project-card glass-effect rounded-2xl p-8 card-hover"
      >
        <div class="project-header flex justify-between items-start mb-4">
          <h3 class="project-title text-xl font-medium tracking-wide">{{ project.title }}</h3>
          <span 
            :class="['project-status text-xs px-3 py-1 rounded-full border', project.statusClass]"
          >
            {{ project.status }}
          </span>
        </div>
        
        <p class="project-desc text-sm text-white/70 leading-relaxed mb-6">
          {{ project.description }}
        </p>
        
        <div class="project-footer flex justify-between items-center pt-5 border-t border-white/10">
          <div class="project-tags flex gap-2 flex-wrap">
            <span 
              v-for="(tag, i) in project.tags" 
              :key="i"
              class="tag text-xs text-white/60 bg-white/5 px-3 py-1 rounded-md border border-white/5"
            >
              {{ tag }}
            </span>
          </div>
          <a 
            :href="project.link" 
            target="_blank"
            class="project-link text-accent text-sm font-medium hover:translate-x-1 transition-transform"
          >
            访问 →
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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

