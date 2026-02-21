# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 使用淘宝镜像加速
RUN npm config set registry https://registry.npmmirror.com

# 复制 package.json
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# 安装后端依赖
WORKDIR /app/backend
RUN npm install --omit=dev

# 安装前端依赖
WORKDIR /app/frontend
RUN npm install

# 复制源代码
WORKDIR /app
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# 构建前端
WORKDIR /app/frontend
RUN npm run build

# 生产阶段
FROM node:20-alpine

# 安装 wget
RUN apk add --no-cache wget

WORKDIR /app

# 复制后端（包括 node_modules）
COPY --from=builder /app/backend /app/backend

# 复制前端构建产物
COPY --from=builder /app/frontend/dist /app/frontend/dist

# 设置工作目录
WORKDIR /app/backend

# 环境变量
ENV NODE_ENV=production
ENV PORT=8081

# 暴露端口
EXPOSE 8081

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8081/health || exit 1

# 启动
CMD ["node", "server.js"]
