# Technical Overview

## 1. What BoardNotes is

BoardNotes is an educational content platform for Pakistani board examinations.
It publishes solved textbook exercises, multiple-choice questions, PDF
resources, past papers, and formula sheets, organised by a four-level content
hierarchy:

```
Board → Class → Subject → Chapter → Exercise → Question
```

Public reading requires **no account**. Authentication only unlocks bookmarks,
progress tracking, quiz submission, classrooms, and comments.

## 2. Repository layout

```
D:\board\
├── package.json              npm workspaces root
├── package-lock.json
├── README.md                 operator-facing setup guide
├── AGENTS.md                 auto-generated Next.js agent rules (managed block)
├── CLAUDE.md                 pointer → @AGENTS.md
├── Dockerfile                backend-only production image
├── docker-compose.local.yml  PostgreSQL 15 for local dev (host port 5433)
├── query                     stray untracked 13-byte artifact (see ISSUES §1)
│
├── frontend/                 Next.js 16 App Router  → http://localhost:3000
├── backend/                  Express 5 API          → http://localhost:4000
├── shared/                   @boardnotes/shared (types only)
└── docs/                     product + technical documentation
```

### Workspaces

`package.json:4`

```json
"workspaces": ["frontend", "backend", "shared"]
```

### Root scripts

`package.json:5-13`

| Script | Command | Notes |
|---|---|---|
| `npm run dev:frontend` | `npm run dev -w frontend` | Next dev (Turbopack) |
| `npm run dev:backend` | `npm run dev -w backend` | `tsx watch src/server.ts` |
| `npm run build` | frontend build then backend build | |
| `npm run build:frontend` / `:backend` | per-workspace builds | |
| `npm test` | `npm test -w backend` | Backend only — frontend has no tests |
| `npm run db:migrate` | `npm run db:migrate -w backend` | drizzle-kit |
| `npm run lint` | `npm run lint -w frontend` | **Backend has no lint script** |

## 3. Technology stack

### Frontend

| Concern | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router) | `16.3.1` — pinned exactly, no caret |
| UI runtime | React / React DOM | `19.2.8` |
| Language | TypeScript | `^5`, `strict: true` |
| Bundler | Turbopack | Next 16 default for both `dev` and `build` |
| Styling | Tailwind CSS | `^4` (CSS-first config, no `tailwind.config.js`) |
| Animation | framer-motion | `^14.0.0` |
| Icons | lucide-react | `^1.51.0` |
| Maths | katex + react-katex | `^0.18.4` / `^3.1.0` |
| Lint | eslint (flat config) | `^9` + `eslint-config-next` `16.3.1` |
| PWA | hand-written service worker | `public/sw.js` |

### Backend

| Concern | Choice | Version |
|---|---|---|
| Runtime | Node.js (ESM) | `"type": "module"`, `NodeNext` module resolution |
| Framework | Express | `^5.2.1` |
| Language | TypeScript | `^7.0.2`, `strict: true`, target ES2022 |
| Dev runner | tsx watch | `^4.23.12` |
| ORM | drizzle-orm | `^0.45.2` |
| Migration tooling | drizzle-kit | `^0.31.10` |
| Database driver | pg (node-postgres) | `^8.23.0` |
| Auth | jsonwebtoken + bcryptjs | `^9.0.3` / `^3.0.3` |
| File upload | multer | `^2.2.0` |
| ZIP streaming | archiver | `^8.0.0` |
| Object storage | @aws-sdk/client-s3 (Cloudflare R2) | `^3.1116.0` |
| Email | nodemailer | `^9.0.5` |
| CORS | cors | `^2.8.6` |
| Env loading | dotenv | `^17.4.2` |
| Tests | `node:test` (built-in) | no external test framework |

### Shared

