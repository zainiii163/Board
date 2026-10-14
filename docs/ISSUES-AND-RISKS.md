# Issues & Risks

Every item below was verified against the working tree. Severity reflects
production impact on a public educational site.

| Severity | Count |
|---|---:|
| Critical | 3 |
| High | 5 |
| Medium | 8 |
| Low | 8 |

---

## Critical

### 1. Unauthenticated write endpoints

`backend/src/modules/solutions/solutions.routes.ts` (9 lines, no middleware):

```ts
solutionsRouter.get("/:questionId", controller.listByQuestion);   // :6
solutionsRouter.post("/", controller.create);                    // :7  ← no auth
solutionsRouter.put("/:id", controller.update);                  // :8  ← no auth
solutionsRouter.delete("/:id", controller.remove);               // :9  ← no auth
```

`solutions.service.ts` is a single comment line — the handlers are stubs
returning `{created:true}` / `{updated:true}` / `{deleted:true}`. They persist
nothing today, but they are a public mutation surface that will become live the
moment the service is implemented.

Same pattern:

- `POST /api/test-generator/generate` —
  `modules/test-generator/test-generator.routes.ts:6`, no auth. DB-only (no
  memory fallback), so in production it hits PostgreSQL on every anonymous call.

**Fix**

```ts
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

solutionsRouter.get("/:questionId", controller.listByQuestion);
solutionsRouter.post("/", requireAuth, requireRole("admin", "editor", "teacher"), controller.create);
solutionsRouter.put("/:id", requireAuth, requireRole("admin", "editor", "teacher"), controller.update);
solutionsRouter.delete("/:id", requireAuth, requireRole("admin", "editor"), controller.remove);
```

Add `requireAuth` to the test generator at minimum (it is CPU/DB-heavy and
should probably be rate limited too).

---

### 2. Migration journal is incomplete

`backend/src/db/migrations/meta/_journal.json` lists **2 entries**:

```json
{ "tag": "0000_talented_juggernaut", "when": 1787204956885 }
{ "tag": "0001_great_sabra",        "when": 1789417361341 }
```

**18 of the 20 SQL files on disk are never applied by the migrator**
(`0001_demo_schema` through `0017_past_papers_solved_syllabus`).

Consequences on a fresh database:

**Columns not created** (compensated for at runtime by ad-hoc DDL in
`backend/src/db/seed-if-empty.ts:13-36`, which only runs when `useDb()` is true):

| Column | Only in |
|---|---|
| `chapters.video_url` | `0011_chapter_video.sql` |
| `chapters.drive_url` | `0016_chapters_drive_url.sql` |
| `books.cover_url` | `0013_books_cover_url.sql` |
| `books.drive_url` | `0015_books_drive_url.sql` |
| `past_papers.paper_type` | `0014_past_papers_paper_type.sql` |
| `past_papers.is_solved`, `.syllabus` | `0017_…solved_syllabus.sql` |
| `users.email_updates` | `0012_email_updates.sql` |

**Indexes never created** (no compensation anywhere):

`question_comments_page_path_idx`, `question_comments_status_idx`,
`mcqs_chapter_key_idx`, `quiz_scores_user_id_idx`,
`quiz_scores_chapter_key_idx`, `user_progress_user_id_idx`,
`flashcard_progress_user_id_idx`, `classrooms_teacher_idx`,
`classrooms_join_code_idx`, `classroom_members_user_idx`.

**Unique constraints** on `user_progress (user_id, subject_key)`
(`0008_quiz_progress.sql:22,27`) and
`flashcard_progress (user_id, chapter_key)`
(`0009_flashcard_progress.sql:9,12`) exist only in hand-written SQL and are
**absent from `schema.ts`**. Drizzle cannot model or migrate them, so
`drizzle-kit generate` may emit conflicting DDL.

**Impact:** every `GET /api/mcqs` (scanned by `chapter_key`), every quiz
submission, and every classroom lookup runs a sequential scan. At exam-season
scale this is the difference between a responsive search and a timeout.

**Fix**

1. Regenerate the journal from the existing SQL files, or
2. Squash `0000` + `0001` + `0001`–`0017` into two clean migrations and
   regenerate snapshots with `drizzle-kit generate`, or
