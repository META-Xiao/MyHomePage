<template>
  <div class="about-section container-custom">
    <h2 class="section-title">
      关于 <span class="gradient-text">ABOUT</span>
    </h2>
    
    <!-- 上方区域：技能墙 + 个人信息 -->
    <div class="top-section">
      <!-- 左侧区域 -->
      <div class="left-section">
        <!-- 技能墙 -->
        <div class="skills-wall-wrapper">
          <!-- 左上角：座右铭 -->
          <div class="motto-overlay">
            <h2 class="motto-main">Stay hungry</h2>
            <h2 class="motto-sub">Stay foolish</h2>
            <p class="motto-url">www.teslongxiao.cn</p>
          </div>
          
          <div class="skills-wall">
            <div class="skills-row skills-row-1">
              <TechCard 
                v-for="(tech, index) in skillRows[0]" 
                :key="`row1-${index}-0`"
                :tech="tech"
                :index="index"
              />
              <TechCard 
                v-for="(tech, index) in skillRows[0]" 
                :key="`row1-${index}-1`"
                :tech="tech"
                :index="index"
              />
              <TechCard 
                v-for="(tech, index) in skillRows[0]" 
                :key="`row1-${index}-2`"
                :tech="tech"
                :index="index"
              />
              <TechCard 
                v-for="(tech, index) in skillRows[0]" 
                :key="`row1-${index}-3`"
                :tech="tech"
                :index="index"
              />
              <TechCard 
                v-for="(tech, index) in skillRows[0]" 
                :key="`row1-${index}-4`"
                :tech="tech"
                :index="index"
              />
              <TechCard 
                v-for="(tech, index) in skillRows[0]" 
                :key="`row1-${index}-5`"
                :tech="tech"
                :index="index"
              />
            </div>
            <div class="skills-row skills-row-2">
              <TechCard 
                v-for="(tech, index) in skillRows[1]" 
                :key="`row2-${index}-0`"
                :tech="tech"
                :index="index"
              />
              <TechCard 
                v-for="(tech, index) in skillRows[1]" 
                :key="`row2-${index}-1`"
                :tech="tech"
                :index="index"
              />
              <TechCard 
                v-for="(tech, index) in skillRows[1]" 
                :key="`row2-${index}-2`"
                :tech="tech"
                :index="index"
              />
              <TechCard 
                v-for="(tech, index) in skillRows[1]" 
                :key="`row2-${index}-3`"
                :tech="tech"
                :index="index"
              />
              <TechCard 
                v-for="(tech, index) in skillRows[1]" 
                :key="`row2-${index}-4`"
                :tech="tech"
                :index="index"
              />
              <TechCard 
                v-for="(tech, index) in skillRows[1]" 
                :key="`row2-${index}-5`"
                :tech="tech"
                :index="index"
              />
            </div>
          </div>
        </div>
        
        <!-- 项目展示区域 -->
        <div class="projects-container">
          <ProjectCard 
            v-for="(project, index) in projects" 
            :key="index"
            :project="project"
            :index="index"
          />
        </div>
      </div>
      
      <!-- 右侧区域 -->
      <div class="right-section">
        <!-- 音乐播放器 -->
        <MusicPlayer class="music-player-wrapper" />
        
        <!-- 社交媒体卡片 -->
        <div class="social-main">
          <a 
            v-for="(social, index) in socialLinks" 
            :key="social.name"
            :ref="el => setSocialCardRef(el, index)"
            :href="social.link"
            target="_blank"
            class="social-card"
            :class="[social.name, index < 3 ? 'first-row' : 'second-row']"
            :style="socialCardStyles[index]"
            @mousemove="e => handleSocialMouseMove(e, index)"
            @mouseleave="() => handleSocialMouseLeave(index)"
          >
            <Icon :icon="social.icon" />
          </a>
          
          <div class="social-bg">
            <svg class="social-text-svg" viewBox="0 0 300 100">
              <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="social-text">
                SOCIAL
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import TechCard from './cards/TechCard.vue'
import ProjectCard from './cards/ProjectCard.vue'
import MusicPlayer from './MusicPlayer.vue'