`shared/package.json` — `@boardnotes/shared`, private, ships **raw TypeScript**
(`"types": "./src/index.ts"`, `"import": "./src/index.ts"`). No build step, no
dependencies. Contains types only: no constants, no runtime values, no schemas.
See [`DATA-MODEL.md`](./DATA-MODEL.md#12-shared-package) and
[`ISSUES-AND-RISKS.md`](./ISSUES-AND-RISKS.md#2-shared-package-is-half-wired).

## 4. Runtime architecture

```
                        ┌──────────────────────────────┐
   Browser  ─────────►  │  Next.js 16 (frontend)       │
                        │  :3000                       │
                        │                              │
                        │  • RSC renders public pages  │
                        │  • client components for      │
                        │    interactive/admin UI       │
                        │  • rewrites /book-covers,    │
                        │    /uploads, /demo-pdfs  ─────┼──┐
                        └──────────────────────────────┘  │
                                                        │ │
                        ┌──────────────────────────────┐  │
                        │  Express 5 (backend)         │◄─┘
                        │  :4000                       │
                        │                              │
                        │  30 routers under /api       │
                        │  useDb() gate ──┬── Drizzle ─┼──► PostgreSQL 15
                        │                 │             │      (:5433 local)
                        │                 └── in-memory │             │
                        │                     stores     │   ┌─────────▼────────┐
                        │                              │   │ Cloudflare R2   │
                        │  static: /demo-pdfs          │   │ (S3-compatible)  │
                        │           /book-covers       │   └──────────────────┘
                        │           /uploads           │
                        │                              │   ┌──────────────────┐
                        │  JWT Bearer auth             │   │ SMTP (nodemailer)│
                        └──────────────────────────────┘   └──────────────────┘
```

### Port map

| Port | Service | Source |
|---|---|---|
| 3000 | Next.js frontend | `backend/.env.example` `CORS_ORIGINS` default; `PUBLIC_SITE_URL` default |
| 4000 | Express API | `backend/src/config/env.ts:2` (`PORT ?? 4000`) |
| 5433 | PostgreSQL (host) → 5432 (container) | `docker-compose.local.yml:11` |

### Asset proxying

The frontend never serves PDFs or covers itself. `next.config.ts:9-15` rewrites
three path prefixes to the API origin:

```ts
{ source: "/book-covers/:path*", destination: `${API}/book-covers/:path*` },
{ source: "/uploads/:path*",      destination: `${API}/uploads/:path*` },
{ source: "/demo-pdfs/:path*",    destination: `${API}/demo-pdfs/:path*` },
```

`API` is `process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"`
(`next.config.ts:5`), and must stay in sync with
`frontend/src/lib/api-client.ts:1`.

One redirect is also declared (`next.config.ts:16-24`):

```ts
{ source: "/:board/books", destination: "/:board?view=books", permanent: false }
```

## 5. The dual-mode data layer (most important architectural fact)

`backend/src/db/mode.ts` implements a single boolean gate:

```ts
initDbMode()  // probes PostgreSQL once at boot
useDb()        // read by every service
```

- **PostgreSQL reachable** → every service reads and writes through Drizzle.
  Admin CMS edits persist across restarts.
- **PostgreSQL unreachable / `DATABASE_URL` unset** → every service falls back
  to the in-memory layer in `backend/src/store/*`, seeded from
  `backend/src/demo-data.ts`. All changes reset when the process restarts.

This dual-mode behaviour is *by design* (documented in the root `README.md`) and
is what lets the app boot with zero infrastructure. The cost is that every
service must maintain two code paths, and the fallback path is under-tested —
see [`ISSUES-AND-RISKS.md`](./ISSUES-AND-RISKS.md).

## 6. Content model

### Hierarchy

`boards → classes → subjects → chapters → exercises → questions → solution_steps`

Fully normalised with integer foreign keys (`backend/src/db/schema.ts:5-68`).

### Parallel, slug-keyed content

Several subsystems deliberately use string composite keys instead of foreign
keys so content can be addressed by URL without a DB round trip:

| Subsystem | Key shape | Example |
|---|---|---|
| MCQs | `chapter_key` | `fbise/9/mathematics/real-numbers` |
| Quiz scores | `chapter_key` | `fbise/9/mathematics/real-numbers` |
| Flashcard progress | `chapter_key` | `fbise/9/mathematics/real-numbers` |
| Progress tracking | `subject_key` | `fbise/9/mathematics` |
| Classroom scoping | `board_slug` + `class_slug` + `subject_slug` | — |
| Books / past papers | `board_slug` + `class_slug` + `subject_slug` | — |

### URL ↔ API mapping

| URL | API call |
|---|---|
| `/fbise` | `GET /api/boards/{board}` |
| `/fbise/9` | `GET /api/boards/{board}/classes/{classSlug}` |
| `/fbise/9/mathematics` | `GET /api/boards/{board}/classes/{classSlug}/subjects/{subject}` |
| `/fbise/9/mathematics/real-numbers` | `.../chapters/{chapter}` |
| `/fbise/9/mathematics/real-numbers/exercise-1-1` | `.../chapters/{chapter}/exercises/{exercise}` |
| `/fbise/9/mathematics/real-numbers/exercise-1-1/q/3` | `.../chapters/{chapter}/exercises/{exercise}/q/{questionNum}` |

## 7. Content workflow

```
draft ──review──► in_review ──publish──► published
  ▲                  │                      │
  └─── reject ───────┘                      │
  ◄───────────── unpublish ───────────────────┘
```

`ContentStatus = "draft" | "in_review" | "published" | "archived"`
(`shared/src/index.ts:13`).

- Teachers may create and edit chapters but **cannot** publish
  (`backend/src/modules/chapters/chapters.controller.ts:110-112` strips `status`
  from teacher payloads — the only per-field authorization in the codebase).
- Only `admin` and `editor` can publish/unpublish/reject/delete
  (`backend/src/modules/chapters/chapters.routes.ts:28-30,41`).
- Publishing a chapter notifies enrolled classrooms by email
  (`backend/src/modules/chapters/chapters.service.ts:24-37`).
- Every CMS mutation writes an audit row
  (`backend/src/modules/audit/audit.service.ts`).

## 8. Authentication model

Stateless JWT bearer tokens, no sessions and no cookies.

```
POST /api/auth/login → { token }
                       │
                       ▼
Authorization: Bearer <token>   (HS256, 7-day expiry)
                       │
                       ▼
requireAuth → req.user = { userId, email, role }
```

Full details, role matrix, and demo credentials:
[`AUTH-AND-ROLES.md`](./AUTH-AND-ROLES.md).

The frontend stores the token in `localStorage.boardnotes_token`
(`frontend/src/lib/api-client.ts:7-16`) and enforces route protection in the
browser via `AdminGuard` / `AccountGuard`. There is no `middleware.ts` /
`proxy.ts` in the Next app, so client-side guards are a UX affordance only —
the real boundary is the Express `requireAuth` / `requireRole` middleware.

## 9. Demo content

The repository ships a substantial bundled dataset so the site is fully
browsable with no database and no seeding step:

| Asset | Location | Size |
|---|---|---|
| Curriculum catalog | `backend/src/demo-data.ts` | ~2,100 lines |
| Demo PDFs | `backend/public/demo-pdfs/` | 31 files |
| Book covers | `backend/public/book-covers/` | 108 images |
| PDF generator script | `backend/scripts/generate-demo-pdfs.mjs` | writes minimal valid PDFs |
| In-memory stores | `backend/src/store/*.ts` | 11 files |

Demo boards: `fbise`, `punjab`, `kpk`, `sindh`, `oxford`, `cambridge`.

## 10. Source reference

| Concern | File |
|---|---|
| Monorepo manifest | `package.json:1-15` |
| Backend entry | `backend/src/server.ts` |
| Express app factory | `backend/src/app.ts:15-66` |
| API router mounts | `backend/src/routes/index.ts:34-73` |
| DB mode gate | `backend/src/db/mode.ts` |
| PG pool | `backend/src/db/index.ts:9-15` |
| Next config | `frontend/next.config.ts` |
| API client | `frontend/src/lib/api-client.ts` |
| Root layout | `frontend/src/app/layout.tsx` |
| Public layout | `frontend/src/app/(public)/layout.tsx` |
| Admin layout | `frontend/src/app/(admin)/layout.tsx` |
