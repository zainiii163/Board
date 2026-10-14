# Data Model

Schema, migrations, dual-mode data layer, and the shared type contract.

- **ORM:** Drizzle `^0.45.2`, dialect `postgresql` (`backend/drizzle.config.ts:11`)
- **Driver:** `pg` ^8.23.0 (node-postgres)
- **Schema file:** `backend/src/db/schema.ts` (350 lines, 25 tables)
- **Migrations:** `backend/src/db/migrations/` (20 `.sql` files)

---

## 1. Connection

`backend/src/db/index.ts:9-15`

```ts
const pool = new pg.Pool({
  connectionString: DATABASE_URL,   // default postgresql://postgres:postgres@localhost:5433/boardnotes
  max: 5,
  statement_timeout: 5000,
});
export const db = drizzle(pool, { schema });
```

`connectDb()` (`:18-27`) runs `SELECT 1` and returns `false` on any failure.

`isDbConfigured` (`:16`) reports whether `DATABASE_URL` is set.

## 2. Dual-mode architecture

`backend/src/db/mode.ts:1-13`

```ts
let dbAvailable: boolean | null = null;

export async function initDbMode() { dbAvailable = await connectDb(); return dbAvailable; }
export function useDb() { return dbAvailable === true; }
```

Every service branches:

```ts
export async function listChapters(...) {
  if (useDb()) { /* Drizzle queries */ }
  return cmsStore.listChapters(...);   // in-memory fallback
}
```

| Condition | Behaviour | Persistence |
|---|---|---|
| `DATABASE_URL` set and reachable | Drizzle/PostgreSQL | **Durable** — admin CMS edits survive restarts |
| `DATABASE_URL` unset or unreachable | `src/store/*` + `src/demo-data.ts` | **Ephemeral** — resets on every restart |

Startup log line (`server.ts:39-43`):
`[db] Running in demo memory mode — CMS changes reset on restart.`

## 3. Entity-relationship diagram

```
                    ┌──────────┐
                    │  boards  │  slug UNIQUE
                    └────┬─────┘
                         │ board_id
                    ┌────▼─────┐
                    │ classes  │  (board_id, slug)
                    └────┬─────┘
                         │ class_id
                    ┌────▼─────┐
                    │ subjects │  (class_id, slug)
                    └────┬─────┘
                         │ subject_id
                    ┌────▼───────────┐
              ┌────►│    chapters    │  (subject_id, slug, status)
              │     └────┬───────────┘
              │          │ chapter_id
   classrooms │     ┌────▼─────┐
   (by slug)  │     │ exercises│  (chapter_id, slug)
              │     └────┬─────┘
              │          │ exercise_id
              │     ┌────▼─────┐          ┌────────────────┐
              │     │questions │─────────►│ solution_steps │
              │     └──────────┘ question │ (question_id,  │
              │                            │  step_order)   │
              │                            └────────────────┘
              │     ┌──────────────────┐
              └────►│ mcqs            │  chapter_key TEXT (not FK)
                    └──────────────────┘

  users ──┬── bookmarks          (user_id → users.id)
          ├── audit_logs         (user_id → users.id)
          ├── question_comments  (user_id → users.id, status)
          ├── quiz_scores        (user_id → users.id, chapter_key)
          ├── user_progress      (user_id → users.id, subject_key)
          ├── flashcard_progress (user_id → users.id, chapter_key)
          └── classroom_members  (user_id → users.id, CASCADE)

  classrooms ──┬── classroom_members     (classroom_id CASCADE, user_id CASCADE)
                └── classroom_assignments (classroom_id CASCADE)

  Standalone (slug-keyed, no FK): books, past_papers, authors, exam_dates
  Standalone (no FK): reports, contact_messages, legal_pages
```

## 4. Table reference

### 4.1 Content hierarchy

**`boards`** — `schema.ts:5`

| Column | Type | Constraints |
|---|---|---|
| `id` | serial | PK |
| `slug` | text | **UNIQUE**, NOT NULL |
| `title` | text | NOT NULL |

**`classes`** — `schema.ts:11`

| Column | Type | Constraints |
|---|---|---|
| `id` | serial | PK |
| `board_id` | int | NOT NULL → `boards.id` |
| `slug` | text | NOT NULL |
| `title` | text | NOT NULL |

**`subjects`** — `schema.ts:18`

