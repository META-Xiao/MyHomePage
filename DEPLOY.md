# 部署指南

## 环境要求

- Docker 20.10+
- Docker Compose 2.0+
- 网络访问 MX-Space API (172.20.0.10:2333)

## 快速部署

### 方式一：使用部署脚本（推荐）

```bash
cd /opt/mxspace/homepage
./deploy.sh
```

部署脚本会自动：
1. 检查 Docker 环境
2. 创建 Docker 网络
3. 构建镜像
4. 启动服务
5. 检查服务状态

### 方式二：手动部署

```bash
# 1. 创建 Docker 网络（如果不存在）
docker network create mxspace-network

# 2. 构建镜像
docker-compose build

# 3. 启动服务
docker-compose up -d

# 4. 查看日志
docker-compose logs -f homepage
```

## 配置说明

### 环境变量

编辑 `backend/.env` 文件：

```env
NODE_ENV=production
PORT=8081
MX_SPACE_API=http://172.20.0.10:2333
BLOG_URL=https://teslongxiao.cn
```

### Docker Compose 配置

`docker-compose.yml` 主要配置：

- **端口映射**: 8081:8081
- **网络**: mxspace-network
- **健康检查**: 每30秒检查一次
- **日志**: 最多保留3个文件，每个10MB

## 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f homepage

# 查看服务状态
docker-compose ps

# 进入容器
docker exec -it teslongxiao-homepage sh

# 重新构建
docker-compose build --no-cache
docker-compose up -d
```

## 验证部署

### 1. 检查容器状态

```bash
docker ps | grep teslongxiao-homepage
```

### 2. 测试健康检查

```bash
curl http://localhost:8081/health
```

预期输出：
```json
{
  "status": "ok",
  "timestamp": "2024-02-08T15:30:00.000Z",
  "mxSpaceApi": "http://172.20.0.10:2333"
}
```

### 3. 测试 API

```bash
# 获取文章列表
curl http://localhost:8081/api/posts

# 获取最新文章
curl http://localhost:8081/api/posts/latest

# 获取站点统计
curl http://localhost:8081/api/stats
```

### 4. 访问前端

浏览器访问: http://your-server-ip:8081

## Nginx 反向代理

如果需要通过域名访问，配置 Nginx：

```nginx
server {
    listen 80;
    server_name homepage.teslongxiao.cn;

    location / {
        proxy_pass http://172.20.0.30:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/homepage /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker-compose logs homepage

# 检查端口占用
netstat -tlnp | grep 8081

# 检查网络
docker network ls | grep mxspace-network
```

### 无法连接 MX-Space API

```bash
# 进入容器测试
docker exec -it teslongxiao-homepage sh
wget -O- http://172.20.0.10:2333/api/v2

# 检查网络连通性
docker exec -it teslongxiao-homepage ping 172.20.0.10
```

### 前端页面无法加载

```bash
# 检查前端文件是否存在
docker exec -it teslongxiao-homepage ls -la /app/frontend

# 检查后端日志
docker-compose logs -f homepage
```

## 更新部署

```bash
# 1. 停止服务
docker-compose down

# 2. 拉取最新代码（如果使用 Git）
git pull

# 3. 重新构建
docker-compose build --no-cache

# 4. 启动服务
docker-compose up -d

# 5. 验证
curl http://localhost:8081/health
```

## 备份和恢复

### 备份

```bash
# 备份整个项目
tar -czf homepage-backup-$(date +%Y%m%d).tar.gz /opt/mxspace/homepage

# 备份配置
cp backend/.env backend/.env.backup
```

### 恢复

```bash
# 解压备份
tar -xzf homepage-backup-20240208.tar.gz -C /opt/mxspace/

# 恢复配置
cp backend/.env.backup backend/.env

# 重新部署
cd /opt/mxspace/homepage
docker-compose up -d
```

## 监控

### 查看资源使用

```bash
docker stats teslongxiao-homepage
```

### 查看容器信息

```bash
docker inspect teslongxiao-homepage
```

### 查看网络信息

```bash
docker network inspect mxspace-network
```

## 安全建议

1. 定期更新基础镜像
2. 使用环境变量管理敏感信息
3. 限制容器资源使用
4. 配置防火墙规则
5. 启用 HTTPS（使用 Let's Encrypt）

---

如有问题，请查看 README.md 或提交 Issue。
