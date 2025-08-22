# syntax=docker/dockerfile:1

# ---- Builder ----
FROM node:18-alpine AS builder
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Install deps first (better cache)
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source
COPY . .

# Build app
RUN npm run build

# ---- Runner ----
FROM node:18-alpine AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000
WORKDIR /app

# Only prod deps if needed by Next server
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Copy built assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

EXPOSE 3000
CMD ["npm", "run", "start"]
