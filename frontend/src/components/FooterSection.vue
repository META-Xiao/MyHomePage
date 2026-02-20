<template>
  <footer class="footer-section text-center py-20 pb-10">
    <div class="container-custom">
      <h3 class="text-2xl font-light tracking-[0.2em] mb-4">
        MetaXiao の 数字空间
      </h3>
      <p class="text-sm tracking-wider opacity-50 mb-2">
        探索 · 创造 · 分享
      </p>
      <div class="footer-links flex justify-center gap-6 mb-4 text-sm opacity-50">
        <a href="https://blog.teslongxiao.cn/" target="_blank" class="hover:text-accent transition-colors">博客</a>
        <a href="https://status.teslongxiao.cn/" target="_blank" class="hover:text-accent transition-colors">监控</a>
        <a href="https://github.com/META-Xiao" target="_blank" class="hover:text-accent transition-colors">GitHub</a>
      </div>
      <p class="text-xs tracking-wider opacity-30 mt-8">
        © 2024 MetaXiao | Powered by 
        <a href="https://mx-space.js.org/" target="_blank" class="text-accent hover:underline">
          MX-Space
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

@media (max-width: 768px) {
  .footer-section {
    padding-bottom: 100px;
  }
}
</style>

