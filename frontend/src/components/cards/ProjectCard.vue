<template>
  <div class="project-box">
    <span></span>
    <div class="project-content">
      <h2>{{ project.title }}</h2>
      <p>{{ project.description }}</p>
      <a :href="project.link" target="_blank">查看项目</a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.project-box {
  position: relative;
  display: flex;
  width: 100%;
  height: 200px;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
}

.project-content {
  position: relative;
  left: 0;
  padding: 15px 20px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  z-index: 1;
  transition: 0.5s;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.project-content h2 {
  font-size: 1.2em;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
}

.project-content p {
  font-size: 0.85em;
  margin-bottom: 8px;
  line-height: 1.4em;
  color: rgba(255, 255, 255, 0.7);
}

.project-content a {
  display: inline-block;
  font-size: 0.85em;
  color: #111;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 700;
  margin-top: 5px;
  transition: 0.6s;
  text-align: center;
  width: fit-content;
}

.project-box:hover .project-content {
  left: -15px;
  padding: 20px;
}

.project-content a:hover {
  background: #222;
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 15px #222;
}

.project-box::before {
  content: "";
  position: absolute;
  background: #fff;
  top: 0;
  left: 30px;
  width: 50%;
  height: 100%;
  text-decoration: none;
  border-radius: 8px;
  transform: skewX(15deg);
  transition: 0.5s;
  opacity: 0.6;
}

.project-box::after {
  content: "";
  position: absolute;
  background: #fff;
  top: 0;
  left: 30px;
  width: 50%;
  height: 100%;
  border-radius: 8px;
  transform: skewX(15deg);
  filter: blur(30px);
  transition: 0.5s;
  opacity: 0.4;
}

.project-box:hover::before,
.project-box:hover::after {
  transform: skewX(0deg);
  left: 15px;
  width: calc(100% - 60px);
}

.project-box:nth-child(1)::before,
.project-box:nth-child(1)::after {
  background: linear-gradient(315deg, #ffbc00, #ff0058);
}

.project-box:nth-child(2)::before,
.project-box:nth-child(2)::after {
  background: linear-gradient(315deg, #03a9f4, #ff0058);
}

.project-box:nth-child(3)::before,
.project-box:nth-child(3)::after {
  background: linear-gradient(315deg, #4dff03, #00d0ff);
}

.project-box span {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  pointer-events: none;
}

.project-box span::before {
  content: "";
  position: absolute;
  background: rgba(255, 255, 255, 0.08);
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  opacity: 0;
  transition: 0.3s;
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  animation: animate 2s ease-in-out infinite;
}

.project-box:hover span::before {
  opacity: 1;
  top: -30px;
  left: 30px;
  width: 60px;
  height: 60px;
}

.project-box span::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.08);
  opacity: 0;
  transition: 0.5s;
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  animation: animate 2s ease-in-out infinite;
  animation-delay: -1s;
}

.project-box:hover span::after {
  bottom: -30px;
  right: 30px;
  width: 60px;
  height: 60px;
  opacity: 1;
}

@keyframes animate {
  0%,
  100% {
    transform: translateY(10px);
  }
  50% {
    transform: translate(-10px);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .project-box {
    height: 180px;
  }
  
  .project-content h2 {
    font-size: 1.1em;
  }
  
  .project-content p {
    font-size: 0.8em;
  }
}
</style>