const socialLinks = [
  { name: 'github', icon: 'ri:github-fill', link: 'https://github.com/META-Xiao', color: '#333' },
  { name: 'bilibili', icon: 'ri:bilibili-fill', link: '#', color: '#fb7299' },
  { name: 'twitter', icon: 'ri:twitter-x-fill', link: '#', color: '#1da1f2' },
  { name: 'email', icon: 'ri:mail-fill', link: 'mailto:your@email.com', color: '#ea4335' },
  { name: 'wechat', icon: 'ri:wechat-fill', link: '#', color: '#07c160' },
  { name: 'qq', icon: 'ri:qq-fill', link: '#', color: '#12b7f5' },
]

const techStack = [
  { icon: 'skill-icons:vuejs-light', name: 'Vue', color: '#42b883' },
  { icon: 'skill-icons:react-dark', name: 'React', color: '#61dafb' },
  { icon: 'skill-icons:angular-dark', name: 'Angular', color: '#dd0031' },
  { icon: 'skill-icons:typescript', name: 'TypeScript', color: '#3178c6' },
  { icon: 'skill-icons:javascript', name: 'JavaScript', color: '#f7df1e' },
  { icon: 'skill-icons:nodejs-light', name: 'Node.js', color: '#68a063' },
  { icon: 'skill-icons:python-light', name: 'Python', color: '#3776ab' },
  { icon: 'skill-icons:docker', name: 'Docker', color: '#2496ed' },
  { icon: 'skill-icons:kubernetes', name: 'K8s', color: '#326ce5' },
  { icon: 'skill-icons:linux-light', name: 'Linux', color: '#fcc624' },
  { icon: 'skill-icons:nginx', name: 'Nginx', color: '#009639' },
  { icon: 'skill-icons:mongodb', name: 'MongoDB', color: '#47a248' },
  { icon: 'skill-icons:git', name: 'Git', color: '#f05032' },
  { icon: 'skill-icons:mysql-dark', name: 'MySQL', color: '#4479a1' },
  { icon: 'skill-icons:redis-dark', name: 'Redis', color: '#dc382d' },
  { icon: 'skill-icons:postgresql-dark', name: 'PostgreSQL', color: '#336791' }
]

// 增加卡片数量，每行8个，让滚动更连续
const skillRows = [
  techStack.slice(0, 8),
  techStack.slice(8, 16)
]

// 项目数据
const projects = [
  {
    title: 'MX-Space',
    description: '现代化个人空间系统，支持博客、笔记、动态。Next.js + NestJS 构建。',
    link: 'https://github.com/mx-space'
  },
  {
    title: 'Homepage',
    description: '你现在看到的主页。Vue 3 + Node.js，动态获取博客数据。',
    link: 'https://github.com/META-Xiao/MyHomePage'
  },
  {
    title: 'Docker 工具',
    description: '一键部署脚本集合，常用服务的 Docker Compose 配置。',
    link: 'https://github.com/META-Xiao'
  }
]

// 社交卡片 3D 效果
const socialCardRefs = ref([])
const socialCardStyles = ref([])

