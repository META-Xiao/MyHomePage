<template>
  <div class="find-section container-custom">
    <h2 class="section-title">
      我会在哪儿？ <span class="gradient-text">WHERE</span>
    </h2>
    
    <div class="links-container">
      <!-- 主要平台 -->
      <div
        class="main-card-wrapper"
        @mouseenter="isBlogOpen = true"
        @mouseleave="isBlogOpen = false"
        @click.stop="toggleBlog"
      >
        <!-- 主卡片本体 -->
        <div class="main-card glass-card">
          <div class="card-glow" :style="{ background: mainLink.glowColor }"></div>
          <div class="card-content">
            <div class="icon-wrapper">
              <iconify-icon :icon="mainLink.icon" width="48"></iconify-icon>
            </div>
            <h3>{{ mainLink.title }}</h3>
            <p>{{ mainLink.desc }}</p>
            <!-- 展开提示箭头 -->
            <div class="expand-hint" :class="{ open: isBlogOpen }">
              <iconify-icon icon="ri:arrow-down-s-line" width="20"></iconify-icon>
            </div>
          </div>
        </div>

        <!-- 内联下拉展开区 -->
        <div class="blog-dropdown" :class="{ expanded: isBlogOpen }">
          <div class="dropdown-inner">
            <a
              v-for="blog in blogOptions"
              :key="blog.label"
              :href="blog.link"
              target="_blank"
              class="blog-option"
              @click.stop
            >
              <div class="blog-option-glow" :style="{ background: blog.glow }"></div>
              <div class="blog-option-body">
                <iconify-icon :icon="blog.icon" width="22"></iconify-icon>
                <div class="blog-option-text">
                  <strong>{{ blog.label }}</strong>
                  <span>{{ blog.sub }}</span>
                </div>
                <iconify-icon icon="ri:arrow-right-up-line" width="16" class="arrow-out"></iconify-icon>
              </div>
            </a>
          </div>
        </div>
      </div>
      
      <!-- 次要平台 - 不规则网格 -->
      <div class="secondary-grid">
        <a 
          v-for="(item, index) in secondaryLinks" 
          :key="index"
          :href="item.link"
          target="_blank"
          class="secondary-card glass-card"
          :class="`card-${index + 1}`"
          :style="{ gridArea: item.gridArea }"
        >
          <div class="card-glow" :style="{ background: item.glowColor }"></div>
          <div class="card-content">
            <iconify-icon v-if="!item.customIcon" :icon="item.icon" width="32"></iconify-icon>
            <img v-else :src="item.customIcon" :alt="item.title" class="custom-icon" />
            <span>{{ item.title }}</span>
          </div>
          <div class="status-bar" :style="{ background: item.statusColor }"></div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isBlogOpen = ref(false)

function toggleBlog() {
  // 仅移动端（touch 设备）响应 click 切换
  if (window.matchMedia('(hover: none)').matches) {
    isBlogOpen.value = !isBlogOpen.value
  }
}

const mainLink = {
  title: '我的博客',
  desc: '写代码、写 Bug、写人生',
  icon: 'ri:quill-pen-line',
  glowColor: 'radial-gradient(circle at 30% 50%, rgba(6, 182, 212, 0.15), transparent 70%)'
}

const blogOptions = [
  {
    label: '新博客',
    sub: '现在在用，还在折腾',
    link: 'https://blog.teslongxiao.cn/',
    icon: 'ri:sparkling-line',
    glow: 'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.18), transparent 70%)'
  },
  {
    label: '老博客',
    sub: '考古专用，轻点翻',
    link: 'https://oldblog.teslongxiao.cn/',
    icon: 'ri:time-line',
    glow: 'radial-gradient(circle at 80% 50%, rgba(251, 191, 36, 0.14), transparent 70%)'
  }
]