| Column | Type | Constraints |
|---|---|---|
| `id` | serial | PK |
| `class_id` | int | NOT NULL → `classes.id` |
| `slug` | text | NOT NULL |
| `title` | text | NOT NULL |

**`chapters`** — `schema.ts:25`

| Column | Type | Constraints |
|---|---|---|
| `id` | serial | PK |
| `subject_id` | int | NOT NULL → `subjects.id` |
| `slug` | text | NOT NULL |
| `title` | text | NOT NULL |
| `summary` | text | NOT NULL |
| `summary_ur` | text | NULL |
| `formulas` | jsonb `string[]` | DEFAULT `[]`, NOT NULL |
| `formulas_ur` | jsonb `string[]` | DEFAULT `[]`, NOT NULL |
| `definitions` | jsonb `{term,definition,termUr?,definitionUr?}[]` | DEFAULT `[]`, NOT NULL |
| `video_url` | text | NULL |
| `drive_url` | text | NULL |
| `status` | text `ContentStatus` | DEFAULT `'published'`, NOT NULL |

**`exercises`** — `schema.ts:43`

| Column | Type | Constraints |
|---|---|---|
| `id` | serial | PK |
| `chapter_id` | int | NOT NULL → `chapters.id` |
| `slug` | text | NOT NULL |
| `title` | text | NOT NULL |

**`questions`** — `schema.ts:50`

| Column | Type | Constraints |
|---|---|---|
| `id` | serial | PK |
| `exercise_id` | int | NOT NULL → `exercises.id` |
| `num` | int | NOT NULL |
| `question_text` | text | NOT NULL |
| `question_text_ur` | text | NULL |
| `marks` | int | NOT NULL |
| `difficulty` | text | NOT NULL |
| `pdf_name` | text | NULL |
| `steps_ur` | jsonb `{title,content}[]` | DEFAULT `[]`, NOT NULL |

**`solution_steps`** — `schema.ts:62`

| Column | Type | Constraints |
|---|---|---|
| `id` | serial | PK |
| `question_id` | int | NOT NULL → `questions.id` |
| `step_order` | int | NOT NULL |
| `title` | text | NOT NULL |
| `content` | text | NOT NULL |

### 4.2 Identity & engagement

**`users`** — `schema.ts:122`

| Column | Type | Constraints |
|---|---|---|
| `id` | serial | PK |
| `name` | text | NOT NULL |
| `email` | text | **UNIQUE**, NOT NULL |
| `password_hash` | text | NOT NULL |
| `role` | text `UserRole` | DEFAULT `'student'`, NOT NULL |
| `email_updates` | boolean | DEFAULT `false`, NOT NULL |
| `created_at` | timestamptz | DEFAULT `now()`, NOT NULL |

**`reports`** — `schema.ts:132`

| Column | Type | Constraints |
|---|---|---|
| `id` | serial | PK |
| `page_url` | text | NOT NULL |
| `board_slug` | text | NULL |
| `question_ref` | text | NULL |
| `message` | text | NOT NULL |
| `status` | text `'open' \| 'resolved'` | DEFAULT `'open'`, NOT NULL |
| `created_at` | timestamptz | DEFAULT `now()`, NOT NULL |

**`contact_messages`** — `schema.ts:142`

| Column | Type | Constraints |
|---|---|---|
| `id` | serial | PK |
| `name` | text | NOT NULL |
| `email` | text | NOT NULL |
| `message` | text | NOT NULL |
| `created_at` | timestamptz | |

**`bookmarks`** — `schema.ts:150`

| Column | Type | Constraints |
|---|---|---|
| `id` | serial | PK |
| `user_id` | int | NOT NULL → `users.id` |
| `title` | text | NOT NULL |
| `path` | text | NOT NULL |
| `created_at` | timestamptz | |

**`audit_logs`** — `schema.ts:158`

| Column | Type | Constraints |
|---|---|---|
| `id` | serial | PK |
| `user_id` | int | NOT NULL → `users.id` |
| `action` | text | NOT NULL |
| `target` | text | NOT NULL |
| `created_at` | timestamptz | |

### 4.3 Catalogue (slug-keyed, no FKs)

**`books`** — `schema.ts:185`

