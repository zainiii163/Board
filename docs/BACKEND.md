# Backend Report

Express 5 + TypeScript (ESM) API for BoardNotes.

- **Root:** `backend/`
- **Entrypoint:** `backend/src/server.ts`
- **App factory:** `backend/src/app.ts:15-66`
- **Router mount:** `backend/src/app.ts:62`
- **Scale:** 133 `.ts` files, ~12,200 lines

---

## 1. Directory layout

```
backend/
├── .env                     local config (gitignored)
├── .env.example             documented template
├── drizzle.config.ts        drizzle-kit config
├── package.json
├── tsconfig.json            ESM / NodeNext / strict
│
├── public/
│   ├── book-covers/         108 cover images (.webp/.jpg/.png)
│   ├── demo-pdfs/           31 generated sample PDFs
│   └── uploads/             local disk upload target (.gitkeep)
│
├── scripts/
│   └── generate-demo-pdfs.mjs
│
└── src/
    ├── app.ts               createApp()
    ├── server.ts            bootstrap: warn → connect → migrate → seed → listen
    ├── demo-data.ts         static curriculum catalog (~2,100 lines)
    ├── demo-api.test.ts     the only test file
    │
    ├── config/env.ts        single env object + isR2Configured/isProduction
    │
    ├── db/
    │   ├── index.ts         pg Pool + drizzle instance
    │   ├── schema.ts        25 tables + relations (350 lines)
    │   ├── mode.ts          useDb() gate
    │   ├── migrate.ts       runtime migration runner
    │   ├── content-mappers.ts
    │   ├── resolve-content.ts
    │   ├── seed.ts          npm run db:seed
    │   ├── seed-if-empty.ts
    │   ├── seed-content.ts
    │   ├── seed-platform.ts
    │   ├── seed-board-backfill.ts
    │   ├── seed-book-covers.ts
    │   ├── seed-logarithms-enrichment.ts
    │   ├── seed-punjab-variants.ts
    │   ├── seed-subjects-mcqs.ts
    │   └── migrations/      20 .sql files + meta/
    │
    ├── middleware/
    │   ├── auth.middleware.ts
    │   ├── role.middleware.ts
    │   ├── rate-limit.middleware.ts    ← STUB
    │   ├── upload.middleware.ts        ← STUB
    │   └── validate.middleware.ts      ← STUB
    │
    ├── routes/index.ts      mounts all 30 routers
    │
    ├── storage/r2-storage.ts
    ├── store/               in-memory fallback (11 files)
    ├── utils/               api-error, error-handler, jwt, mail, password, slug
    │
    └── modules/             31 module folders (see §4)
```

## 2. Bootstrap sequence

`backend/src/server.ts`

```
:8    const app = createApp()
:10   async function start()
:11-22  production sanity warnings (DATABASE_URL, JWT_SECRET, partial R2)
:24   const dbOk = await initDbMode()          → pool.query("SELECT 1")
:26-33 if (dbOk && env.autoMigrate) applyMigrations()   // failures = warn only
:34-38 if (dbOk) seedIfEmpty()                            // failures = warn only
:39-43 else log "[db] Running in demo memory mode — CMS changes reset on restart."
:45   await seedDefaultUsers()                           // 4 demo accounts
:47-57 app.listen(env.port, cb)                           // logs port/db/storage mode
:60   start();   // note: no .catch()
```

### Failure policy

Migration and seeding failures are **logged and swallowed**. The server always
starts. This is deliberate (zero-infrastructure boot) but means a misconfigured
production database presents as a healthy process with an empty schema.

`createApp()` is deliberately side-effect free — it does not connect, migrate, or
seed. This is what lets `demo-api.test.ts` boot an app without a database.

## 3. Middleware chain

`backend/src/app.ts:15-65`, in order:

| # | Line | Middleware | Notes |
|---|---|---|---|
| 1 | `:18-23` | `cors({ origin: env.corsOrigins, allowedHeaders: ["Content-Type","Authorization"] })` | Comma-split env list. **No `credentials`** |
| 2 | `:24` | `express.json()` | Default 100 KB limit, never configured |
| 3 | `:25-28` | `express.static("public/demo-pdfs")` | |
| 4 | `:29-32` | `express.static("public/book-covers")` | |
| 5 | `:34-49` | `GET /uploads/:filename` | R2 proxy, see below |
| 6 | `:51-54` | `express.static("public/uploads")` | local fallback after R2 |
| 7 | `:55-60` | `GET /` | `{name:"BoardNotes API", message:"Backend is running."}` |
| 8 | `:62` | `app.use("/api", apiRouter)` | |
| 9 | `:63` | `app.use(errorHandler)` | |

