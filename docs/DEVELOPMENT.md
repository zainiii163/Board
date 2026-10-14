# Development Guide

Setup, scripts, local infrastructure, and deployment runbook.

---

## 1. Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 20+ | `Dockerfile` uses `node:20-alpine` |
| npm | 10+ | npm workspaces; ships no `packageManager` field |
| Docker / Docker Compose | optional | Only for the local PostgreSQL |
| PostgreSQL | 15 | Optional — the app runs without it |

**No database is required to start.** Without `DATABASE_URL` the backend falls
back to the bundled in-memory demo catalog, and the site is fully browsable.

---

## 2. Install

From the repository root:

```bash
npm install
```

This installs all three workspaces: `frontend`, `backend`, `shared`.

There is no `postinstall` hook and no build step for `shared` — it ships raw
TypeScript.

---

## 3. Run locally

Two terminals, from the repository root:

```bash
npm run dev:backend     # Express on http://localhost:4000
npm run dev:frontend    # Next.js on http://localhost:3000
```

| URL | Purpose |
|---|---|
| http://localhost:3000 | Public site |
| http://localhost:3000/admin | Admin dashboard |
| http://localhost:4000/api/health | API health check |

Verify:

```bash
curl http://localhost:4000/api/health
# { "status": "ok", "service": "boardnotes-backend", "timestamp": "..." }
```

Expected startup log when no database is configured:

```
[db] Running in demo memory mode — CMS changes reset on restart.
```

### Demo accounts

| Role | Email | Password | Landing page |
|---|---|---|---|
| Admin | `admin@boardnotes.com` | `admin123` | `/admin` |
| Editor | `editor@boardnotes.com` | `editor123` | `/admin` |
| Teacher | `teacher@boardnotes.com` | `teacher123` | `/admin` |
| Student | `student@boardnotes.com` | `student123` | `/account` |

Auto-created on every boot.

---

## 4. Environment setup

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Full reference: [`ENVIRONMENT.md`](./ENVIRONMENT.md).

Minimum for persistence:

```env
# backend/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/boardnotes
JWT_SECRET=<long random string>
```

⚠️ Changing `NEXT_PUBLIC_*` requires a **rebuild**, not just a restart — the
values are inlined by Next at build time.

---

## 5. Local PostgreSQL

### Option A — Docker Compose (recommended)

`docker-compose.local.yml`

```yaml
services:
  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: boardnotes
    ports:
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

```bash
docker compose -f docker-compose.local.yml up -d
```

Host port **5433** maps to container **5432** — this is intentional and matches
`README.md`, `backend/.env.example`, and `backend/drizzle.config.ts:13`.

⚠️ This file is currently **untracked** in git (`git status` shows
`?? docker-compose.local.yml`). Commit it or teammates cannot reproduce your
database.

### Option B — Local install

1. Install PostgreSQL 15.
2. Create the database: `createdb boardnotes`
3. Use the connection string in `backend/.env`.

### Stop / reset

```bash
docker compose -f docker-compose.local.yml stop     # stop, keep data
docker compose -f docker-compose.local.yml down -v  # stop and delete data
```

---

## 6. Migrations and seeding

### Automatic (default)

On boot the backend runs `applyMigrations()` then `seedIfEmpty()`
(`backend/src/server.ts:26-38`), gated by `AUTO_MIGRATE` (default `true`) and
DB reachability. Failures are warned, never fatal.

### Manual

```bash
npm run db:migrate -w backend     # drizzle-kit migrate
npm run db:seed -w backend        # tsx src/db/seed.ts
npm run db:generate -w backend    # drizzle-kit generate (after schema edits)
```

⚠️ **Read [`ISSUES-AND-RISKS.md`](./ISSUES-AND-RISKS.md#1-migration-journal-is-incomplete)
before running `db:generate`.** `meta/_journal.json` contains only 2 of the 20
SQL files on disk, and `schema.ts` is missing the unique constraints that exist
only in `0008`/`0009`. Generating a migration from the current `schema.ts` could
emit DDL that conflicts with the hand-written migrations.

---

## 7. All scripts

### Root

| Script | Command |
|---|---|
| `npm run dev:frontend` | `npm run dev -w frontend` |
| `npm run dev:backend` | `npm run dev -w backend` |
| `npm run build` | `npm run build -w frontend && npm run build -w backend` |
| `npm run build:frontend` | `npm run build -w frontend` |
| `npm run build:backend` | `npm run build -w backend` |
| `npm test` | `npm test -w backend` |
| `npm run db:migrate` | `npm run db:migrate -w backend` |
| `npm run lint` | `npm run lint -w frontend` |

### Backend

| Script | Command |
|---|---|
| `npm run dev -w backend` | `tsx watch src/server.ts` |
| `npm run build -w backend` | `tsc -p tsconfig.json` → `dist/` |
| `npm start -w backend` | `node dist/server.js` |
| `npm test -w backend` | `tsx --test src/demo-api.test.ts` |
| `npm run db:generate -w backend` | `drizzle-kit generate` |
| `npm run db:migrate -w backend` | `drizzle-kit migrate` |
| `npm run db:seed -w backend` | `tsx src/db/seed.ts` |

### Frontend

| Script | Command |
|---|---|
| `npm run dev -w frontend` | `next dev` (Turbopack, output → `.next/dev`) |
| `npm run build -w frontend` | `next build` (Turbopack, **no lint step**) |
| `npm start -w frontend` | `next start` |
| `npm run lint -w frontend` | `eslint .` |

There is **no backend lint script** and **no frontend test script**.

### One-off

```bash
node backend/scripts/generate-demo-pdfs.mjs   # regenerate public/demo-pdfs
```

---

## 8. Regenerating demo assets

```bash
node backend/scripts/generate-demo-pdfs.mjs
```

Hand-writes minimal valid PDFs into `backend/public/demo-pdfs/`. Helper
functions: `escapePdfText` (`:228`), `wrap` (`:232`), `buildContent` (`:248`),
`buildPdf` (`:296`).

Book covers are static images in `backend/public/book-covers/` (108 files) and
are **not** generated by any script.

---

## 9. Docker

### Backend image

`Dockerfile`

```dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
COPY shared/package.json shared/
COPY backend/package.json backend/

