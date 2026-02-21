<template>
  <div class="music-player glass-effect">
    <!-- 音频可视化画布 -->
    <canvas ref="canvasRef" class="visualizer-canvas"></canvas>
    
    <!-- 播放器控制层 -->
    <div class="player-overlay">
      <div class="song-info">
        <div class="song-title">{{ currentSong.name }}</div>
        <div class="song-artist">{{ currentSong.artist }}</div>
      </div>
      
      <!-- 底部控制区域 -->
      <div class="bottom-controls">
        <!-- 进度条 -->
        <div class="progress-bar" @click="seekTo">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        
        <!-- 时间显示 -->
        <div class="time-display">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
        
        <!-- 控制按钮 -->
        <div class="controls">
          <button @click="prevSong" class="control-btn">
            <Icon icon="ri:skip-back-fill" />
          </button>
          <button @click="togglePlay" class="play-btn">
            <Icon :icon="isPlaying ? 'ri:pause-fill' : 'ri:play-fill'" />
          </button>
          <button @click="nextSong" class="control-btn">
            <Icon icon="ri:skip-forward-fill" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- 隐藏的 audio 元素 -->
    <audio 
      ref="audioRef" 
      @timeupdate="updateTime"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      crossorigin="anonymous"
    ></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'

const canvasRef = ref(null)
const audioRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const playlist = ref([])
const currentIndex = ref(0)

const currentSong = ref({
  name: '加载中...',
  artist: '未知艺术家',
  url: ''
})

let audioContext = null
let analyser = null
let dataArray = null
let bufferLength = 0
let animationId = null
let source = null

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)
    
    // 连接音频源
    if (!source && audioRef.value) {
      source = audioContext.createMediaElementSource(audioRef.value)
      source.connect(analyser)
      analyser.connect(audioContext.destination)
    }
  }
}

// 绘制音频可视化
const drawVisualizer = () => {
  if (!canvasRef.value || !analyser) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  
  ctx.clearRect(0, 0, width, height)
  
  analyser.getByteFrequencyData(dataArray)
  
  const barWidth = (width / bufferLength) * 2.5
  let barHeight
  let x = 0

  const gradient = ctx.createLinearGradient(0, height, 0, 0)
  gradient.addColorStop(0, '#ff7242')
  gradient.addColorStop(0.5, '#ff5370')
  gradient.addColorStop(1, '#ff6b9d')
  
  for (let i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] / 255) * height * 0.8
    
    ctx.fillStyle = gradient
    ctx.fillRect(x, height - barHeight, barWidth, barHeight)

    ctx.shadowBlur = 10
    ctx.shadowColor = '#ff7242'
    
    x += barWidth + 1
  }

  if (isPlaying.value) {
    animationId = requestAnimationFrame(drawVisualizer)
  }
}

// 播放/暂停
const togglePlay = async () => {
  if (!audioRef.value) return
  
  if (!audioContext) {
    initAudioContext()
  }
  
  if (audioContext.state === 'suspended') {
    await audioContext.resume()
  }
  
  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  } else {
    audioRef.value.play()
    isPlaying.value = true
    drawVisualizer()
  }
}

const updateTime = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
    progress.value = (currentTime.value / duration.value) * 100
  }
}

const onLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
  }
}

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const loadSong = (song) => {
  currentSong.value = song
  if (audioRef.value) {
    audioRef.value.src = song.url
    audioRef.value.load()
  }
}

// 加载本地播放列表
const loadPlaylist = async () => {
  try {
    const response = await fetch('/music/playlist.json')
    const data = await response.json()
    playlist.value = data

    if (data.length > 0) {
      currentIndex.value = 0
      loadSong(data[0])
    }
  } catch (error) {
    console.error('加载播放列表失败:', error)
    currentSong.value = {
      name: '暂无歌曲',
      artist: '请添加音乐文件到 public/music',
      url: ''
    }
  }
}


const nextSong = () => {
  if (playlist.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % playlist.value.length
  loadSong(playlist.value[currentIndex.value])
  if (isPlaying.value) {
    setTimeout(() => audioRef.value.play(), 100)
  }
}

const prevSong = () => {
  if (playlist.value.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
  loadSong(playlist.value[currentIndex.value])
  if (isPlaying.value) {
    setTimeout(() => audioRef.value.play(), 100)
  }
}


const onEnded = () => {
  nextSong()
}

// 拖动进度条
const seekTo = (event) => {
  if (!audioRef.value || !duration.value) return
  
  const progressBar = event.currentTarget
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * duration.value
  
  audioRef.value.currentTime = newTime
  currentTime.value = newTime
  progress.value = percentage * 100
}

onMounted(() => {
  if (canvasRef.value) {
    const parent = canvasRef.value.parentElement
    canvasRef.value.width = parent.clientWidth
    canvasRef.value.height = parent.clientHeight
  }
  
  loadPlaylist()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (audioContext) {
    audioContext.close()
  }
})

defineExpose({
  loadSong,
  loadPlaylist,
  togglePlay,
  nextSong,
  prevSong
})
</script>

<style scoped>
.music-player {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
  padding: 0;
  border-radius: 12px;
  background: rgba(18, 18, 18, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.visualizer-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

.player-overlay {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.4) 100%);
}

.song-info {
  text-align: center;
  margin-top: 0;
  flex-shrink: 0;
}

.song-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bottom-controls {
  flex-shrink: 0;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.25rem;
  cursor: pointer;
  transition: height 0.2s ease;
}

.progress-bar:hover {
  height: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff7242, #ff5370);
  border-radius: 3px;
  transition: width 0.1s linear;
  pointer-events: none;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.5rem;
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.1);
  color: rgba(255, 255, 255, 1);
}

.play-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
  box-shadow: 0 4px 20px rgba(255, 114, 66, 0.3);
}
</style>