`id`, `board_slug`, `board_title`, `class_slug`, `class_title` (NOT NULL),
`subject_slug?`, `subject_title?`, `title` (NOT NULL),
`price_label` DEFAULT `'Free PDF'`, `cover_url?`, `pdf_url?`, `drive_url?`,
`notes_path?`

**`past_papers`** — `schema.ts:201`

`id`, `board_slug`, `board_title`, `class_slug`, `class_title`, `subject_slug?`,
`subject_title?`, `year` (NOT NULL),
`session_type` ∈ `'annual' \| 'supply'` DEFAULT `'annual'`,
`paper_type` ∈ `'model' \| 'first-annual' \| 'second-annual' \| 'pba'`
DEFAULT `'first-annual'`, `is_solved` boolean DEFAULT `false`,
`syllabus` ∈ `'new' \| 'old'` DEFAULT `'new'`, `pdf_url?`, `drive_url?`

**`authors`** — `schema.ts:221`

`id`, `slug` **UNIQUE**, `name`, `title`, `bio` (NOT NULL),
`boards` jsonb `string[]` DEFAULT `[]`, `note_count` int DEFAULT `0`

**`exam_dates`** — `schema.ts:242`

`id`, `board_slug`, `board_title`, `class_slug`, `class_title`, `title`,
`exam_date` timestamptz NOT NULL

### 4.4 Community & learning

**`question_comments`** — `schema.ts:231`

| Column | Type | Constraints |
|---|---|---|
| `id` | serial | PK |
| `user_id` | int | NOT NULL → `users.id` |
| `user_name` | text | NOT NULL |
| `page_path` | text | NOT NULL |
| `question_ref` | text | DEFAULT `''`, NOT NULL |
| `body` | text | NOT NULL |
| `status` | text `'pending' \| 'approved' \| 'rejected'` | DEFAULT `'pending'`, NOT NULL |
| `created_at` | timestamptz | |

**`legal_pages`** — `schema.ts:252`

| Column | Type | Constraints |
|---|---|---|
| `slug` | text | **PK** (not serial) |
| `content` | jsonb `Record<string, unknown>` | NOT NULL |

**`mcqs`** — `schema.ts:257`

| Column | Type | Constraints |
|---|---|---|
| `id` | serial | PK |
| `chapter_key` | text | NOT NULL — `"board/class/subject/chapter"` |
| `question` | text | NOT NULL |
| `options` | jsonb `{label,text}[]` | DEFAULT `[]`, NOT NULL |
| `correct_label` | text | NOT NULL |
| `reason` | text | DEFAULT `''`, NOT NULL |

**`quiz_scores`** — `schema.ts:266`

`id`, `user_id` → `users.id`, `chapter_key` text, `score` int, `total` int,
`created_at` timestamptz

**`user_progress`** — `schema.ts:275`

`id`, `user_id` → `users.id`, `subject_key` text, `subject_label` text,
`visited_chapters` jsonb `string[]` DEFAULT `[]`, `total_chapters` int DEFAULT `0`,
`last_path` text DEFAULT `''`, `last_label` text DEFAULT `''`, `updated_at` timestamptz

**`flashcard_progress`** — `schema.ts:287`

`id`, `user_id` → `users.id`, `chapter_key` text,
`mastered_indices` jsonb `number[]` DEFAULT `[]`, `updated_at` timestamptz

### 4.5 Classrooms

**`classrooms`** — `schema.ts:295`

`id`, `teacher_user_id` → `users.id`, `name`, `join_code` **UNIQUE**,
`board_slug`, `class_slug`, `subject_slug`, `created_at`

**`classroom_members`** — `schema.ts:306`

`id`, `classroom_id` → `classrooms.id` **ON DELETE CASCADE**,
`user_id` → `users.id` **ON DELETE CASCADE**, `joined_at`

**`classroom_assignments`** — `schema.ts:313`

`id`, `classroom_id` → `classrooms.id` **ON DELETE CASCADE**,
`title`, `exercise_path`, `due_date` timestamptz NULL, `created_at`

## 5. Drizzle relations

| Range | Relations |
|---|---|
| `schema.ts:71-120` | board → classes → subjects → chapters → exercises → questions → solution_steps |
| `schema.ts:166-183` | user → bookmarks, user → auditLogs |
| `schema.ts:322-343` | classroom → members, classroom → assignments |
| `schema.ts:345-350` | quizScore → user |