const secondaryLinks = [
  {
    title: 'GitHub',
    icon: 'ri:github-fill',
    link: 'https://github.com',
    glowColor: 'radial-gradient(circle at 50% 50%, rgba(61, 68, 77, 0.12), transparent 70%)',
    statusColor: 'linear-gradient(90deg, rgba(61, 68, 77, 0.3), rgba(88, 96, 105, 0.2))',
    gridArea: 'a'
  },
  {
    title: '服务器监控',
    icon: 'ri:server-line',
    link: 'https://status.teslongxiao.cn',
    glowColor: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.12), transparent 70%)',
    statusColor: 'linear-gradient(90deg, rgba(16, 185, 129, 0.3), rgba(52, 211, 153, 0.2))',
    gridArea: 'b'
  },
  {
    title: 'Codeforces',
    icon: 'simple-icons:codeforces',
    link: 'https://codeforces.com/profile/HooowTOdoTHIS',
    glowColor: 'radial-gradient(circle at 50% 50%, rgba(31, 120, 180, 0.12), transparent 70%)',
    statusColor: 'linear-gradient(90deg, rgba(31, 120, 180, 0.3), rgba(49, 130, 189, 0.2))',
    gridArea: 'c'
  },
  {
    title: 'CLIST',
    icon: 'mdi:chart-line',
    link: 'https://clist.by/',
    glowColor: 'radial-gradient(circle at 50% 50%, rgba(66, 133, 244, 0.12), transparent 70%)',
    statusColor: 'linear-gradient(90deg, rgba(66, 133, 244, 0.3), rgba(52, 168, 83, 0.2))',
    gridArea: 'd'
  },
  {
    title: 'Bilibili',
    icon: 'ri:bilibili-line',
    link: '#',
    glowColor: 'radial-gradient(circle at 50% 50%, rgba(251, 114, 153, 0.12), transparent 70%)',
    statusColor: 'linear-gradient(90deg, rgba(251, 114, 153, 0.3), rgba(252, 165, 165, 0.2))',
    gridArea: 'e'
  },
  {
    title: '牛客竞赛',
    icon: 'mdi:code-braces',
    link: 'https://ac.nowcoder.com/acm/contest/profile/545624599',
    glowColor: 'radial-gradient(circle at 50% 50%, rgba(46, 204, 113, 0.12), transparent 70%)',
    statusColor: 'linear-gradient(90deg, rgba(46, 204, 113, 0.3), rgba(39, 174, 96, 0.2))',
    gridArea: 'f'
  },
  {
    title: '网易云',
    icon: 'ri:netease-cloud-music-line',
    link: '#',
    glowColor: 'radial-gradient(circle at 50% 50%, rgba(194, 12, 12, 0.12), transparent 70%)',
    statusColor: 'linear-gradient(90deg, rgba(194, 12, 12, 0.3), rgba(220, 38, 38, 0.2))',
    gridArea: 'g'
  }
]
</script>

<style scoped>
.find-section {
  padding: 120px 0;
}

.section-title {
  @apply text-3xl md:text-4xl font-light tracking-[0.3em] text-white/50 pb-10 mb-12;
  position: relative;
  font-family: 'Microsoft YaHei', '微软雅黑', 'PingFang SC', sans-serif;
  font-weight: 500;
  cursor: pointer;
  display: inline-block;
}

.section-title .gradient-text {
  font-family: 'Brush Script MT', 'Lucida Handwriting', 'Segoe Script', 'Pacifico', cursive;
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0.1em;
}

.section-title::after {
  content: '';
  @apply block h-1 mt-8 rounded-full;
  width: 80px;
  background: linear-gradient(90deg, theme('colors.accent.DEFAULT'), theme('colors.accent.secondary'));
  transition: width 0.3s ease;
}

.section-title:hover::after {
  width: 100%;
}

.links-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  align-items: start;
}

/* ========== 主卡片 wrapper ========== */
.main-card-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0;
  cursor: pointer;
}

/* 主卡片本体 */
.main-card {
  position: relative;
  padding: 3rem 2.5rem;
  min-height: 320px;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-decoration: none;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 1.5rem 1.5rem 1.5rem 1.5rem;
  transition: border-radius 0.3s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
              background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

/* hover 时主卡片整体略微放大，圆角保持完整 */
.main-card-wrapper:hover .main-card {
  transform: scale(1.03);
}

.main-card .icon-wrapper {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  margin-bottom: 1.5rem;
  transition: all 0.4s ease;
}

.main-card-wrapper:hover .main-card .icon-wrapper {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(360deg) scale(1.1);
}

.main-card h3 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  letter-spacing: 0.05em;
}

.main-card p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  letter-spacing: 0.02em;
  margin-bottom: 0;
}

