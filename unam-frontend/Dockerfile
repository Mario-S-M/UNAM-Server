FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Configure npm for legacy peer deps
RUN npm config set legacy-peer-deps true

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for build time
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_GRAPHQL_ENDPOINT

# Set environment variables for build
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_GRAPHQL_ENDPOINT=$NEXT_PUBLIC_GRAPHQL_ENDPOINT

# Increase memory for build process
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Configure npm for legacy peer deps
RUN npm config set legacy-peer-deps true

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --chown=node:node --from=builder /app/.next ./.next
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/next.config.ts ./

# Create logs directory
RUN mkdir -p /app/logs/frontend && chown node:node /app/logs/frontend

USER node

EXPOSE 3001

# Use Next.js directly to start the application
CMD ["npm", "start"]