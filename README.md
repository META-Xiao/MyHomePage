# Logos Homepage

基于 Vue 3 + DaisyUI + Glass UI + Node.js + MX-Space 的个人主页。

一个现代化、可定制的个人主页项目，支持从 MX-Space 博客系统自动同步文章和友链。

## 特性

- ✨ 现代化玻璃态设计
- 🎨 反主流美学，拒绝千篇一律
- 🚀 自动同步 MX-Space 文章和友链
- 🐳 Docker 一键部署
- 🔄 GitHub Actions 自动构建
- 📱 完全响应式设计
- ⚡ 轻量级，性能优异

## 快速部署

### 环境变量配置

#### 必需配置
```bash
MX_SPACE_API=https://your-api.com/api/v2    # MX-Space API 地址
MX_SPACE_TOKEN=your_token_here               # MX-Space Token
BLOG_URL=https://your-blog.com               # 博客地址
GITHUB_TOKEN=your_github_token               # GitHub Token
GITHUB_USERNAME=your_github_username         # GitHub 用户名
```

#### 可选配置（OJ 平台）
```bash
CODEFORCES_HANDLE=your_handle                # Codeforces 用户名
NOWCODER_USER_ID=your_user_id                # 牛客用户ID
ATCODER_USERNAME=your_username               # AtCoder 用户名
```

**提示**: 未配置的 OJ 平台会自动跳过，不影响其他功能。

### 方式一：使用 .env 文件（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/META-Xiao/MyHomePage.git
cd MyHomePage

# 2. 创建 .env 文件
cp .env.example .env
nano .env  # 修改为你的配置

# 3. 启动服务
docker-compose up -d
```

### 方式二：直接部署

在服务器上直接创建配置文件并启动：

```bash
# 1. 创建目录
mkdir -p /opt/homepage
cd /opt/homepage

# 2. 创建 docker-compose.yml
cat > docker-compose.yml << 'EOF'
services:
  homepage:
    image: illyaa/homepage:latest
    container_name: logos-homepage
    restart: unless-stopped
    ports:
      - "8081:8081"
    volumes:
      - ./backend/cache:/app/backend/cache
    environment:
      - NODE_ENV=production
      - PORT=8081
      # 必需配置
      - MX_SPACE_API=https://your-api.com/api/v2
      - MX_SPACE_TOKEN=your_token_here
      - BLOG_URL=https://your-blog.com
      - GITHUB_TOKEN=your_github_token
      - GITHUB_USERNAME=your_github_username
      # 可选配置
      - CODEFORCES_HANDLE=
      - NOWCODER_USER_ID=
      - ATCODER_USERNAME=
      - LUOGU_USER_ID=
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8081/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
EOF

# 3. 修改环境变量（重要！）
nano docker-compose.yml

# 4. 启动服务
docker compose up -d

# 5. 查看日志
docker compose logs -f homepage
```

### 方式三：克隆项目

```bash
git clone https://github.com/META-Xiao/MyHomePage.git
cd MyHomePage
# 修改 docker-compose.yml 中的环境变量
./deploy-docker.sh
```

### 缓存说明

项目使用文件缓存系统（12小时有效期）来存储 OJ 数据：
- 缓存位置：`./backend/cache/`
- 自动持久化：通过 Docker volume 挂载
- 首次启动会全量爬取数据，后续只增量更新

### 自定义配置

查看 [配置指南 (CONFIG.md)](./CONFIG.md) 了解如何自定义：
- 个人信息（名字、头像、介绍）
- MX-Space API 配置
- 社交链接
- 配色和样式

详细部署步骤请查看 [部署文档 (DEPLOY.md)](./DEPLOY.md)

## 文档

- [配置指南 (CONFIG.md)](./CONFIG.md) - 如何自定义你的主页
- [部署文档 (DEPLOY.md)](./DEPLOY.md) - 详细的部署步骤

## 技术栈

### 前端
- Vue 3 + DaisyUI + Glass UI
- Iconify 图标系统
- Canvas 星轨背景

### 后端
- Node.js 20 Alpine
- Express
- MX-Space API 集成

### 部署
- Docker + Docker Compose
- GitHub Actions 自动构建
- 支持 Nginx Proxy Manager


## 项目结构

```
MyHomePage/
├── .github/workflows/    # GitHub Actions
├── backend/             # Node.js 后端
├── frontend/            # Vue 3 前端
├── docker-compose.yml   # 生产环境配置
├── docker-compose.dev.yml # 开发环境配置
├── Dockerfile          # Docker 镜像
├── deploy-docker.sh    # 部署脚本
├── CONFIG.md          # 配置指南
└── DEPLOY.md          # 部署文档
```

## 常用命令

```bash
# 启动服务
docker compose up -d

# 查看日志
docker compose logs -f homepage

# 更新服务
docker compose pull && docker compose up -d

# 停止服务
docker compose down
```

## 演示

- 示例站点：https://www.teslongxiao.cn
- 博客：https://blog.teslongxiao.cn

## 许可证

MIT License

## 致谢

- [MX-Space](https://mx-space.js.org/) - 博客系统
- [Vue.js](https://vuejs.org/) - 前端框架
- [DaisyUI](https://daisyui.com/) - UI 组件库
