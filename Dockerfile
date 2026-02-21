# ============================================
# 阶段一：构建环境 (Builder)
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# 安装依赖
RUN cd frontend && npm install
RUN cd backend && npm install --omit=dev

# 复制源代码
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# 编译 Vue
RUN cd frontend && npm run build

# ============================================
# 阶段二：生产环境 (Runner)
# ============================================
FROM node:20-alpine

# 安装 wget 用于健康检查
RUN apk add --no-cache wget

WORKDIR /app

# 环境变量
ENV NODE_ENV=production
ENV PORT=8081

# 复制后端代码和依赖
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/*.js ./backend/

# 复制前端构建产物
COPY --from=builder /app/frontend/dist ./frontend/dist

# 设置工作目录到 backend
WORKDIR /app/backend

# 暴露端口 8081
EXPOSE 8081

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8081/health || exit 1

# 启动命令
CMD ["node", "server.js"]