RUN npm ci
RUN npm install -g typescript

COPY . .

RUN tsc -p backend/tsconfig.json

EXPOSE 4000
CMD ["node", "backend/dist/server.js"]
```

```bash
docker build -t boardnotes-backend .
docker run -p 4000:4000 --env-file backend/.env boardnotes-backend
```

Characteristics:

- Backend only — **does not build the frontend**.
- Does **not** run migrations (relies on `AUTO_MIGRATE=true` at boot).
- Type-checks with a globally installed `tsc`.
- `.dockerignore` excludes `node_modules`, `.git`, `.next`, `*.md`, `.env*`.
  `backend/public/` **is** included, so demo PDFs and book covers ship.

⚠️ `Dockerfile` copies `package.json package-lock.json*` before the workspace
manifests, so `npm ci` runs against a workspace tree containing only `shared/`
and `backend`. The `frontend` workspace is added later by `COPY . .`, which
means frontend dependencies are **not** installed in the image. That is fine
since the image never runs them, but `npm ci` is running with an incomplete
workspace graph.

### Compose

`docker-compose.local.yml` contains **only** the `db` service. The application
is always run from the host via `npm run dev:*`.

---

## 10. Deployment

### Recommended layout

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Railway / Render / Fly.io / VPS |
| Database | Neon / Supabase / RDS |
| PDFs | Local disk, or Cloudflare R2 via `R2_*` |

### Step 1 — Database

Create a PostgreSQL instance and database, then set `DATABASE_URL`.

### Step 2 — Backend

```bash
npm ci
npm run build -w backend
npm run db:migrate -w backend
npm start -w backend
```

On first boot the API auto-seeds empty tables and creates the four demo
accounts. **Change or disable them before going live** — see
[`AUTH-AND-ROLES.md`](./AUTH-AND-ROLES.md#9-production-sanity-warnings).

Verify: `GET /api/health` → `{ "status": "ok" }`.

### Step 3 — Frontend

Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_URL` in the host's env, then:

```bash
npm ci
npm run build -w frontend
npm start -w frontend
```

Because `NEXT_PUBLIC_*` is build-time, the values must be set **before**
`next build`.

### Step 4 — CORS

Set `CORS_ORIGINS` on the backend to the exact frontend origin(s), comma
separated, no trailing slash:

```env
CORS_ORIGINS=https://boardnotes.com,https://www.boardnotes.com
```

### Step 5 — Uploads