/* 展开提示箭头 */
.expand-hint {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1.25rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.08em;
  transition: color 0.3s ease, opacity 0.3s ease;
  opacity: 0.7;
}

.expand-hint iconify-icon {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: block;
}

.expand-hint.open iconify-icon {
  transform: rotate(180deg);
}

.main-card-wrapper:hover .expand-hint {
  color: rgba(6, 182, 212, 0.8);
  opacity: 1;
}

/* ========== 博客下拉区 ========== */
.blog-dropdown {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.42s cubic-bezier(0.16, 1, 0.3, 1);
  /* 与主卡片之间留 6px 间距，下拉区独立圆角 */
  margin-top: 6px;
  border-radius: 1.5rem;
  overflow: hidden;
}

.blog-dropdown.expanded {
  grid-template-rows: 1fr;
}

.dropdown-inner {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0;
  /* 玻璃态继承感，四角全圆 */
  background: rgba(255, 255, 255, 0.025);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  /* 噪点纹理 */
  position: relative;
}

.dropdown-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.05;
  mix-blend-mode: overlay;
  pointer-events: none;
  border-radius: 1.5rem;
}

/* 单条博客选项 */
.blog-option {
  position: relative;
  display: block;
  text-decoration: none;
  color: #fff;
  overflow: hidden;
  transition: background 0.25s ease;
}

.blog-option:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.blog-option:hover {
  background: rgba(255, 255, 255, 0.04);
}

.blog-option-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.blog-option:hover .blog-option-glow {
  opacity: 1;
}

.blog-option-body {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.75rem;
}

.blog-option-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.blog-option-text strong {
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.9);
}

.blog-option-text span {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.03em;
}

.arrow-out {
  color: rgba(255, 255, 255, 0.25);
  transition: color 0.25s ease, transform 0.25s ease;
  flex-shrink: 0;
}

.blog-option:hover .arrow-out {
  color: rgba(6, 182, 212, 0.9);
  transform: translate(2px, -2px);
}

/* ========== 次要网格 ========== */
.secondary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
    "a a b"
    "c d e"
    "f g g";
  gap: 1rem;
}

.secondary-card {
  position: relative;
  padding: 1.5rem;
  min-height: 120px;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-decoration: none;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.secondary-card:hover {
  transform: scale(1.08) translateY(-8px);
  z-index: 10;
}

.secondary-card .card-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.secondary-card span {
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.custom-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  transition: filter 0.3s ease;
}

.secondary-card:hover .custom-icon {
  filter: brightness(1) invert(0);
}

.secondary-card .status-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  transition: all 0.3s ease;
}

.secondary-card:hover .status-bar {
  height: 100%;
  opacity: 0.15;
}

/* 玻璃卡片效果 */
.glass-card {
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  overflow: hidden;
  isolation: isolate;
}

.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.06;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.card-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.glass-card:hover .card-glow {
  opacity: 1;
}

.card-content {
  position: relative;
  z-index: 1;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .find-section {
    padding: 80px 0;
  }

  .section-title {
    font-size: 1.5rem;
    letter-spacing: 0.15em;
    padding-bottom: 20px;
    margin-bottom: 30px;
  }

  .section-title::after {
    margin-top: 20px;
  }

  .links-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .main-card {
    padding: 2rem 1.5rem;
    min-height: 200px;
  }

  .main-card .icon-wrapper {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
  }

  .main-card h3 {
    font-size: 1.5rem;
  }

  .main-card p {
    font-size: 0.875rem;
  }

  /* 移动端 */
  .main-card-wrapper:hover .main-card {
    transform: none;
  }

  .secondary-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "a a"
      "b c"
      "d e"
      "f f"
      "g g";
    gap: 0.75rem;
  }

  .secondary-card {
    min-height: 100px;
    padding: 1rem;
  }

  .secondary-card span {
    font-size: 0.8rem;
  }
}

/* 超窄屏优化 */
@media (max-width: 480px) {
  .find-section {
    padding: 60px 0;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .main-card {
    padding: 1.5rem;
    min-height: 180px;
  }

  .main-card .icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .main-card h3 {
    font-size: 1.25rem;
  }

  .secondary-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "a a"
      "b c"
      "d e"
      "f f"
      "g g";
    gap: 0.5rem;
  }

  .secondary-card {
    min-height: 90px;
    padding: 0.75rem;
  }
}
</style>
  