## 6. Composite key convention

Several subsystems key content by a slash-delimited string rather than a
foreign key, so data can be addressed by URL without a join:

| Subsystem | Column | Shape |
|---|---|---|
| MCQs | `mcqs.chapter_key` | `board/class/subject/chapter` |
| Quiz | `quiz_scores.chapter_key` | `board/class/subject/chapter` |
| Flashcards | `flashcard_progress.chapter_key` | `board/class/subject/chapter` |
| Progress | `user_progress.subject_key` | `board/class/subject` |
| Quiz validation | — | must be exactly 4 parts (`quiz.controller`) |
| Classroom scoping | `board_slug`/`class_slug`/`subject_slug` | 3 separate columns |

## 7. Migrations

### Files on disk

`backend/src/db/migrations/`

| File | Journaled? | Contents |
|---|---|---|
| `0000_talented_juggernaut.sql` | ✅ | boards, classes, subjects, chapters, exercises, questions, solution_steps + FKs |
| `0001_great_sabra.sql` | ✅ | 20 tables (users, reports, contact_messages, bookmarks, audit_logs, books, past_papers, authors, question_comments, exam_dates, legal_pages, mcqs, quiz_scores, user_progress, flashcard_progress, classrooms, classroom_members, classroom_assignments) + bilingual columns + user FKs |
| `meta/0000_snapshot.json` | ✅ | Drizzle snapshot |
| `meta/0001_snapshot.json` | ✅ | Drizzle snapshot |
| `meta/_journal.json` | ✅ | **Only 2 entries** |
| `0001_demo_schema.sql` | ❌ | legacy demo schema |
| `0002_auth_platform.sql` | ❌ | legacy auth/platform |
| `0003_chapter_status.sql` | ❌ | `chapters.status` |
| `0004_resources.sql` | ❌ | resource tables |
| `0005_bilingual.sql` | ❌ | `*_ur` columns |
| `0006_definitions.sql` | ❌ | `chapters.definitions` |
| `0007_platform_cms.sql` | ❌ | CMS tables + indexes |
| `0008_quiz_progress.sql` | ❌ | quiz/progress tables + **unique constraints + indexes** |
| `0009_flashcard_progress.sql` | ❌ | flashcard table + **unique + indexes** |
| `0010_classrooms.sql` | ❌ | classroom tables + **indexes** |
| `0011_chapter_video.sql` | ❌ | `chapters.video_url` |
| `0012_email_updates.sql` | ❌ | `users.email_updates` |
| `0013_books_cover_url.sql` | ❌ | `books.cover_url` |
| `0014_past_papers_paper_type.sql` | ❌ | `past_papers.paper_type` |
| `0015_books_drive_url.sql` | ❌ | `books.drive_url` |
| `0016_chapters_drive_url.sql` | ❌ | `chapters.drive_url` |
| `0017_past_papers_solved_syllabus.sql` | ❌ | `past_papers.is_solved`, `syllabus` |

### Runtime migration runner

`backend/src/db/migrate.ts:21-29` — `applyMigrations()` searches four candidate
paths (`:12-17`) then calls drizzle-kit's `migrate()`. Called from
`server.ts:29` when `env.autoMigrate` is true and the DB is reachable; failures
are warned, never fatal (`server.ts:30-32`).

### Consequence of the incomplete journal

1. **Columns** added only by `0011`–`0017` are **not** created by the migrator.
   They are compensated for at runtime by ad-hoc DDL in
   `backend/src/db/seed-if-empty.ts:13-36` (`ensurePastPaperColumns()`), which
   runs only when `useDb()` is true.
2. **Indexes** created in `0003`–`0007`, `0008`, `0009`, `0010` are **not**
   created at all. Missing:
   `question_comments_page_path_idx`, `question_comments_status_idx`,
   `mcqs_chapter_key_idx`, `quiz_scores_user_id_idx`,
   `quiz_scores_chapter_key_idx`, `user_progress_user_id_idx`,
   `flashcard_progress_user_id_idx`, `classrooms_teacher_idx`,
   `classrooms_join_code_idx`, `classroom_members_user_idx`.
3. **Unique constraints** on `user_progress (user_id, subject_key)` and
   `flashcard_progress (user_id, chapter_key)` exist only in
   `0008_quiz_progress.sql:22,27` and `0009_flashcard_progress.sql:9,12` —
   they are **absent from `schema.ts`**, so Drizzle cannot model or migrate
   them, and `drizzle-kit generate` could emit conflicting DDL.

