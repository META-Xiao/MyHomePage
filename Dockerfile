# Build stage
FROM node:20-slim AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Build frontend
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN pnpm install
COPY frontend/ ./
RUN pnpm run build

# Production stage
FROM node:20-slim

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

# Copy and install backend dependencies
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
RUN pnpm install

# Copy backend source
COPY backend/*.ts ./
COPY backend/services/ ./services/

# Copy frontend build
COPY --from=builder /app/frontend/dist /app/frontend/dist

ENV NODE_ENV=production
ENV PORT=8081

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8081/health || exit 1

CMD ["pnpm", "start"]
