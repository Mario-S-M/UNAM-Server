FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for build time
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_GRAPHQL_ENDPOINT

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/ecosystem.config.js ./

# Create a simple server.js for Next.js
RUN echo 'const { createServer } = require("http");' > server.js && \
    echo 'const { parse } = require("url");' >> server.js && \
    echo 'const next = require("next");' >> server.js && \
    echo '' >> server.js && \
    echo 'const dev = process.env.NODE_ENV !== "production";' >> server.js && \
    echo 'const hostname = "0.0.0.0";' >> server.js && \
    echo 'const port = process.env.PORT || 3000;' >> server.js && \
    echo '' >> server.js && \
    echo 'const app = next({ dev, hostname, port });' >> server.js && \
    echo 'const handle = app.getRequestHandler();' >> server.js && \
    echo '' >> server.js && \
    echo 'app.prepare().then(() => {' >> server.js && \
    echo '  createServer(async (req, res) => {' >> server.js && \
    echo '    try {' >> server.js && \
    echo '      const parsedUrl = parse(req.url, true);' >> server.js && \
    echo '      await handle(req, res, parsedUrl);' >> server.js && \
    echo '    } catch (err) {' >> server.js && \
    echo '      console.error("Error occurred handling", req.url, err);' >> server.js && \
    echo '      res.statusCode = 500;' >> server.js && \
    echo '      res.end("internal server error");' >> server.js && \
    echo '    }' >> server.js && \
    echo '  })' >> server.js && \
    echo '    .once("error", (err) => {' >> server.js && \
    echo '      console.error(err);' >> server.js && \
    echo '      process.exit(1);' >> server.js && \
    echo '    })' >> server.js && \
    echo '    .listen(port, () => {' >> server.js && \
    echo '      console.log(`> Ready on http://${hostname}:${port}`);' >> server.js && \
    echo '    });' >> server.js && \
    echo '});' >> server.js

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Create logs directory
RUN mkdir -p /app/logs/frontend

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3001

# Use PM2 to start the application
CMD ["pm2-runtime", "start", "ecosystem.config.js"]