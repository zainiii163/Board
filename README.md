# BoardNotes Monorepo

This repository is split into separate workspaces for the frontend app, backend API, shared contracts, and product docs.

## Structure

- `frontend/` - Next.js 16 app
- `backend/` - Express + TypeScript API
- `shared/` - shared domain/types package
- `docs/` - project requirements and product documents

## Local PostgreSQL setup

1. Install PostgreSQL locally and create a database named `boardnotes`.
2. Create a local user with access to that database, or use the default example credentials below.
3. Copy the sample environment file:

```bash
cp backend/.env.example backend/.env
```

4. Update `backend/.env` if your local PostgreSQL credentials differ.

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/boardnotes
```

## Database migrations and seed

From the repository root:

```bash
npm install
```

Then in the backend workspace:

```bash
cd backend
npm run db:migrate
```

Manual seed (optional — startup auto-seeds when empty):

```bash
npx tsx src/db/seed.ts
```

If you are using a local PostgreSQL instance with the default credentials above, the demo content will be inserted into the `boards`, `classes`, `subjects`, `chapters`, `exercises`, `questions`, and `solution_steps` tables.

When PostgreSQL is connected, **admin CMS edits persist across restarts** (boards, chapters, authors, MCQs, legal pages, etc.). Without `DATABASE_URL` or if the DB is unreachable, the API falls back to in-memory demo data that resets on restart.

Auto-seed runs on backend startup when tables are empty — no manual `seed.ts` required for normal dev.

## Running the app

From the repo root:

```bash
npm run dev:backend
npm run dev:frontend
```

The api runs on `http://localhost:4000` and the frontend on `http://localhost:3000`.

## Demo accounts

After starting the backend, these accounts are available (memory store or DB):

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@boardnotes.com | admin123 |
| Editor | editor@boardnotes.com | editor123 |
| Student | student@boardnotes.com | student123 |

- **Student:** `/account` — bookmarks, continue reading
- **Admin/Editor:** `/admin` — dashboard, reports, users, contact messages

Set `JWT_SECRET` in `backend/.env` for production.

## Production deployment

### Environment variables

| Where | Variable | Purpose |
|-------|----------|---------|
| Backend | `DATABASE_URL` | PostgreSQL connection string |
| Backend | `JWT_SECRET` | Long random secret for auth tokens |
| Backend | `CORS_ORIGINS` | Comma-separated frontend URLs (e.g. `https://boardnotes.com`) |
| Backend | `PUBLIC_API_URL` | Optional public API URL for absolute PDF links |
| Backend | `PUBLIC_SITE_URL` | Frontend URL for classroom email links (default `http://localhost:3000`) |
| Backend | `R2_*` | Optional Cloudflare R2 (`R2_BUCKET`, `R2_ACCESS_KEY`, `R2_SECRET_KEY`, `R2_ENDPOINT`, optional `R2_PUBLIC_URL`) |
| Backend | `SMTP_*` / `NOTIFY_EMAIL` | Optional email for contact, reports, and classroom “new notes” updates |
| Frontend | `NEXT_PUBLIC_API_URL` | Backend URL (e.g. `https://api.boardnotes.com`) |
| Frontend | `NEXT_PUBLIC_SITE_URL` | Public site URL for sitemap/robots |

Copy examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### Recommended layout

| Service | Suggestion |
|---------|------------|
| Frontend | Vercel (Next.js) |
| Backend | Railway, Render, Fly.io, or a VPS |
| Database | Managed PostgreSQL (Neon, Supabase, RDS) |
| PDF files | Local disk by default; optional Cloudflare R2 via `R2_*` env vars |

### Deploy steps

1. **PostgreSQL** — create a database and set `DATABASE_URL`.
2. **Backend** — build and run:
   ```bash
   cd backend
   npm install
   npm run build
   npm run db:migrate
   npm start
   ```
   On first boot the API auto-seeds empty tables. Demo users: `admin@boardnotes.com` / `admin123` (change passwords in production).
3. **Frontend** — set env vars in your host, then:
   ```bash
   cd frontend
   npm install
   npm run build
   npm start
   ```
4. **CORS** — set `CORS_ORIGINS` on the backend to your frontend URL(s).
5. **Uploads** — PDFs go to `backend/public/uploads/` locally, or to **Cloudflare R2** when `R2_BUCKET`, `R2_ACCESS_KEY`, `R2_SECRET_KEY`, and `R2_ENDPOINT` are set. Optionally set `R2_PUBLIC_URL` for direct CDN links, or rely on `PUBLIC_API_URL/uploads/...` proxying from R2.

### Health check

- Backend: `GET /api/health` → `{ "status": "ok" }`

The main demo flow is:

- `GET /api/boards`
- `GET /api/boards/:slug`
- `GET /api/boards/:slug/classes/:classSlug`
- `GET /api/boards/:slug/classes/:classSlug/subjects/:subject`
- `GET /api/boards/:slug/classes/:classSlug/subjects/:subject/chapters/:chapter`
- `GET /api/boards/:slug/classes/:classSlug/subjects/:subject/chapters/:chapter/exercises/:exercise`
- `GET /api/boards/:slug/classes/:classSlug/subjects/:subject/chapters/:chapter/exercises/:exercise/q/:questionNum`

The backend gracefully falls back to the bundled demo content when the database is unavailable, and it uses PostgreSQL whenever `DATABASE_URL` is configured.
