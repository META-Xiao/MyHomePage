# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy backend source and install dependencies
COPY backend/ ./backend/
WORKDIR /app/backend
RUN npm install --production

# Copy frontend source and build
COPY frontend/ /app/frontend/
WORKDIR /app/frontend
RUN npm install && npm run build

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
