# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Build frontend
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
COPY frontend/ ./
RUN npm run build

# Production stage
FROM node:20-slim

RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

# Copy and install backend dependencies
COPY backend/package*.json ./
RUN corepack enable && yarn install --production
RUN test -f node_modules/express/package.json || (echo "Express installation failed!" && exit 1)

# Copy backend source
COPY backend/*.js ./

# Copy frontend build
COPY --from=builder /app/frontend/dist /app/frontend/dist

ENV NODE_ENV=production
ENV PORT=8081

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8081/health || exit 1

CMD ["node", "server.js"]
