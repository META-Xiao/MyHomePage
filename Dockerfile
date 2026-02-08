# 使用 Node.js 20 Alpine 作为基础镜像（节省内存）
FROM node:20-alpine

# 安装 wget 用于健康检查
RUN apk add --no-cache wget

# 设置工作目录
WORKDIR /app

# 复制 backend 的 package.json
COPY backend/package*.json ./backend/

# 安装后端依赖
WORKDIR /app/backend
RUN npm install --omit=dev && npm cache clean --force

# 复制后端代码
COPY backend/ ./

# 复制前端代码
WORKDIR /app
COPY frontend/ ./frontend/

# 设置工作目录回到 backend
WORKDIR /app/backend

# 暴露端口 8081
EXPOSE 8081

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8081/health || exit 1

# 启动命令
CMD ["node", "server.js"]