**Absent:** no 404 handler, no `helmet`, no compression, no CSRF, no request
logging, no rate limiting.

There is no catch-all after the router, so an unmatched `/api/*` path is handled
by Express 5's built-in `finalhandler` and returns **404 with
`Content-Type: text/html`** and an empty body — verified. `errorHandler` is a
4-arity error middleware and is never invoked in that path. See
[`ISSUES-AND-RISKS.md`](./ISSUES-AND-RISKS.md#5-no-api-404-handler--unmatched-paths-return-html).

### Upload proxy handler

`backend/src/app.ts:34-49`

```ts
if (!filename.toLowerCase().endsWith(".pdf") || filename.includes("..") || filename.includes("/")) {
  return res.status(400).json({ error: "Invalid filename." });
}
if (uploadExistsLocally(filename)) return next();
if (!isR2Enabled()) return next();
const buffer = await readUploadBuffer(filename);
res.setHeader("Content-Type", "application/pdf");
res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
res.send(buffer);
```

Serves local disk first, then R2, then falls through to the static handler.

## 4. Modules

31 module directories; 30 are mounted (`backend/src/routes/index.ts:44-73`).
`modules/catalog/` is **dead code** — never imported.

| Module | Routes file | Purpose |
|---|---|---|
| `audit` | `audit.routes.ts` | Audit log listing + dashboard stats |
| `auth` | `auth.routes.ts` | register / login / logout / me / preferences |
| `authors` | `authors.routes.ts` | Author profiles + linked notes |
| `boards` | `boards.routes.ts` | Public hierarchy reads + board CRUD + chapter ZIP streaming |
| `bookmarks` | `bookmarks.routes.ts` | Per-user saved pages |
| `books` | `books.routes.ts` | Board textbook catalogue + PDF upload |
| `catalog` | `catalog.routes.ts` | **DEAD — not mounted** |
| `categories` | `categories.routes.ts` | Resource category tree |
| `chapters` | `chapters.routes.ts` | Chapter CRUD + publish workflow |
| `classes` | `classes.routes.ts` | Class CRUD |
| `classrooms` | `classrooms.routes.ts` | Teacher classrooms, join codes, assignments, scores |
| `comments` | `comments.routes.ts` | Question comments + moderation queue |
| `contact` | `contact.routes.ts` | Contact form inbox |
| `exams` | `exams.routes.ts` | Exam date schedule |
| `exercises` | `exercises.routes.ts` | Exercise CRUD |
| `formulas` | `formulas.routes.ts` | Read-only formula hub |
| `legal` | `legal.routes.ts` | CMS legal/about pages |
| `mcqs` | `mcqs.routes.ts` | MCQ CRUD |
| `notifications` | *(service only)* | `classroom-updates.service.ts` — chapter-published email |
| `past-papers` | `past-papers.routes.ts` | Past paper catalogue |
| `pdfs` | `pdfs.routes.ts` | PDF listing/upload/deletion, storage info |
| `portal` | `portal.routes.ts` | Nav tree, stats, raw categories (router only, no controller) |
| `progress` | `progress.routes.ts` | Subject progress + flashcard mastery |
| `questions` | `questions.routes.ts` | Question CRUD + solution steps |
| `quiz` | `quiz.routes.ts` | Chapter quizzes, submit, score history |
| `reports` | `reports.routes.ts` | "Report a mistake" tickets |
| `resources` | `resources.routes.ts` | Uploadable resource catalogue |
| `search` | `search.routes.ts` | Cross-entity search |
| `solutions` | `solutions.routes.ts` | **All stubs, no auth** |
| `subjects` | `subjects.routes.ts` | Subject CRUD |
| `test-generator` | `test-generator.routes.ts` | MCQ test paper generation |
| `users` | `users.routes.ts` | Admin-only user management |

Each module follows the same shape:

```
<name>.routes.ts      Router, middleware chain
<name>.controller.ts  HTTP in/out, status codes, validation
<name>.service.ts     useDb() branch → Drizzle OR in-memory store
```

## 5. Error handling

`backend/src/utils/api-error.ts:1-25`

```ts
export class ApiError extends Error {
  statusCode: number;
  static notFound(msg = "Not found.")        // 404
  static badRequest(msg?: string)           // 400
  static unauthorized(msg?: string)         // 401
  static forbidden(msg?: string)            // 403
}
```

No 409 / 422 / 429 factories.

`backend/src/utils/error-handler.ts:4-16`

- `ApiError` → `res.status(err.statusCode).json({ error: err.message })`
- anything else → `console.error(err)` + `500 { error: "Internal server error" }`

The handler does not special-case `express.json()` parse errors (`SyntaxError`
with a `body` property), `MulterError`, or post-`headersSent` failures — the
last of which matters for the chapter ZIP stream.

### Response shape is inconsistent

| Shape | Emitted by |
|---|---|
| `{ error: string }` | `errorHandler`, `authors.controller.ts:29`, `app.ts:37` |
| `{ message: string }` | `boards.controller.ts` inline 404s |
| bare `{}` / `void` | several inline controllers |

Frontend `parseResponse` (`frontend/src/lib/api-client.ts:22-29`) only reads
`data.error`, so `{ message }` errors surface as generic
`API <status>: <path>` strings.

## 6. Validation

**There is no centralised validation layer.** Three middleware files are
unimplemented stubs and are imported nowhere:

| File | Content |
|---|---|
| `src/middleware/validate.middleware.ts:3-6` | `// Placeholder — will use zod for request body validation.` |
| `src/middleware/upload.middleware.ts:6-11` | Defines `ALLOWED_TYPES` / `MAX_SIZE`, then `void`s them |
| `src/middleware/rate-limit.middleware.ts:3-6` | `// Placeholder — will integrate express-rate-limit or similar.` |

Validation is therefore ad-hoc per handler:

- Manual numeric coercion: `users.controller.ts:20,33,48`,
  `reports.controller.ts:29`, `bookmarks.controller.ts:32`,
  `chapters.controller.ts:56,68,78,88,98,108,122,132,142,152`,
  `exercises.controller.ts:9`, `progress.service.ts:277`
- Manual param unwrappers (`asString`): `boards.controller.ts:22`,
  `classes.controller.ts:11`, `chapters.controller.ts:8`, `authors.controller.ts:11`,
  `mcqs.controller.ts:11`, `books.controller.ts:8`, `past-papers.controller.ts:6`,
  `comments.controller.ts:8`, `progress.controller.ts:7`
- Service-layer string/length rules: `auth.service.ts:46-48`,
  `books.service.ts:59-62`, `past-papers.service.ts:82-85`,
  `contact.service.ts:51-53`, `comments.service.ts:59-60`,
  `reports.service.ts:71-72`, `mcqs.service.ts:67-69`, `authors.service.ts:84`,
  `exams.service.ts:54-59`, `chapters.service.ts:352-355,363`

### Mass-assignment exposure

Four services pass the raw request body straight into Drizzle `.set()`:

| Service | Line |
|---|---|
| `boards.service.updateBoard` | `:91` |
| `authors.service.updateAuthor` | `:109` |
| `mcqs.service.updateMcq` | `:88` |
| `legal.service.updateLegalPage` | `:40` |

### File upload validation (multer, three duplicated copies)

| Location | Field | Limit | Filter |
|---|---|---|---|
| `modules/pdfs/pdfs.controller.ts:8-20` | `file` | 10 MB, memoryStorage | mimetype `application/pdf` **or** name ends `.pdf` |
| `modules/books/books.controller.ts:14-26` | `file` | 10 MB, memoryStorage | same |
| `modules/resources/resources.controller.ts:37-49` | `file` | 10 MB, memoryStorage | same |

Plus a secondary size + extension check in `pdfs.service.ts:20-25`. Filenames
are sanitised at `store/pdf-store.ts:54-57`
(`/[^a-zA-Z0-9._-]/g → "-"`) and forced to `.pdf`.

No magic-byte inspection: a non-PDF renamed to `.pdf` passes the filter.

## 7. File storage

### Local disk (default)

- Target: `backend/public/uploads/`
- Served by `express.static` at `app.ts:51-54`
- Registry: `backend/src/store/pdf-store.ts` (`pdfStore`, `readPdfBuffer`,
  `readUploadBuffer`, `uploadExistsLocally`)
- Demo PDFs are protected from deletion via a hard-coded allow-list at
  `pdf-store.ts:23-31`

### Cloudflare R2 (optional)

`backend/src/storage/r2-storage.ts`

| Function | Line | Purpose |
|---|---|---|
| `isR2Enabled()` | `:11` | all 4 env vars present |
| `r2PutPdf()` | `:30` | upload |
| `r2DeletePdf()` | `:41` | delete |
| `r2GetPdfBuffer()` | `:50` | proxy download |
| `r2ListUploads()` | `:61` | enumerate |
| `r2PublicUrl()` | `:77` | build CDN URL |

`region: "auto"` (`:17`), key prefix `uploads/` (`:26-28`). All of
`R2_BUCKET`, `R2_ACCESS_KEY`, `R2_SECRET_KEY`, `R2_ENDPOINT` must be set; a
partial set logs a warning and falls back to local disk.

## 8. Email

`backend/src/utils/mail.ts` — nodemailer, **reads `process.env` directly**
(bypassing `config/env.ts`).

| Function | Line | Trigger |
|---|---|---|
| `smtpConfigured()` | `:13` | `SMTP_HOST` + `SMTP_USER` + `NOTIFY_EMAIL` present |
| transport | `:18-27` | `secure: port === 465` |
| `notifyAdmin()` | `:33` | mistake report, contact form |
| `sendUserMail()` | `:45` | classroom chapter-published notification |

When SMTP is unset, both functions degrade to `console.log`. `SMTP_FROM` falls
back to `SMTP_USER`, then `noreply@boardnotes.com` (`:30`).

## 9. ZIP streaming

`backend/src/modules/boards/chapter-zip.service.ts`

- Loads `archiver` via `createRequire(import.meta.url)` (CJS interop) at `:12-17`
- `zlib: { level: 9 }`
- Attaches its own `archiver` error handler at `:109-115`
- Consumed by `boards.controller.ts:451-455`, which guards on `res.headersSent`

## 10. Data layer

Full schema and migration analysis: [`DATA-MODEL.md`](./DATA-MODEL.md).

### Connection

`backend/src/db/index.ts:9-15`

```ts
const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  max: 5,
  statement_timeout: 5000,
});
export const db = drizzle(pool, { schema });
```

`connectDb()` (`:18-27`) runs `SELECT 1` and returns `false` on any failure.

### Mode gate

`backend/src/db/mode.ts:1-13` — `initDbMode()` probes once at boot; `useDb()`
returns the cached result. Every service branches on this.

### Runtime migrations

`backend/src/db/migrate.ts:21-29` — `applyMigrations()` searches four candidate
paths (`:12-17`) then calls drizzle-kit's `migrate()`.

### Critical migration finding

`backend/src/db/migrations/meta/_journal.json` contains **only 2 entries**:

```json
{ "tag": "0000_talented_juggernaut", "when": 1787204956885 }
{ "tag": "0001_great_sabra",        "when": 1789417361341 }
```

18 further `.sql` files exist on disk (`0001_demo_schema` through
`0017_past_papers_solved_syllabus`) and are **never applied by the migrator**.
Columns added only by those files — `chapters.video_url`,
`chapters.drive_url`, `books.cover_url`, `books.drive_url`,
`past_papers.paper_type` / `drive_url` / `is_solved` / `syllabus`,
`users.email_updates` — are compensated for at runtime by ad-hoc DDL in
`db/seed-if-empty.ts:13-36`, but the **indexes** created in
`0003`–`0007`, `0008`, `0009`, `0010` are not. See
[`ISSUES-AND-RISKS.md`](./ISSUES-AND-RISKS.md#1-migration-journal-is-incomplete).

## 11. Seeding

### Entry points

| Command | File |
|---|---|
| `npm run db:seed` | `backend/src/db/seed.ts` → `seedBoardContent()` |
| automatic at boot | `backend/src/db/seed-if-empty.ts` |

`backend/src/db/seed-if-empty.ts:38-68` orchestrates: if `boards` is empty it
runs the content seed, then platform, regional-board, Punjab-variant,
logarithms-enrichment, book-cover, and subject-MCQ seeds.

| Script | Purpose |
|---|---|
| `seed-content.ts` | Full board → class → subject → chapter → exercise → question → steps from `BOARD_DATA` |
| `seed-platform.ts` | Authors, exams, legal pages, comments, 3 demo MCQs (`:57-98`), demo classroom `FB9MAT` (`:101-125`), demo chapter video (`:127-135`) |
| `seed-board-backfill.ts` | `seedBoardMathematicsBackfill` (`:8`), `seedRegionalBoardContent` (`:102`) |
| `seed-book-covers.ts` | `seedBookCovers` (`:175`), `clearRetiredCovers` (`:166`), `backfillBookPdfs` (`:229`) |
| `seed-logarithms-enrichment.ts` | Formulas/definitions enrichment |
| `seed-punjab-variants.ts` | `seedPunjabVariantBoards` (`:42`), `seedPunjabVariantPastPapers` (`:94`) |
| `seed-subjects-mcqs.ts` | Subject list (`:6-16`) + generated MCQs |

## 12. In-memory fallback stores

`backend/src/store/`

| File | Exports |
|---|---|
| `memory-store.ts` | `ensureMemorySeed()` (`:64`) creates 4 demo users; `memoryStore.{users,reports,contacts,bookmarks,audit}` (`:108`) |
| `cms-store.ts` (28 KB) | `CmsChapterRecord`, `CmsExerciseRecord`, `CmsQuestionRecord`, `CmsBoardRecord`, `CmsClassRecord`, `CmsSubjectRecord`, `CmsMcq`, `QuizScoreRecord`; `cmsStore` (`:253`); `getCmsBoardData` (`:852`) |
| `chapter-publish.ts` | `chapterStatus` Map keyed `board/class/subject/chapter`; `getChapterPublishStatus`, `setChapterPublishStatus`, `isChapterPublished`, `initChapterPublishStatus` |
| `portal-store.ts` (43 KB) | `portalStore` (`:702`) — categories + resources with `listResources`/`getLatest`/`getTrending`/`getRelated`/`createResource`/`updateResource`/`deleteResource`/`incrementDownloads`/`stats` |
| `resources-store.ts` | `resourcesStore` (`:144`), `sortPastPapers` (`:30`), `PAPER_TYPE_RANK` (`:22`), `boardMeta`, `subjectMeta` |
| `pdf-store.ts` | `pdfStore` (`:150`), `readUploadBuffer` (`:185`), `readPdfBuffer` (`:195`), `uploadExistsLocally` (`:217`), demo allow-list (`:23-31`) |
| `authors-store.ts` | Author demo dataset |
| `classrooms-store.ts` | Classroom demo dataset |
| `comments-store.ts` | Comment demo dataset |
| `exams-store.ts` | Exam date dataset |
| `legal-store.ts` | Legal page dataset |

`backend/src/demo-data.ts` supplies the static catalog:
`BOARD_LIST` (`:60`), `BOARD_DATA` (`:67`), `sortSubjects` (`:1855`),
`classNumberFromSlug` (`:1871`), `sortClasses` (`:1877`),
`sortBoardHierarchy` (`:1891`), `getBoardBySlug` (`:1920`),
`getBoardCatalogSummaries` (`:1928`), `getQuestionData` (`:1990`),
`SEARCH_RESULTS` (`:2015`), `BOOKS` (`:2081`), `PAST_PAPERS` (`:2096`).

## 13. Build & run

| Script | Command |
|---|---|
| `dev` | `tsx watch src/server.ts` |
| `build` | `tsc -p tsconfig.json` → `dist/` |
| `start` | `node dist/server.js` |
| `test` | `tsx --test src/demo-api.test.ts` |
| `db:generate` | `drizzle-kit generate` |
| `db:migrate` | `drizzle-kit migrate` |
| `db:seed` | `tsx src/db/seed.ts` |

`tsconfig.json`: `strict: true`, `module: NodeNext`, `target: ES2022`,
`rootDir: src`, `outDir: dist`.

Docker image (`Dockerfile`): `node:20-alpine`, workspace `npm ci`, globally
installed `tsc`, `EXPOSE 4000`, `CMD ["node","backend/dist/server.js"]`. It
does **not** run migrations and does **not** build the frontend.

## 14. Notable backend findings

1. **Migration journal is incomplete** — 18 of 20 SQL files never run
   (`migrations/meta/_journal.json`).
2. **Unauthenticated write endpoints** — `POST`/`PUT`/`DELETE /api/solutions/*`
   (`modules/solutions/solutions.routes.ts:7-9`) and
   `POST /api/test-generator/generate`
   (`modules/test-generator/test-generator.routes.ts:6`).
3. **Any signed-in user, including students, can create resources** —
   `POST /api/resources` uses only `requireAuth`
   (`modules/resources/resources.routes.ts:14`).
4. **No API 404 handler** — unmatched `/api/*` returns an HTML 404, not JSON.
5. **Mass assignment** in four service update paths.
6. **No rate limiting** and **no validation middleware** — stubs only.
7. **Hardcoded demo credentials** auto-created on every boot
   (`modules/auth/auth.service.ts:158-190`); production starts even with
   `JWT_SECRET="change-me"` (warning only, `server.ts:11-22`).
8. **Dead code** — `modules/catalog/` is never mounted.
9. **User-id ordering divergence** between memory store (id 3 = student,
   id 4 = teacher, `store/memory-store.ts:64-106`) and DB seed order
   (3 = teacher, 4 = student), hardcoded at
   `modules/classrooms/classrooms.service.ts:172-174,273`.
10. **Test suite is failing and hangs** — `src/demo-api.test.ts:19` expects 6
    boards but the catalogue now has 8; the runner never exits.
11. **No backend lint script** — root `npm run lint` only targets the frontend.

Full detail and remediation: [`ISSUES-AND-RISKS.md`](./ISSUES-AND-RISKS.md).