### Commands

| Command | Effect |
|---|---|
| `npm run db:generate -w backend` | `drizzle-kit generate` — diffs `schema.ts` against snapshots |
| `npm run db:migrate -w backend` | `drizzle-kit migrate` — applies journaled migrations |
| `npm run db:seed -w backend` | `tsx src/db/seed.ts` → `seedBoardContent()` |

## 8. Schema helpers

| File | Exports |
|---|---|
| `db/content-mappers.ts` | `mapChapterRow` (`:29`), `mapExerciseRow` (`:52`), `mapQuestionRow` (`:65`) — flatten DB rows into CMS DTOs |
| `db/resolve-content.ts` | `resolveSubjectId` (`:6`), `resolveChapterId` (`:16`), `resolveExerciseId` (`:26`), `findQuestionById` (`:33`), `findExerciseBySlug` (`:40`) |

## 9. In-memory fallback layer

When PostgreSQL is unavailable every service falls back to these stores.
Full inventory in [`BACKEND.md`](./BACKEND.md#12-in-memory-fallback-stores).

| Store | Domain |
|---|---|
| `store/memory-store.ts` | users, reports, contacts, bookmarks, audit |
| `store/cms-store.ts` | boards, classes, subjects, chapters, exercises, questions |
| `store/chapter-publish.ts` | chapter publish status map |
| `store/portal-store.ts` | categories + resources |
| `store/resources-store.ts` | books + past papers |
| `store/pdf-store.ts` | PDF registry + demo allow-list |
| `store/authors-store.ts` | authors |
| `store/classrooms-store.ts` | classrooms |
| `store/comments-store.ts` | comments |
| `store/exams-store.ts` | exam dates |
| `store/legal-store.ts` | legal pages |

### Divergence risk

The memory store creates demo users in a **different id order** than the DB
seed:

| id | `store/memory-store.ts:64-106` | DB seed (`seed-platform.ts` / `auth.service.ts`) |
|---|---|---|
| 1 | admin | admin |
| 2 | editor | editor |
| 3 | **student** | **teacher** |
| 4 | **teacher** | **student** |

This ordering is hard-coded in `modules/classrooms/classrooms.service.ts:172-174,273`,
so classroom lookups can resolve the wrong user depending on the active mode.
See [`ISSUES-AND-RISKS.md`](./ISSUES-AND-RISKS.md#9-user-id-ordering-divergence).

## 10. Shared package

`shared/package.json`

```json
{
  "name": "@boardnotes/shared",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts"
    }
  }
}
```

Ships **raw TypeScript** — no build step, no `dist`, no `main`. Zero runtime
values: types only.

### `shared/src/index.ts` — 178 lines

| Lines | Section | Types |
|---|---|---|
| 1–17 | Enums & literals | `ContentDifficulty`, `QuestionType`, `ContentStatus`, `UserRole`, `SearchResultType` |
| 19–25 | API health | `ApiHealth` |
| 27–75 | Core hierarchy | `BoardSummary`, `ClassSummary`, `SubjectSummary`, `ChapterSummary`, `ExerciseSummary`, `QuestionSummary` |
| 77–91 | Question content | `SolutionStep`, `QuestionContent` |
| 93–113 | Search / PDFs | `SearchResult`, `PdfSummary` |
| 115–120 | MCQ | `McqOption` |
| 122–130 | User | `UserSummary` |
| 132–178 | Audit + remaining | `AuditEntry`, `AuthResponse`, `ReportTicket`, `ContactMessage`, `Bookmark`, `DashboardStats` |

```ts
export type ContentDifficulty = "easy" | "medium" | "hard";                    // :3
export type QuestionType = "mcq" | "short" | "long" | "proof" | "numerical" | "construction"; // :5-11
export type ContentStatus = "draft" | "in_review" | "published" | "archived";   // :13
export type UserRole = "admin" | "editor" | "teacher" | "student";            // :15
export type SearchResultType = "chapter" | "exercise" | "question" | "paper";  // :17
```

### Consumption

**Backend imports `@boardnotes/shared` in 14 places** — all `import type`:

| File:Line | Imported |
|---|---|
| `backend/src/utils/jwt.ts:4` | `UserRole` |
| `backend/src/db/schema.ts:3` | `UserRole` |
| `backend/src/db/schema.ts:40` | `ContentStatus` (inline `import(...)`) |
| `backend/src/store/chapter-publish.ts:1` | `ContentStatus` |
| `backend/src/store/cms-store.ts:1` | `ContentStatus` |
| `backend/src/store/memory-store.ts:1` | `UserRole` |
| `backend/src/db/content-mappers.ts:1` | `ContentStatus` |
| `backend/src/modules/users/users.controller.ts:2` | `UserRole` |
| `backend/src/modules/search/search.service.ts:1` | `SearchResult` |
| `backend/src/middleware/role.middleware.ts:2` | `UserRole` |
| `backend/src/modules/auth/auth.service.ts:2` | `UserRole` |
| `backend/src/modules/chapters/chapters.service.ts:1` | `ContentStatus` |
| `backend/src/modules/chapters/chapters.controller.ts:2` | `ContentStatus` |

**Frontend imports 0.** It uses a byte-identical hand copy at
`frontend/src/lib/shared-types.ts` (also 3,289 bytes / 178 lines), imported via
the `@/lib/shared-types` alias at 15 call sites:

| File:Line | Imported |
|---|---|
| `frontend/src/lib/auth-context.tsx:12` | `AuthResponse`, `UserSummary` |
| `frontend/src/app/(public)/search/page.tsx:1` | `SearchResult` |
| `frontend/src/app/(public)/account/page.tsx:10` | `Bookmark` |
| `frontend/src/app/(public)/[board]/[classSlug]/[subject]/[chapter]/[exercise]/page.tsx:3` | `PdfSummary` |
| `frontend/src/app/(public)/[board]/[classSlug]/[subject]/[chapter]/[exercise]/q/[questionNum]/page.tsx:2` | `PdfSummary` |
| `frontend/src/app/(admin)/admin/page.tsx:9` | `ContentStatus`, `DashboardStats` |
| `frontend/src/app/(admin)/admin/users/page.tsx:6` | `UserRole`, `UserSummary` |
| `frontend/src/app/(admin)/admin/chapters/page.tsx:8` | `ContentStatus` |
| `frontend/src/app/(admin)/admin/audit-log/page.tsx:6` | `AuditEntry` |
| `frontend/src/app/(admin)/admin/reports/page.tsx:6` | `ReportTicket` |
| `frontend/src/app/(admin)/admin/contact/page.tsx:6` | `ContactMessage` |
| `frontend/src/app/(admin)/admin/content-review/page.tsx:6` | `ContentStatus` |
| `frontend/src/components/admin/board-coverage-panel.tsx:7` | `ContentStatus` |
| `frontend/src/components/content/search-page-content.tsx:5` | `SearchResult` |
| `frontend/src/components/content/question-page-view.tsx:4` | `PdfSummary` |

`frontend/tsconfig.json` has no `paths` entry for `@boardnotes/shared` and
`frontend/package.json` does not declare it as a dependency.

### Inconsistency inside the contract

`shared/src/index.ts:87` types `QuestionContent.difficulty` as plain `string`,
while `ContentDifficulty` (`:3`) exists and is unused there. The DB column
`questions.difficulty` is likewise plain `text`.

## 11. Demo catalog

`backend/src/demo-data.ts` (~2,100 lines)

| Export | Line |
|---|---|
| `BOARD_LIST` | `:60` |
| `BOARD_DATA` | `:67` |
| `sortSubjects` | `:1855` |
| `classNumberFromSlug` | `:1871` |
| `sortClasses` | `:1877` |
| `sortBoardHierarchy` | `:1891` |
| `getBoardBySlug` | `:1920` |
| `getBoardCatalogSummaries` | `:1928` |
| `getQuestionData` | `:1990` |
| `SEARCH_RESULTS` | `:2015` |
| `BOOKS` | `:2081` |
| `PAST_PAPERS` | `:2096` |

Demo boards: `fbise`, `punjab`, `kpk`, `sindh`, `oxford`, `cambridge`.

### Static assets

| Path | Count |
|---|---|
| `backend/public/book-covers/` | 108 images |
| `backend/public/demo-pdfs/` | 31 PDFs |
| `backend/public/uploads/` | `.gitkeep` |
