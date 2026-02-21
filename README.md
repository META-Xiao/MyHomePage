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

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/META-Xiao/MyHomePage.git
cd MyHomePage
```

### 2. 配置个人信息

查看 [配置指南 (CONFIG.md)](./CONFIG.md) 了解如何自定义：
- 个人信息（名字、头像、介绍）
- MX-Space API 配置
- 社交链接
- 配色和样式

### 3. 部署

查看 [部署文档 (DEPLOY.md)](./DEPLOY.md) 了解详细部署步骤。

**快速部署：**

```bash
# 修改 docker-compose.yml 中的环境变量
# 然后运行
./deploy-docker.sh
```

## 文档

- [配置指南 (CONFIG.md)](./CONFIG.md) - 如何自定义你的主页
- [部署文档 (DEPLOY.md)](./DEPLOY.md) - 详细的部署步骤
- [README.md](./README.md) - 项目说明（本文件）

## 重要说明

### 网络配置（已修正）

**网络名称**: `core_mx-space`（不是 `mxspace-network`）

**IP 地址**: `172.20.0.60`（避免与 MongoDB 的 172.20.0.30 冲突）

### 访问地址

**请注意**：`172.20.0.60` 是 Docker 内部网络 IP，外部无法直接访问！

正确的访问方式：

1. **本地测试**: `http://localhost:8081`
2. **VPS 公网**: `http://<你的VPS公网IP>:8081` (需要防火墙放行 8081 端口)
3. **域名访问**: 通过 Nginx Proxy Manager 配置反向代理

### 相关链接

- **个人主页**: https://www.teslongxiao.cn
- **博客**: https://blog.teslongxiao.cn
- **监控**: https://status.teslongxiao.cn
- **GitHub**: https://github.com/META-Xiao

## 设计理念

