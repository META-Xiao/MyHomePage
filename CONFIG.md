# Logos Homepage 配置指南

## 快速开始

### 1. 修改个人信息

编辑以下文件来自定义你的主页：

#### `docker-compose.yml` - 环境变量配置

```yaml
environment:
  - MX_SPACE_API=https://your-api-domain.com/api/v2  # 你的 MX-Space API 地址
  - MX_SPACE_TOKEN=your_token_here                    # 你的 MX-Space API Token
  - BLOG_URL=https://your-blog-domain.com             # 你的博客地址
```

#### `frontend/src/components/HeroSection.vue` - 首页标题

```javascript
// 修改签名
<span class="signature">your-domain.com の デジタル空間</span>
```

#### `frontend/src/components/AboutSection.vue` - 关于我

```javascript
// 修改头像
src="https://api.dicebear.com/7.x/avataaars/svg?seed=YourName"

// 修改介绍文字
你好！我是 <span class="text-accent font-medium">YourName</span>
```

#### `frontend/src/components/ProjectsSection.vue` - 我会在哪儿

```javascript
const mainLink = {
  title: '我的博客',
  link: 'https://your-blog.com',  // 修改为你的博客地址
}

const secondaryLinks = [
  {
    title: 'GitHub',
    link: 'https://github.com/yourusername',  // 修改为你的 GitHub
  },
  {
    title: '服务器监控',
    link: 'https://your-status.com',  // 修改为你的监控地址
  },
  // ... 其他链接
]
```

#### `frontend/src/components/ContactSection.vue` - 联系方式

```javascript
const contacts = [
  {
    icon: 'ri:github-fill',
    title: 'GitHub',
    value: '@yourusername',
    link: 'https://github.com/yourusername'
  },
  {
    icon: 'ri:mail-line',
    title: 'Email',
    value: 'your@email.com',
    link: 'mailto:your@email.com'
  },
  // ... 其他联系方式
]
```

#### `frontend/src/components/FooterSection.vue` - 页脚

```vue
<h3 class="text-2xl font-light tracking-[0.2em] mb-4">
  YourName の 数字空间  <!-- 修改为你的名字 -->
</h3>

<div class="footer-links flex justify-center gap-6 mb-4 text-sm opacity-50">
  <a href="https://your-blog.com" target="_blank">博客</a>
  <a href="https://your-status.com" target="_blank">监控</a>
  <a href="https://github.com/yourusername" target="_blank">GitHub</a>
</div>
```

### 2. 获取 MX-Space API Token

1. 登录你的 MX-Space 后台
2. 进入设置 → API Keys
3. 生成新的 API Token
4. 复制 Token 并填入 `docker-compose.yml`

### 3. 配置网络

如果你的 MX-Space 使用不同的 Docker 网络：

编辑 `docker-compose.yml`：

```yaml
networks:
  mx-net:
    external: true
    name: your-network-name  # 修改为你的网络名称
```

修改 IP 地址（避免冲突）：

```yaml
networks:
  mx-net:
    ipv4_address: 172.20.0.XX  # 修改为未占用的 IP
```

### 4. 自定义样式

#### 修改配色

编辑 `frontend/index.html`，找到 CSS 变量：

```css
:root {
  --accent: #00ff87;           /* 主色调 */
  --accent-secondary: #60efff; /* 辅助色 */
  --bg-dark: #0d1117;          /* 背景色 */
}
```

#### 修改字体

在 `frontend/index.html` 中修改 Google Fonts 引入：

```html
<link href="https://fonts.googleapis.com/css2?family=Your-Font&display=swap" rel="stylesheet">
```

### 5. 部署

#### 使用 Docker Hub（推荐）

1. Fork 本项目
2. 修改 `.github/workflows/docker-build.yml` 中的镜像名称
3. 配置 GitHub Secrets（DOCKER_USERNAME 和 DOCKER_PASSWORD）
4. 推送代码，自动构建镜像
5. 在服务器上运行 `./deploy-docker.sh`

#### 本地构建

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

## 常见问题

### Q: 如何修改端口？

编辑 `docker-compose.yml`：

```yaml
ports:
  - "8082:8081"  # 改为其他端口
```

### Q: 如何使用自己的域名？

1. 在 Nginx Proxy Manager 中配置反向代理
2. 指向容器 IP 和端口 8081
3. 配置 SSL 证书

### Q: 友链不显示？

检查：
1. MX-Space API Token 是否正确
2. MX-Space 后台是否添加了友链
3. 查看容器日志：`docker compose logs -f homepage`

### Q: 文章不显示？

检查：
1. MX-Space API 地址是否正确
2. 网络是否连通
3. 查看浏览器控制台错误

## 技术支持

- 提交 Issue：https://github.com/META-Xiao/MyHomePage/issues
- 查看文档：[DEPLOY.md](./DEPLOY.md)

## 许可证

MIT License - 可自由使用和修改

