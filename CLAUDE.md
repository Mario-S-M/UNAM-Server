# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for an educational platform with two main applications:
- **`unam-frontend/`** — Next.js 15 + React 19 frontend (port 3001)
- **`UNAM-escuela-backend/`** — NestJS 11 + Apollo GraphQL backend (port 3000)
- **`nginx/`** — Reverse proxy with SSL for production domain `eskani.enesmorelia.unam.mx`

## Development Commands

### Full Stack (Docker)
```bash
docker compose up --build -d        # Start all services
docker compose down                 # Stop all services
docker compose down -v && docker compose up --build -d  # Clean rebuild
docker compose logs -f [service]    # View logs for a specific service
```

Services: `db`, `pgadmin`, `backend`, `frontend`, `nginx`, `certbot`

### Database Only (for local dev)
```bash
docker compose up -d db pgadmin
```
- PostgreSQL: port 5432
- PgAdmin: http://localhost:5050

### Backend
```bash
cd UNAM-escuela-backend
yarn install
yarn start:dev       # Development with watch mode
yarn build
yarn start:prod
yarn lint
yarn test
yarn test:watch
yarn test:cov
yarn test:e2e
```

### Frontend
```bash
cd unam-frontend
npm install
npm run dev     # Development with Turbopack on port 3001
npm run build
npm run lint
```

## Architecture

```
Browser → Nginx (80/443) → Frontend (3001) [Next.js SSR]
                        → Backend (3000)  [NestJS GraphQL]
                        → PostgreSQL (5432) [via TypeORM]
```

**Frontend** communicates with the backend exclusively via GraphQL (Apollo Client). The frontend build receives the GraphQL endpoint as a build arg:
- Public/client-side: `https://eskani.enesmorelia.unam.mx/graphql`
- Server-side (SSR, internal): `http://backend:3000/graphql`

**Backend** is a NestJS app with Apollo Server and the following domain modules: `auth`, `users`, `contents`, `activities`, `homeworks`, `skills`, `levels`, `forms`, `user-progress`, `uploads`, `lenguages`.

**Nginx** handles TLS termination, routes `/graphql` and `/api` to backend, everything else to frontend. CORS is restricted to `eskani.enesmorelia.unam.mx` and `localhost:*`.

## Environment Setup

Copy `.env.template` to `.env` and fill in values:
```
STATE=dev
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=...
DB_NAME=...
JWT_SECRET=...
```

## Key Conventions

- **No Next.js API routes** — all backend logic lives in the NestJS GraphQL API.
- **Package managers**: frontend uses `npm`, backend uses `yarn`. Do not install packages at the repo root.
- **Validation**: Use Zod throughout (both frontend and backend).
- **UI components**: Use `shadcn/ui` (Radix UI based). Do not introduce custom color schemes or animation libraries.
- **Notifications**: Use `Sonner` for all toast notifications.
- **GraphQL queries**: Request only the fields actually needed.
- **Ports are fixed**: frontend 3001, backend 3000. Do not change these.

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TailwindCSS 4, Apollo Client, React Hook Form, Plate.js (rich text), shadcn/ui |
| Backend | NestJS 11, Apollo Server 4, TypeORM 0.3, Passport JWT, Multer |
| Database | PostgreSQL 14.4 |
| Infrastructure | Docker Compose, Nginx, Let's Encrypt |
| Language | TypeScript 5 (both apps) |
