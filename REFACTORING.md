# Backend Refactoring Summary

## Changes Made

### 1. Removed Luogu Integration
- Deleted `backend/services/luoguCache.js`
- Removed all Luogu-related environment variables from docker-compose files
- Updated README to remove Luogu configuration instructions

### 2. Migrated to TypeScript
- Created TypeScript configuration (`tsconfig.json`)
- Converted all services to TypeScript:
  - `blogService.ts` - Blog activity from MX-Space API
  - `githubService.ts` - GitHub contributions via GraphQL API
  - `codeforcesService.ts` - Codeforces submissions via public API
  - `atcoderService.ts` - AtCoder submissions via kenkoooo API
  - `nowcoderService.ts` - Nowcoder submissions via web scraping (with cache)
  - `heatmapService.ts` - Aggregates data from all sources
  - `server.ts` - Main Express server

### 3. Simplified Logging
- Changed all logs to English
- Reduced verbosity (only warnings for errors)
- Removed debug logs unless necessary
- Format: `Platform: X active days`

### 4. Code Cleanup
- Removed unnecessary debug statements
- Simplified error handling
- Removed redundant code
- Consistent code style across all services

### 5. Updated Dependencies
Added TypeScript dependencies:
- `typescript`
- `ts-node`
- `@types/express`
- `@types/cors`
- `@types/node`

Removed:
- `https-proxy-agent` (no longer needed without Luogu)

## Data Sources

1. **Blog** - MX-Space API (weighted: 5 for new post, 2 for update)
2. **GitHub** - GraphQL API (weighted: 1 per contribution)
3. **Codeforces** - Public API (weighted: 2 per submission)
4. **Nowcoder** - Web scraping with 12-hour cache (weighted: 2 per AC)
5. **AtCoder** - kenkoooo API (weighted: 2 per submission)

## Build & Run

### Development
```bash
cd backend
npm install
npm run dev
```

### Production (Docker)
```bash
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d
```

## Environment Variables

Required:
- `MX_SPACE_API`
- `MX_SPACE_TOKEN`
- `BLOG_URL`
- `GITHUB_TOKEN`
- `GITHUB_USERNAME`

Optional:
- `CODEFORCES_HANDLE`
- `NOWCODER_USER_ID`
- `ATCODER_USERNAME`

## API Endpoints

- `GET /api/heatmap?year=2026` - Get heatmap data
- `GET /api/posts` - Get blog posts
- `GET /api/links` - Get friend links
- `GET /health` - Health check

