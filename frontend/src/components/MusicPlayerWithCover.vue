<template>
  <div class="music-container" :class="{ 'cover-expanded': isCoverHovered }">
    <!-- 封面区域 -->
    <div 
      class="cover-section"
      @mouseenter="isCoverHovered = true"
      @mouseleave="isCoverHovered = false"
      :style="{ backgroundImage: `url(${currentSong.cover})` }"
    >
      <div class="cover-overlay"></div>
      <div class="cover-info">
        <div class="cover-title">{{ currentSong.name }}</div>
        <div class="cover-artist">{{ currentSong.artist }}</div>
      </div>
    </div>
    
    <!-- 播放器区域 -->
    <div class="player-section">
      <MusicPlayer ref="playerRef" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import MusicPlayer from './MusicPlayer.vue'

const playerRef = ref(null)
const isCoverHovered = ref(false)
const currentSong = ref({
  name: '加载中...',
  artist: '未知艺术家',
  cover: ''
})

// 加载播放列表
const loadPlaylist = async () => {
  try {
    const response = await fetch('/music/playlist.json')
    const data = await response.json()
    
    if (data.length > 0) {
      currentSong.value = data[0]
    }
  } catch (error) {
    console.error('加载播放列表失败:', error)
  }
}

// 监听播放器的歌曲变化
const updateCurrentSong = () => {
  if (playerRef.value && playerRef.value.currentSong) {
    currentSong.value = playerRef.value.currentSong
  }
}

onMounted(() => {
  loadPlaylist()
  
  // 定期检查当前歌曲
  setInterval(updateCurrentSong, 1000)
})
</script>

<style scoped>
.music-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
  display: grid;
  grid-template-columns: 18% 82%;
  border-radius: 12px;
  overflow: hidden;
  transition: grid-template-columns 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.music-container.cover-expanded {
  grid-template-columns: 75% 25%;
}

/* 封面区域 */
.cover-section {
  position: relative;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: grayscale(0.3) brightness(0.8);
  z-index: 2;
  overflow: hidden;
}

.music-container.cover-expanded .cover-section {
  filter: grayscale(0) brightness(1);
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 40%,
    rgba(0, 0, 0, 0.6) 100%
  );
  pointer-events: none;
}

.cover-info {
  position: relative;
  z-index: 2;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
  transition-delay: 0s;
}

.music-container.cover-expanded .cover-info {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.3s;
}

.cover-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.02em;
}

.cover-artist {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.05em;
}

/* 播放器区域 */
.player-section {
  position: relative;
  z-index: 1;
  background: rgba(18, 18, 18, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.05);
  transition: all 0.5s ease;
}

.music-container.cover-expanded .player-section {
  opacity: 0.5;
}

/* 响应式 */
@media (max-width: 768px) {
  .music-container {
    grid-template-columns: 30% 70%;
  }
  
  .music-container.cover-expanded {
    grid-template-columns: 70% 30%;
  }
  
  .cover-section {
    transform: skewX(0deg);
    margin-right: 0;
  }
}
</style>

