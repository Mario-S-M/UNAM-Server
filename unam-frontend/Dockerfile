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

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy package files
COPY package*.json ./

# Configure npm for legacy peer deps
RUN npm config set legacy-peer-deps true

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force
# Install typescript to support next.config.ts in production
RUN npm install typescript --save-dev

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
    echo '    .listen(port, hostname, () => {' >> server.js && \
    echo '      console.log(`> Ready on http://${hostname}:${port}`);' >> server.js && \
    echo '      if (process.send) process.send("ready");' >> server.js && \
    echo '    });' >> server.js && \
    echo '});' >> server.js

# Create logs directory and set permissions
RUN mkdir -p /app/logs/frontend && \
    chown -R node:node /app

USER node

EXPOSE 3001

# Use PM2 to start the application
CMD ["pm2-runtime", "start", "ecosystem.config.js"]