- Default: `backend/public/uploads/` on local disk.
- R2: set all four of `R2_BUCKET`, `R2_ACCESS_KEY`, `R2_SECRET_KEY`,
  `R2_ENDPOINT`.
- Optional `R2_PUBLIC_URL` for direct CDN links; otherwise PDFs are proxied
  through `PUBLIC_API_URL/uploads/...`.

⚠️ On platforms with an **ephemeral filesystem** (Heroku, most container
platforms without a volume), local-disk uploads are lost on restart or deploy.
Use R2 in production.

### Step 6 — Email (optional)

All of `SMTP_HOST`, `SMTP_USER`, `NOTIFY_EMAIL` must be set for
`smtpConfigured()` to return true; `SMTP_PASS` is required by the transport.
Without them the app logs mail to stdout instead.

---

## 11. Pre-deployment checklist

- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` is a long random value, **not** `change-me` or
      `…dev-secret…`
- [ ] `DATABASE_URL` set and reachable
- [ ] Demo account passwords changed, or seeding disabled in production
- [ ] `CORS_ORIGINS` set to real frontend origins
- [ ] `PUBLIC_SITE_URL` set (classroom email links)
- [ ] `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_URL` set **before build**
- [ ] `npm run lint` passes (frontend)
- [ ] `npm test` passes
- [ ] `npm run build -w backend` succeeds
- [ ] R2 configured **or** uploads on a persistent volume
- [ ] Database backups scheduled (SRS §4.2 requires daily + 1-business-day
      restore)
- [ ] Consider removing `board-production-6505.up.railway.app` from
      `frontend/next.config.ts:32`

---

## 12. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `[db] Running in demo memory mode` | `DATABASE_URL` unset or unreachable | Set it; verify Postgres is up and port 5433 is correct |
| Admin edits vanish on restart | Running in memory mode | Set `DATABASE_URL` |
| Book covers 404 | Frontend rewrite not matching | `NEXT_PUBLIC_API_URL` must match between `next.config.ts:5` and `lib/api-client.ts:1` |
| Hero search suggestions never update | `hero-search.tsx:133` fetches a relative `/api/search` | Known defect — see [`ISSUES-AND-RISKS.md`](./ISSUES-AND-RISKS.md) |
| CORS errors in the browser console | `CORS_ORIGINS` mismatch | Must match the exact origin, no trailing slash |
| `API 500` on chapter publish | Missing columns (`video_url`, `drive_url`, …) | Migration journal is incomplete — apply `0011`–`0017` manually |
| Frontend build picks up a stale API URL | `NEXT_PUBLIC_*` is build-time | Rebuild after changing the env var |
| `next dev` and `next build` conflict | v16 lockfile | Stop the other process; `.next/dev/lock` holds the PID |
| `npm test` hangs | None expected — tests bind port 0 and close | — |

---

## 13. Git conventions

Observed commit style is **Conventional Commits**:

```
fix: make hover menu-switch state update pure
feat(past-papers): board selector, solved/unsolved + syllabus filters
refactor: single board-aware nav menu, sticky class ribbon
chore: remove unused board switcher/menu components
style: motion card hovers, lucide icon set
```

The 30 most recent commits are entirely frontend UI/UX work. Several reference
the SRS roadmap explicitly (`(plan Phase 1)`, `(Phase 2)`).

⚠️ **No `.gitattributes`** exists, so Git warns about LF→CRLF normalisation on
Windows checkouts. Adding one would stabilise diffs across platforms.

⚠️ `AGENTS.md` / `CLAUDE.md` are **auto-generated and re-added by `next dev`**
(`node_modules/next/dist/server/lib/generate-agent-files.js`). Committing them
with your work keeps the tree clean; removing them only recreates the uncommitted
change.

---

## 14. Agent conventions

- `AGENTS.md` at the repo root and in `frontend/` contains a Next.js-managed
  block pointing at `node_modules/next/dist/docs/`.
- **Read the bundled docs before writing Next.js code.** Next 16 has substantial
  breaking changes — async request APIs, `middleware` → `proxy`, `next lint`
  removed, the new caching API, `next/image` changes.
- `CLAUDE.md` is a one-line pointer: `@AGENTS.md`.
- A Next.js MCP server is available at `/_next/mcp` while `next dev` runs,
  exposing `get_compilation_issues` and `compile_route`.
