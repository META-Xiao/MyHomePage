# 音乐播放器使用说明

## 添加音乐文件

1. 将你的音乐文件（.mp3 格式）放到 `frontend/public/music/` 文件夹中
2. 编辑 `frontend/public/music/playlist.json` 文件，添加歌曲信息

## playlist.json 格式示例

```json
[
  {
    "id": 1,
    "name": "歌曲名称",
    "artist": "艺术家名称",
    "url": "/music/song1.mp3",
    "cover": "/music/cover1.jpg"
  },
  {
    "id": 2,
    "name": "另一首歌",
    "artist": "另一个艺术家",
    "url": "/music/song2.mp3",
    "cover": "/music/cover2.jpg"
  }
]
```

## 字段说明

- `id`: 歌曲唯一标识
- `name`: 歌曲名称
- `artist`: 艺术家名称
- `url`: 音频文件路径（相对于 public 目录）
- `cover`: 封面图片路径（可选，暂未使用）

## 功能特性

- ✅ 音频频谱可视化
- ✅ 播放/暂停控制
- ✅ 进度条显示
- ✅ 自动播放下一首
- ✅ 玻璃态设计风格

## 注意事项

- 音频文件建议使用 MP3 格式
- 文件大小建议不超过 10MB
- 确保音频文件路径正确
- 播放列表会在页面加载时自动加载

