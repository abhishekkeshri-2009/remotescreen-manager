# RemoteScreen Manager

RemoteScreen Manager is a Server Driven UI (SDUI) SaaS platform that lets startups create, edit, reorder, and publish mobile app screen layouts. Mobile apps fetch published layouts via an SDK endpoint.

## Local run (Docker)

Prereqs: Docker Desktop

```bash
cd RemoteScreenManager
docker-compose up --build
```

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- Postgres: `localhost:5432` (user/pass/db: `rsm`/`rsm`/`rsm`)

## API quickstart

1) Register (creates a company + first user)

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H 'content-type: application/json' \
  -d '{"companyName":"Acme","email":"admin@acme.com","password":"password123"}'
```

2) Login (get JWT)

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"admin@acme.com","password":"password123"}'
```

3) Create an app (use `Authorization: Bearer <token>`)

4) Create a screen and publish it

5) Fetch from mobile via SDK endpoint

- `GET /sdk/screen/{screen_name}?app_id=...`
- Requires header `x-api-key: <company_api_key>`

## Project structure

- `backend/`: NestJS + Prisma + PostgreSQL
- `frontend/`: React + TypeScript + Tailwind dashboard

