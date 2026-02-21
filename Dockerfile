# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install --production

# Install frontend dependencies and build
WORKDIR /app/frontend
RUN npm install
COPY frontend/ ./
RUN npm run build

# Copy backend source
WORKDIR /app/backend
COPY backend/ ./

# Production stage
FROM node:20-alpine

RUN apk add --no-cache wget

WORKDIR /app

# Copy backend with node_modules
COPY --from=builder /app/backend /app/backend

# Copy frontend build
COPY --from=builder /app/frontend/dist /app/frontend/dist

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=8081

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8081/health || exit 1

CMD ["node", "server.js"]