3. Add the unique constraints to `schema.ts` and regenerate, so the ORM is the
   source of truth.

Until then, treat `npm run db:generate -w backend` as unsafe.

---

### 3. Production starts with the default JWT secret

`backend/src/config/env.ts:4`

```ts
jwtSecret: process.env.JWT_SECRET ?? "change-me",
```

`backend/src/server.ts:11-22` **only warns**:

```
Set a strong JWT_SECRET in production.
```

The server starts regardless. Combined with:

- `backend/src/modules/auth/auth.service.ts:158-190` — the four demo accounts
  (`admin@boardnotes.com` / `admin123`, etc.) are created on **every boot**,
  including production;
- `backend/src/utils/jwt.ts:12-14` — tokens are HS256 signed with that secret,
  no `iss`/`aud` validation.

Anyone who knows the default secret can mint a valid admin token with
`jsonwebtoken.sign({userId: 1, email, role: "admin"}, "change-me")`.

**Fix** — fail closed:

```ts
if (isProduction() && (!env.jwtSecret || env.jwtSecret === "change-me" || env.jwtSecret.includes("dev-secret"))) {
  throw new Error("JWT_SECRET must be set to a strong random value in production.");
}
```

And gate demo seeding behind `NODE_ENV !== "production"`, or force a random
password on first creation.

---

## High

### 4. Students can create resources

`backend/src/modules/resources/resources.routes.ts:14`

```ts
resourcesRouter.post("/", requireAuth, controller.create);
```

`requireAuth` only — no `requireRole`. Every other content-creation endpoint
uses `requireRole("admin","editor","teacher")`. A signed-in student can publish
entries into the public resource catalogue.

`PATCH /api/resources/:id` (`:17`) correctly requires AET, so the only route is
create. Fix by adding `requireRole("admin", "editor", "teacher")`.

---

### 5. No API 404 handler — unmatched paths return HTML

`backend/src/app.ts:62-63`

```ts
app.use("/api", apiRouter);
app.use(errorHandler);
```

There is no `app.use(notFound)` between the router and the error handler, and
nothing after `errorHandler` either. Verified behaviour for an unmatched API
path:

```
GET /api/does-not-exist
→ 404  Content-Type: text/html; charset=utf-8  (empty body)
```

Express 5's built-in `finalhandler` produces this — `errorHandler` is a
4-arity error middleware and is never invoked without an error, so it plays no
part here.

Impact:

- API clients get an **HTML** response where every other error path returns
  JSON. Frontend `parseResponse` (`frontend/src/lib/api-client.ts:22-29`) does
  `res.json().catch(() => ({}))`, so it degrades to a generic
  `API 404: /api/…` with no diagnostic message.
- No consistent error envelope for any consumer of the API.
- Static asset paths (`/book-covers/…`, `/uploads/…`) miss also produce HTML
  404s, which breaks `<Image>` and `<iframe src="/uploads/...">` consumers in
  confusing ways.

Separately, `errorHandler` has no `res.headersSent` guard, so a throw after
streaming starts (e.g. the chapter ZIP path at
`boards.controller.ts:451-455`) can attempt a second write.

**Fix**

```ts
app.use("/api", apiRouter);
app.use((req, _res, next) => next(ApiError.notFound(`No route for ${req.method} ${req.originalUrl}`)));
app.use(errorHandler);
```

And harden the handler:

```ts
export function errorHandler(err: unknown, _req, res, _next) {
  if (res.headersSent) return;
  if (err instanceof ApiError) return res.status(err.statusCode).json({ error: err.message });
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
```

---

### 6. Mass assignment in four service update paths

| Service | Line |
|---|---|
| `boards.service.updateBoard` | `:91` |
| `authors.service.updateAuthor` | `:109` |
| `mcqs.service.updateMcq` | `:88` |
| `legal.service.updateLegalPage` | `:40` |

Each spreads the raw request body into `db.update(table).set(input)`. An
editor can set any column on those tables — including `correct_label` (already
exposed), or any field the schema later gains without the service being updated.

**Fix** — explicit allow-lists, matching the pattern already used at
`resources.routes.ts:17` and `exams.routes.ts:15`.

---

### 7. Test suite is failing and does not terminate

`backend/src/demo-api.test.ts:19`

