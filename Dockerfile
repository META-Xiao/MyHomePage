# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 使用淘宝镜像加速
RUN npm config set registry https://registry.npmmirror.com

# 复制 package.json 并安装后端依赖
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production

# 复制 package.json 并安装前端依赖
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci

# 复制源代码
COPY backend/ /app/backend/
COPY frontend/ /app/frontend/

# 构建前端
WORKDIR /app/frontend
RUN npm run build

# 生产阶段
FROM node:20-alpine

# 安装 wget
RUN apk add --no-cache wget

WORKDIR /app

# 使用淘宝镜像加速（生产阶段也需要）
RUN npm config set registry https://registry.npmmirror.com

# 先复制 package.json
COPY backend/package*.json ./backend/

# 安装生产依赖
WORKDIR /app/backend
RUN npm ci --only=production

# 复制后端源代码
COPY --from=builder /app/backend/*.js ./
COPY --from=builder /app/backend/*.json ./

# 复制前端构建产物
COPY --from=builder /app/frontend/dist /app/frontend/dist

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