const handleSocialMouseMove = (e, index) => {
  const card = socialCardRefs.value[index]
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5

  const rotateY = x * 8
  const rotateX = -y * 8

  socialCardStyles.value[index] = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05) translateZ(10px)`,
    transition: 'transform 0.1s ease-out'
  }
}

const handleSocialMouseLeave = (index) => {
  socialCardStyles.value[index] = {
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)',
    transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
}

const setSocialCardRef = (el, index) => {
  if (el) {
    socialCardRefs.value[index] = el
  }
}

onMounted(() => {
  // 初始化样式数组
  socialCardStyles.value = new Array(socialLinks.length).fill({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)',
    transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
  })
})

onUnmounted(() => {
  socialCardRefs.value = []
})
</script>

<style scoped>
.about-section {
  padding: 80px 0;
}

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

.top-section {
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.left-section {
  flex: 0 0 65%;
  max-width: 65%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.right-section {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 技能墙 */
.skills-wall-wrapper {
  position: relative;
  overflow: hidden;
  padding: 1rem 0;
  background: rgba(18, 18, 18, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.05);
  border-radius: 12px;
  pointer-events: none;
  height: 320px;
  width: 100%;
}

.motto-overlay {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 10;
  pointer-events: none;
}

.motto-overlay .motto-main,
.motto-overlay .motto-sub {
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  font-weight: 700;
  line-height: 1.1;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: -0.02em;
  margin-bottom: 0.25rem;
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.6);
}

.motto-overlay .motto-url {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  letter-spacing: 0.05em;
  margin-top: 0.75rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.skills-wall {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transform: rotate(-8deg) translate(40%, 30%);
  transform-origin: center;
}

.skills-row {
  display: flex;
  gap: 1rem;
  will-change: transform;
}

.skills-row-1 {
  animation: scroll-left 60s linear infinite;
}

.skills-row-2 {
  animation: scroll-right 60s linear infinite;
}

@keyframes scroll-left {
  from {
    transform: translateX(-33.333%);
  }
  to {
    transform: translateX(-66.666%);
  }
}

@keyframes scroll-right {
  from {
    transform: translateX(-66.666%);
  }
  to {
    transform: translateX(-33.333%);
  }
}

/* 音乐播放器 */
.music-player-wrapper {
  min-height: 200px;
}

/* 社交媒体卡片 */
.social-main {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 0px;
  cursor: pointer;
  border-radius: 12px;
  transition: 0.5s ease-in-out;
  min-height: 240px;
  flex: 1;
  overflow: hidden;
}

.social-main:hover {
  gap: 8px;
}

.social-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ff7242, #ff5370, #ff6b9d);
  border-radius: 12px;
  box-shadow: inset 0 0 80px rgba(255, 255, 255, 0.3),
              inset 0 0 20px rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.5s ease-in-out;
  opacity: 1;
  backdrop-filter: blur(10px);
}

.social-main:hover .social-bg {
  opacity: 0;
  z-index: -1;
}

.social-text-svg {
  width: 100%;
  height: 100%;
  max-width: 280px;
}

.social-text {
  font-family: 'Brush Script MT', 'Lucida Handwriting', 'Segoe Script', 'Pacifico', cursive;
  font-size: 48px;
  font-weight: bold;
  fill: transparent;
  stroke: rgba(255, 255, 255, 0.9);
  stroke-width: 2;
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: draw-text 3s ease-in-out infinite;
}

@keyframes draw-text {
  0% {
    stroke-dashoffset: 300;
    fill: transparent;
  }
  70% {
    stroke-dashoffset: 0;
    fill: transparent;
  }
  80% {
    fill: transparent;
  }
  100% {
    stroke-dashoffset: 0;
    fill: rgba(255, 255, 255, 0.9);
  }
}

.social-card {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: opacity 0.5s ease-in-out, background 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  opacity: 0;
  font-size: 1.8rem;
  text-decoration: none;
  overflow: hidden;
  isolation: isolate;
  transform-style: preserve-3d;
  will-change: transform;
}

.social-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.06;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.social-main:hover .social-card {
  opacity: 1;
}

.social-main .social-card.first-row:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 212, 255, 0.15);
}

.social-main .social-card.second-row:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 212, 255, 0.15);
}

.social-card .iconify {
  position: relative;
  z-index: 2;
}

.social-card.github {
  color: #333;
}
.social-card.github:hover {
  background: rgba(51, 51, 51, 0.9) !important;
  color: white;
}

.social-card.bilibili {
  color: #fb7299;
}
.social-card.bilibili:hover {
  background: rgba(251, 114, 153, 0.9) !important;
  color: white;
}

.social-card.twitter {
  color: #000;
}
.social-card.twitter:hover {
  background: rgba(0, 0, 0, 0.9) !important;
  color: white;
}

.social-card.email {
  color: #ea4335;
}
.social-card.email:hover {
  background: rgba(234, 67, 53, 0.9) !important;
  color: white;
}

.social-card.wechat {
  color: #07c160;
}
.social-card.wechat:hover {
  background: rgba(7, 193, 96, 0.9) !important;
  color: white;
}

.social-card.qq {
  color: #12b7f5;
}
.social-card.qq:hover {
  background: rgba(18, 183, 245, 0.9) !important;
  color: white;
}

/* 项目展示区域 */
.projects-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* 响应式 */
@media (max-width: 1024px) {
  .top-section {
    flex-direction: column;
  }
  
  .left-section {
    flex: 1;
  }
  
  .right-section {
    flex-direction: row;
  }
  
  .projects-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .skills-wall {
    transform: rotate(-8deg) translate(35%, 25%);
  }
  
  .avatar {
    width: 100px;
    height: 100px;
  }
  
  .projects-container {
    grid-template-columns: 1fr;
  }
  
  .right-section {
    flex-direction: column;
  }
}
</style>

