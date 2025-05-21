FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app

# Install build tools needed for bcrypt
RUN apk add --no-cache make gcc g++ python3

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Install production dependencies and rebuild bcrypt
RUN npm ci --only=production
RUN npm rebuild bcrypt

# Install postgresql-client
RUN apk add --no-cache postgresql-client && \
    apk del make gcc g++ python3

EXPOSE 3000

# Command without additional scripts
CMD npm run start:prod