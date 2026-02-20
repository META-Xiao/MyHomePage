# 部署指南

## 目录

- [GitHub Actions 自动部署](#github-actions-自动部署)
- [服务器部署](#服务器部署)
- [环境变量配置](#环境变量配置)
- [故障排查](#故障排查)

## GitHub Actions 自动部署

### 1. 配置 Docker Hub

#### 创建 Docker Hub 账号
访问 https://hub.docker.com/ 注册账号

#### 创建 Access Token
1. 登录 Docker Hub
2. 点击右上角头像 → Account Settings
3. 选择 Security → New Access Token
4. 输入描述（如：GitHub Actions）
5. 复制生成的 Token（只显示一次）

### 2. 配置 GitHub Secrets

在 GitHub 仓库中：

1. 进入 Settings → Secrets and variables → Actions
2. 点击 New repository secret
3. 添加以下 Secrets：

| Name | Value |
|------|-------|
| `DOCKER_USERNAME` | 你的 Docker Hub 用户名 |
| `DOCKER_PASSWORD` | 你的 Docker Hub Access Token |

### 3. 触发构建

每次推送到 `main` 分支时，GitHub Actions 会自动：

1. 检出代码
2. 构建 Docker 镜像
3. 推送到 Docker Hub (`metaxiao/homepage:latest`)

查看构建状态：
- 进入仓库的 Actions 标签页
- 查看最新的 workflow 运行状态

## 服务器部署

### 首次部署

#### 1. 准备服务器环境

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 安装 Docker Compose
sudo apt install docker-compose-plugin

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### 2. 克隆项目

```bash
cd /opt/mxspace
git clone https://github.com/META-Xiao/MyHomePage.git homepage
cd homepage
```

#### 3. 配置环境变量

编辑 `docker-compose.yml`，确认环境变量：

```yaml
environment:
  - NODE_ENV=production
  - PORT=8081
  - MX_SPACE_API=https://api.teslongxiao.cn/api/v2
  - MX_SPACE_TOKEN=你的token
  - BLOG_URL=https://blog.teslongxiao.cn
```

#### 4. 启动服务

```bash
# 给脚本执行权限
chmod +x deploy-docker.sh

# 运行部署脚本
./deploy-docker.sh
```

### 更新部署

当 GitHub Actions 构建完成后，在服务器上运行：

```bash
cd /opt/mxspace/homepage

# 方式一：使用脚本（推荐）
./deploy-docker.sh

# 方式二：手动更新
docker compose pull
docker compose up -d
```

### 回滚到旧版本

如果新版本有问题，可以回滚：

```bash
# 查看镜像历史
docker images metaxiao/homepage

# 使用特定版本
docker compose down
docker run -d --name teslongxiao-homepage \
  -p 8081:8081 \
  --network core_mx-space \
  --ip 172.20.0.60 \
  metaxiao/homepage:main-abc1234

# 或修改 docker-compose.yml 中的 image 标签
```

## 环境变量配置

### 必需变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `NODE_ENV` | 运行环境 | `production` |
| `PORT` | 服务端口 | `8081` |
| `MX_SPACE_API` | MX-Space API 地址 | `https://api.teslongxiao.cn/api/v2` |
| `MX_SPACE_TOKEN` | MX-Space API Token | `your_token_here` |
| `BLOG_URL` | 博客地址 | `https://blog.teslongxiao.cn` |

### 可选变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `LOG_LEVEL` | 日志级别 | `info` |
| `TIMEOUT` | 请求超时时间（ms） | `10000` |

## Nginx Proxy Manager 配置

### 添加代理主机

1. 登录 NPM 管理界面（通常是 81 端口）
2. 点击 Proxy Hosts → Add Proxy Host

### 配置详情

**Details 标签页：**
- Domain Names: `www.teslongxiao.cn`
- Scheme: `http`
- Forward Hostname/IP: `172.20.0.60` 或 `teslongxiao-homepage`
- Forward Port: `8081`
- Cache Assets: ✓
- Block Common Exploits: ✓
- Websockets Support: ✓

**SSL 标签页：**
- SSL Certificate: 选择或申请证书
- Force SSL: ✓
- HTTP/2 Support: ✓
- HSTS Enabled: ✓

**Advanced 标签页（可选）：**

```nginx
# 缓存静态资源
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}

# 压缩
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

## 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker compose logs homepage

# 检查容器状态
docker compose ps

# 检查网络
docker network inspect core_mx-space
```

### 镜像拉取失败

```bash
# 手动拉取镜像
docker pull metaxiao/homepage:latest

# 如果网络问题，配置镜像加速
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
EOF
sudo systemctl restart docker
```

### API 请求失败

```bash
# 检查 MX-Space API 是否可访问
curl https://api.teslongxiao.cn/api/v2

# 检查 Token 是否正确
curl -H "Authorization: Bearer your_token" \
  https://api.teslongxiao.cn/api/v2/posts

# 查看容器日志
docker compose logs -f homepage
```

### 端口冲突

```bash
# 检查端口占用
netstat -tlnp | grep 8081

# 修改 docker-compose.yml 中的端口映射
ports:
  - "8082:8081"  # 改为其他端口
```

### IP 地址冲突

```bash
# 查看已占用的 IP
docker network inspect core_mx-space | grep -A 10 "Containers"

# 修改 docker-compose.yml 中的 IP
networks:
  default:
    ipv4_address: 172.20.0.61  # 改为未占用的 IP
```

## 监控和维护

### 查看日志

```bash
# 实时日志
docker compose logs -f homepage

# 最近 100 行
docker compose logs --tail=100 homepage

# 查看特定时间段
docker compose logs --since="2024-01-01T00:00:00" homepage
```

### 资源监控

```bash
# 查看容器资源使用
docker stats teslongxiao-homepage

# 查看磁盘使用
docker system df
```

### 清理旧镜像

```bash
# 清理未使用的镜像
docker image prune -a

# 清理所有未使用的资源
docker system prune -a
```

### 备份和恢复

```bash
# 导出镜像
docker save metaxiao/homepage:latest -o homepage-backup.tar

# 导入镜像
docker load -i homepage-backup.tar
```

## 性能优化

### 1. 启用 HTTP/2

在 NPM 中启用 HTTP/2 Support

### 2. 配置缓存

在 NPM Advanced 配置中添加缓存规则

### 3. 启用 Gzip 压缩

在 NPM Advanced 配置中启用 gzip

### 4. CDN 加速

将静态资源上传到 CDN（如阿里云 OSS、腾讯云 COS）

## 安全建议

### 1. 定期更新

```bash
# 更新系统
sudo apt update && sudo apt upgrade

# 更新 Docker
sudo apt install docker-ce docker-ce-cli containerd.io

# 更新镜像
docker compose pull
docker compose up -d
```

### 2. 限制访问

```bash
# 配置防火墙
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 8081/tcp  # 不直接暴露应用端口
sudo ufw enable
```

### 3. 使用 HTTPS

在 NPM 中配置 SSL 证书，强制使用 HTTPS

### 4. 定期备份

```bash
# 备份配置文件
tar -czf homepage-config-$(date +%Y%m%d).tar.gz docker-compose.yml

# 备份镜像
docker save metaxiao/homepage:latest -o homepage-$(date +%Y%m%d).tar
```

## 常用命令速查

```bash
# 启动服务
docker compose up -d

# 停止服务
docker compose down

# 重启服务
docker compose restart

# 查看日志
docker compose logs -f homepage

# 更新服务
docker compose pull && docker compose up -d

# 进入容器
docker exec -it teslongxiao-homepage sh

# 查看容器状态
docker compose ps

# 查看资源使用
docker stats teslongxiao-homepage

# 清理旧镜像
docker image prune -a
```

---

如有问题，请提交 Issue 或联系维护者。