- **反主流美学** - 拒绝千篇一律的 SaaS 模板
- **不对称布局** - 避免完美居中，追求自然感
- **噪点纹理** - 背景有温度，不是纯平色
- **口语化文案** - 像朋友聊天，不装逼
- **弹性动画** - 避免线性动画，使用 cubic-bezier
- **个性配色** - 青色 (#00ff87) + 蓝绿 (#60efff)，拒绝紫色

## 技术栈

### 前端
- **Vue 3** - CDN 引入，单文件应用
- **DaisyUI** - Tailwind CSS 组件库
- **Glass UI** - 玻璃态设计
- **Iconify** - 图标系统
- **Space Grotesk** - 个性化字体

### 后端
- **Node.js 20 Alpine** - 轻量级运行时
- **Express** - Web 框架
- **MX-Space API** - 博客数据源 (172.20.0.10:2333)

### 部署
- **Docker** - 容器化
- **Docker Compose** - 一键启动
- **端口 8081** - 服务端口
- **网络**: core_mx-space

## 项目结构

```
/opt/mxspace/homepage/
├── backend/
│   ├── server.js        # Node.js 后端 API
│   ├── package.json     # 后端依赖
│   └── .env            # 环境变量
├── frontend/
│   └── index.html      # Vue 3 单页面应用
├── Dockerfile          # Docker 镜像定义
├── docker-compose.yml  # Docker Compose 配置
├── deploy.sh          # 一键部署脚本
└── README.md          # 项目说明
```

## 部署方式

### 方式一：使用 Docker Hub 镜像（推荐）

项目已配置 GitHub Actions，每次推送到 main 分支会自动构建并推送镜像到 Docker Hub。

#### 1. 配置 GitHub Secrets

在 GitHub 仓库设置中添加：
- `DOCKER_USERNAME`: 你的 Docker Hub 用户名
- `DOCKER_PASSWORD`: 你的 Docker Hub 密码或 Access Token

#### 2. 服务器部署

```bash
cd /opt/mxspace/homepage

# 拉取最新镜像并启动
./deploy-docker.sh

# 或手动执行
docker compose pull
docker compose up -d
```

#### 3. 自动更新

每次推送代码到 GitHub，GitHub Actions 会自动构建新镜像。在服务器上运行：

```bash
cd /opt/mxspace/homepage
docker compose pull && docker compose up -d
```

### 方式二：本地构建（开发测试）

```bash
cd /opt/mxspace/homepage

# 使用开发配置文件
docker compose -f docker-compose.dev.yml up -d --build
```

### 验证部署

```bash
# 检查容器状态
docker compose ps

# 测试健康检查
curl http://localhost:8081/health

# 查看日志
docker compose logs -f homepage
```

## 访问配置

### 本地测试

```bash
curl http://localhost:8081
```

### VPS 公网访问

1. 确保防火墙放行 8081 端口
2. 访问 `http://<你的VPS公网IP>:8081`

### Nginx Proxy Manager 配置

在 NPM 后台（81 端口）添加代理：

1. **Domain Names**: `homepage.teslongxiao.cn` 或 `www.teslongxiao.cn`
2. **Scheme**: `http`
3. **Forward Hostname/IP**: `172.20.0.60` 或 `teslongxiao-homepage`
4. **Forward Port**: `8081`
5. **Cache Assets**: 开启
6. **Block Common Exploits**: 开启
7. **Websockets Support**: 开启

## API 端点

| 端点 | 说明 |
|------|------|
| `GET /health` | 健康检查 |
| `GET /api/posts` | 文章列表 |
| `GET /api/posts/latest` | 最新文章 |
| `GET /api/posts/:id` | 文章详情 |
| `GET /api/categories` | 分类列表 |
| `GET /api/links` | 友链列表 |
| `GET /api/stats` | 站点统计 |
| `GET /api/says` | 说说列表 |
| `GET /api/recently` | 最近动态 |

## 服务器架构

```
域名: teslongxiao.cn
网络: core_mx-space (172.20.0.0/16)

├── 172.20.0.10:2333  -> MX-Space 博客后台
├── 172.20.0.20:2323  -> Shiro 博客前端
├── 172.20.0.30:27017 -> MongoDB 数据库
├── 172.20.0.50:80    -> 哪吒监控
└── 172.20.0.60:8081  -> Homepage (本项目)
```

## 常用命令

```bash
# 启动
docker compose up -d

# 停止
docker compose down

# 重启
docker compose restart

# 查看日志
docker compose logs -f homepage

# 查看容器 IP
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' teslongxiao-homepage

# 进入容器
docker exec -it teslongxiao-homepage sh

# 重新构建
docker compose build --no-cache
docker compose up -d
```

## 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker compose logs homepage

# 检查网络
docker network inspect core_mx-space

# 检查端口占用
netstat -tlnp | grep 8081
```

### IP 地址冲突

如果提示 `address already in use`：

```bash
# 查看已占用的 IP
docker network inspect core_mx-space | grep -A 10 "Containers"

# 修改 docker-compose.yml 中的 ipv4_address
# 选择一个未被占用的 IP，如 172.20.0.61
```

### 网络不存在

如果提示 `network core_mx-space not found`：

```bash
# 检查实际的网络名称
docker network ls

# 如果网络名称不同，修改 docker-compose.yml 中的 name
```

### 无法访问

1. 检查容器是否运行：`docker ps | grep homepage`
2. 检查健康检查：`curl http://localhost:8081/health`
3. 检查防火墙：`ufw status` 或 `iptables -L`
4. 检查 NPM 配置是否正确

## 设计特色

### 1. 星轨背景
- 参考 xcnya.cn 实现
- 200+ 闪烁星星
- 流星效果
- Canvas 动画优化

### 2. 不对称布局
- 1.2fr + 0.8fr 网格
- 卡片轻微倾斜 (±1deg)
- 避免完美居中

### 3. 玻璃态设计
- 半透明背景
- 模糊效果 (backdrop-filter)
- 细微边框
- 柔和阴影

### 4. 口语化文案
- "写代码，搞服务器"
- "还在继续写"
- "感谢支持"
- "内容挺杂"

### 5. 个性配色
- 主色: #00ff87 (青色)
- 辅色: #60efff (蓝绿)
- 强调: #ff6b6b (红色)
- 背景: #0d1117 (深灰)

## 许可证

MIT License

## 致谢

- [MX-Space](https://mx-space.js.org/) - 博客系统
- [Vue.js](https://vuejs.org/) - 前端框架
- [DaisyUI](https://daisyui.com/) - UI 组件库
- [xcnya.cn](https://www.xcnya.cn/) - 设计灵感

---

Made with Love by TesLongXiao

  shiro:
    image: innei/shiro:latest
    container_name: shiro
    restart: unless-stopped
    ports:
      - "2323:2323"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.teslongxiao.cn/api/v2
      - NEXT_PUBLIC_GATEWAY_URL=https://api.teslongxiao.cn
      - API_URL=http://172.20.0.10:2333/api/v2
      - NODE_OPTIONS=--max-old-space-size=512
    networks:
      mx-space:
        ipv4_address: 172.20.0.20  