```
not ok 1 - GET /api/boards returns the demo boards
  Expected values to be strictly equal:  8 !== 6
```

`GET /api/boards` returns 8 boards. The catalogue gained `lahore` and
`d-g-khan` in commit `165aee4` without updating the test. Test 2 passes.

Separately, **the runner hangs after both tests complete** — verified still
running after 60 s, with a 180 s `npm test` invocation terminated by timeout.
The servers are closed at `:103-108` and `:197-202`, so a keep-alive socket
from Node's global `fetch` dispatcher is holding the event loop open.

Full analysis and fix options: [`TESTING.md`](./TESTING.md#3-verified-defect--the-test-process-never-exits).

---

## Medium

### 8. No input validation layer

Three middleware files are unimplemented stubs and are imported nowhere:

| File | Content |
|---|---|
| `src/middleware/validate.middleware.ts:3-6` | `// Placeholder — will use zod for request body validation.` |
| `src/middleware/rate-limit.middleware.ts:3-6` | `// Placeholder — will integrate express-rate-limit or similar.` |
| `src/middleware/upload.middleware.ts:6-11` | Defines `ALLOWED_TYPES` / `MAX_SIZE`, then `void`s them |

Validation is scattered across ~30 ad-hoc `if` checks in controllers and
services, with inconsistent rules for the same field in different endpoints.

### 9. No rate limiting

`rate-limit.middleware.ts` is a stub. Unauthenticated or authenticated
endpoints exposed to abuse:

- `POST /api/auth/login` — credential stuffing (bcrypt cost 10 makes each
  attempt cheap to the attacker and expensive to the server)
- `POST /api/auth/register` — mass account creation
- `POST /api/reports`, `POST /api/contact` — email amplification
- `POST /api/quiz/submit` — DB write amplification
- `POST /api/test-generator/generate` — heavy aggregate queries
- `GET /api/search` — expensive full-text scan
- `GET /api/boards/:slug/…/zip` — CPU-heavy archiver streaming
- `POST /api/pdfs/upload`, `POST /api/books/:id/pdf`, `POST /api/resources`

SRS §4.3 explicitly requires "login attempt limits" and
"rate-limited reports/login" — **not implemented**.

### 10. No security headers or request logging

`backend/src/app.ts:18-23` sets CORS only. No `helmet`, no `compression`, no
request logging, no CSRF protection (consistent with Bearer tokens, but worth
an explicit decision). No rate-limit headers either.

### 11. `shared/` package is half-wired

`shared/src/index.ts` and `frontend/src/lib/shared-types.ts` are
**byte-identical today** (3,289 bytes / 178 lines each, `git diff --no-index`
returns 0), but:

- the backend imports `@boardnotes/shared` in 14 places;
- the frontend imports the local copy at 15 call sites via `@/lib/shared-types`;
- `frontend/tsconfig.json` has no `paths` entry for the package;
- `frontend/package.json` does not declare it as a dependency.

Nothing enforces they stay in sync — the next edit to either diverges silently.

**Fix** — add `"@boardnotes/shared": "*"` to `frontend/package.json`, add
`"@boardnotes/shared": ["./shared/src/index.ts"]` to `frontend/tsconfig.json`
paths, and delete `frontend/src/lib/shared-types.ts`.

### 12. Hero search never queries the backend

`frontend/src/components/portal/hero-search.tsx:133`

```ts
const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
```

Relative URL ⇒ resolves against the **Next.js origin** (`:3000`), which has no
`/api/search` route handler (there are zero `route.ts` files in the app). The
request 404s and the `catch` at `:156` silently falls back to local suggestions.
Live autocomplete is permanently degraded and no error surfaces to users.

**Fix**

```ts
const res = await apiFetch<SearchResponse>(`/api/search?q=${encodeURIComponent(q)}`);
```

or prefix `getApiBaseUrl()`. Note `apiFetch` adds `next: { revalidate: 60 }`,
which is harmless in a client component.

### 13. Caching configuration is self-defeating

`frontend/src/lib/api-client.ts:38` sets `next: { revalidate: 60 }` on GETs,
but **23 route segments** declare `export const dynamic = "force-dynamic"`,
which forces request-time rendering and neutralises `fetch` caching.

Every public page is re-fetched from PostgreSQL on every request, despite the
60-second ISR intent. SRS §4.1 sets a **2.5 s chapter-page budget** and a
**99.5 % uptime** target — no caching puts both at risk.

**Fix** — remove `force-dynamic` from segments that do not genuinely need
request-time rendering, or adopt `cacheComponents` with `cacheTag`/`revalidateTag`.
Note Next 16 changed `revalidateTag(tag)` to require a `cacheLife` profile.

### 14. Public endpoint exposes MCQ answer keys

`backend/src/modules/mcqs/mcqs.routes.ts:11` returns `correctLabel` and
`reason` to anonymous callers. `GET /api/quiz` (`quiz.routes.ts:8`) correctly
strips answers, so the protection is inconsistent across the two quiz surfaces.

**Fix** — omit `correctLabel`/`reason` from the public list response; return
them only from the authenticated submit path, matching `/api/quiz`.

### 15. User-id ordering divergence between data modes

| id | Memory store (`store/memory-store.ts:64-106`) | DB seed |
|---|---|---|
| 1 | admin | admin |
| 2 | editor | editor |
| 3 | **student** | **teacher** |
| 4 | **teacher** | **student** |

This ordering is hard-coded in
`backend/src/modules/classrooms/classrooms.service.ts:172-174,273`, so classroom
membership and notification lookups resolve the wrong user depending on whether
`useDb()` is true.

**Fix** — look users up by email or role, never by literal id.

---

## Low

### 16. Broken font custom properties

`frontend/src/app/globals.css:38,51,52,81` reference
`var(--font-geist-sans)` and `var(--font-geist-mono)`, but there is **no
`next/font` import anywhere in `src/`**. The properties are undefined, so
`font-sans`/`font-mono` resolve to nothing and fall back to
`Arial, Helvetica, sans-serif`. `frontend/README.md:21` still claims Geist.

**Fix** — add a `next/font/google` import in `src/app/layout.tsx`, or delete the
dead custom properties.

### 17. Next 16 deprecation drift

| Issue | Location |
|---|---|
| `<Image priority>` deprecated → use `preload` | `frontend/src/app/(public)/books/[slug]/page.tsx:94`; `frontend/src/app/(public)/[board]/books/[classSlug]/[subject]/page.tsx:127` |
| `scroll-behavior: smooth` without `data-scroll-behavior="smooth"` on `<html>` — v16 removed the automatic override | `globals.css:68` vs `layout.tsx:29` |
| `PageProps` locally shadowed, hiding the generated global helper | `[board]/books/[classSlug]/[subject]/page.tsx:49` |

### 18. Dead code

| Item | Location |
|---|---|
| `catalogRouter` never mounted | `backend/src/modules/catalog/catalog.routes.ts:5` |
| `optionalAuth` defined, imported nowhere | `backend/src/middleware/auth.middleware.ts:29` |
| Unused controller exports | `backend/src/modules/exercises/exercises.controller.ts:38-40` (`getBySlug`, `update`, `reorder`) |
| 12 unused frontend components/hooks | see [`FRONTEND.md`](./FRONTEND.md#componentscontent-43-files) |
| `docs/srs2.md` — 0 bytes | `docs/srs2.md` |
| `query` — 13-byte untracked stray file containing the literal glob `postgresql*` | `D:\board\query` |
| `docker-compose.local.yml` — **untracked**, so teammates cannot reproduce the DB | repo root |

### 19. `express.json()` limit never configured

`backend/src/app.ts:24` uses the Express default of 100 KB. Chapter upserts with
long bilingual summaries, `definitions` arrays, and `formulas` could plausibly
approach that. No explicit limit and no configuration hook.

### 20. Inconsistent error response shape

| Key | Emitted by |
|---|---|
| `{ error }` | `errorHandler`, `authors.controller.ts:29`, `app.ts:37` |
| `{ message }` | `boards.controller.ts` inline 404s |
| `{}` / empty | several inline controllers |

Frontend `parseResponse` (`lib/api-client.ts:22-29`) reads only `data.error`,
so `{ message }` errors degrade to `API <status>: <path>`.

**Fix** — normalise on `{ error: string }` everywhere; add a helper so
controllers stop hand-rolling `res.status(n).json({...})`.

### 21. Upload filter trusts the file extension

Three duplicated multer configs accept a file when
`mimetype === "application/pdf"` **or** the name ends `.pdf`
(`pdfs.controller.ts:8-20`, `books.controller.ts:14-26`,
`resources.controller.ts:37-49`). No magic-byte inspection, so a non-PDF renamed
`.pdf` is stored and later served with `Content-Type: application/pdf`
(`app.ts:43`).

### 22. Hard-coded production hostname

`frontend/next.config.ts:32`

```ts
{ protocol: "https", hostname: "board-production-6505.up.railway.app", port: "", pathname: "/**" },
```

An environment-specific host baked into source. Should be
`remotePatterns` driven by `NEXT_PUBLIC_API_URL`, or removed in favour of
`unoptimized` / a CDN.

### 23. No `.gitattributes`

Git warns `LF will be replaced by CRLF` on every Windows checkout. Adding
`.gitattributes` with `* text=auto eol=lf` would stabilise diffs across
platforms.

---

## Quick-reference index

| # | Issue | Severity | Primary location |
|---|---|---|---|
| 1 | Unauthenticated write endpoints | Critical | `modules/solutions/solutions.routes.ts:7-9`, `modules/test-generator/test-generator.routes.ts:6` |
| 2 | Migration journal incomplete | Critical | `db/migrations/meta/_journal.json` |
| 3 | Default JWT secret in production | Critical | `config/env.ts:4`, `server.ts:11-22` |
| 4 | Students can create resources | High | `modules/resources/resources.routes.ts:14` |
| 5 | No API 404 handler (HTML 404) | High | `app.ts:62-63` |
| 6 | Mass assignment | High | `boards.service.ts:91`, `authors.service.ts:109`, `mcqs.service.ts:88`, `legal.service.ts:40` |
| 7 | Failing + hanging test suite | High | `src/demo-api.test.ts:19` |
| 8 | No validation layer | Medium | `middleware/validate.middleware.ts` |
| 9 | No rate limiting | Medium | `middleware/rate-limit.middleware.ts` |
| 10 | No security headers | Medium | `app.ts:18-23` |
| 11 | `shared/` half-wired | Medium | `frontend/src/lib/shared-types.ts` |
| 12 | Hero search hits wrong origin | Medium | `components/portal/hero-search.tsx:133` |
| 13 | Caching neutralised | Medium | `lib/api-client.ts:38` + 23 `force-dynamic` segments |
| 14 | Public answer-key leak | Medium | `modules/mcqs/mcqs.routes.ts:11` |
| 15 | User-id ordering divergence | Medium | `modules/classrooms/classrooms.service.ts:172-174,273` |
| 16 | Broken font tokens | Low | `app/globals.css:38,51,52,81` |
| 17 | Next 16 deprecation drift | Low | `books/[slug]/page.tsx:94`, `[board]/books/…/page.tsx:127` |
| 18 | Dead code + untracked files | Low | multiple |
| 19 | JSON body limit unconfigured | Low | `app.ts:24` |
| 20 | Inconsistent error shape | Low | `boards.controller.ts`, `authors.controller.ts:29` |
| 21 | Upload extension trust | Low | `pdfs.controller.ts:8-20` (+2 copies) |
| 22 | Hard-coded Railway hostname | Low | `next.config.ts:32` |
| 23 | No `.gitattributes` | Low | repo root |

---

## Suggested remediation order

**Week 1 — security**
Fix #1 (auth on writes), #3 (fail closed on `JWT_SECRET`), #4 (role gate).

**Week 1 — unblock CI**
Fix #7 (stale assertion + hanging runner), add a GitHub Actions workflow.

**Week 2 — correctness**
Fix #5 (API 404 JSON envelope + harden `errorHandler`), #6 (mass assignment),
#15 (id lookup), #2 (migrations — highest operational risk of any non-security
item).

**Week 3 — performance**
Fix #13 (caching), #9 (rate limiting), #14 (answer-key leak).

**Week 4 — hygiene**
Fix #11 (shared package), #12 (hero search), #16–#23.

**Backlog**
#8 (zod validation), #10 (helmet + logging) — these touch every route and are
best done alongside a new test suite rather than in isolation.
