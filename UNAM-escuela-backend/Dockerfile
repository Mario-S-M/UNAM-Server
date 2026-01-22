FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# Aumentar memoria para el build (8GB)
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN npm run build

FROM node:22-alpine
WORKDIR /app

# Install PM2 globally and required tools
RUN apk add --no-cache postgresql-client wget python3 make g++ && \
    npm install -g pm2

COPY --from=builder /app/package*.json ./
# Install production dependencies and rebuild native modules
RUN npm ci --only=production --legacy-peer-deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/ecosystem.config.js ./

# Create logs directory
RUN mkdir -p /app/logs/backend

EXPOSE 3000

# Use PM2 to start the application
CMD ["pm2-runtime", "start", "ecosystem.config.js"]