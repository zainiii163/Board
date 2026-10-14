# BoardNotes — Documentation Index

Documentation for the **BoardNotes** monorepo (educational content platform for
Pakistani board exams: FBISE, Punjab, Sindh, KPK, Oxford, Cambridge).

| Document | Purpose |
|---|---|
| [`SRS.md`](./SRS.md) | Client-facing Software Requirements Specification v3.1 (product scope, phases, acceptance) |
| [`TECHNICAL-OVERVIEW.md`](./TECHNICAL-OVERVIEW.md) | System architecture, monorepo layout, technology stack, runtime topology |
| [`BACKEND.md`](./BACKEND.md) | Express API: module-by-module breakdown, middleware, dual-mode data layer, seeding |
| [`FRONTEND.md`](./FRONTEND.md) | Next.js 16 app: routing, components, data fetching, styling, PWA |
| [`API-REFERENCE.md`](./API-REFERENCE.md) | Complete HTTP endpoint reference (every route, auth level, params, responses) |
| [`DATA-MODEL.md`](./DATA-MODEL.md) | PostgreSQL schema (25 tables), Drizzle migrations, in-memory fallback stores |
| [`AUTH-AND-ROLES.md`](./AUTH-AND-ROLES.md) | JWT auth flow, role model, full permission matrix |
| [`ENVIRONMENT.md`](./ENVIRONMENT.md) | Every environment variable across all workspaces |
| [`DEVELOPMENT.md`](./DEVELOPMENT.md) | Local setup, scripts, Docker, deployment runbook |
| [`TESTING.md`](./TESTING.md) | Current test suite, what is covered, coverage gaps |
| [`ISSUES-AND-RISKS.md`](./ISSUES-AND-RISKS.md) | Verified defects, security gaps, and migration debt |

---

## Quick facts

| | |
|---|---|
| Repository | `D:\board` (git, branch `main`) |
| Workspaces | `frontend`, `backend`, `shared` (npm workspaces) |
| Frontend | Next.js **16.3.1**, React **19.2.8**, TypeScript, Tailwind CSS v4 — port **3000** |
| Backend | Node.js + Express **5.2.1**, TypeScript ESM, Drizzle ORM — port **4000** |
| Database | PostgreSQL 15 (optional), local compose maps host **5433** → container 5432 |
| Object storage | Cloudflare R2 (optional), falls back to local disk |
| Frontend routes | 61 pages (38 public, 23 admin) |
| Backend endpoints | 30 routers mounted under `/api` |
| Backend LOC | ~12,200 lines across 133 `.ts` files |
| Frontend LOC | ~16,500 lines across 167 `.ts`/`.tsx` files |

---

## Documentation conventions

- Every claim in these documents was verified against the working tree at the
  time of writing. Source references use `file_path:line_number` format.
- Paths are written relative to the repository root unless prefixed with an
  absolute path.
- Known defects are **not** silently omitted; they are documented in
  [`ISSUES-AND-RISKS.md`](./ISSUES-AND-RISKS.md) and cross-referenced from the
  relevant module documents.
