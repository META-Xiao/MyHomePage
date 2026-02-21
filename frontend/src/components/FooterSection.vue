<template>
  <footer class="footer-section text-center py-20 pb-10">
    <div class="container-custom">
      <div class="footer-title-wrapper">
        <svg class="footer-title-svg" viewBox="0 0 600 100">
          <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="footer-title-text">
            MetaXiao の Digital Space
          </text>
        </svg>
      </div>
      <p class="text-sm tracking-wider opacity-50 mb-2">
        探索 · 创造 · 分享
      </p>
      <div class="footer-links flex justify-center gap-6 mb-4 text-sm opacity-50">
        <a href="https://blog.teslongxiao.cn/" target="_blank" class="hover:text-accent transition-colors">博客</a>
        <a href="https://status.teslongxiao.cn/" target="_blank" class="hover:text-accent transition-colors">监控</a>
        <a href="https://github.com/META-Xiao" target="_blank" class="hover:text-accent transition-colors">GitHub</a>
      </div>
      <p class="text-xs tracking-wider opacity-30 mt-8">
        © 2026 MetaXiao | Powered by 
        <a href="https://github.com/META-Xiao" target="_blank" class="text-accent hover:underline">
          META-Xiao
        </a>
      </p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer-section {
  position: relative;
  z-index: 2;
}

.footer-title-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.footer-title-svg {
  width: 100%;
  max-width: 600px;
  height: 80px;
}

.footer-title-text {
  font-family: 'Brush Script MT', 'Lucida Handwriting', 'Segoe Script', 'Pacifico', cursive;
  font-size: 32px;
  font-weight: bold;
  fill: transparent;
  stroke: rgba(255, 255, 255, 0.7);
  stroke-width: 1.5;
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  animation: draw-footer-text 4s ease-in-out infinite;
}

@keyframes draw-footer-text {
  0% {
    stroke-dashoffset: 500;
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
    fill: rgba(255, 255, 255, 0.7);
  }
}

@media (max-width: 768px) {
  .footer-section {
    padding-bottom: 100px;
  }
  
  .footer-title-svg {
    height: 60px;
  }
  
  .footer-title-text {
    font-size: 24px;
  }
}
</style>

