FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# Aumentar memoria para el build (4GB)
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

FROM node:22-alpine
WORKDIR /app

# Install production dependencies and rebuild native modules
RUN apk add --no-cache postgresql-client

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production --legacy-peer-deps

COPY --from=builder /app/dist ./dist

# Create uploads directory and set permissions
RUN mkdir -p /app/uploads && \
    chown -R node:node /app

USER node

EXPOSE 3000

# Start the application directly
CMD ["node", "dist/main"]