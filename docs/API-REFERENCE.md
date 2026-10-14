# API Reference

Complete HTTP reference for the BoardNotes API.

- **Base URL (dev):** `http://localhost:4000`
- **API mount point:** `/api` — `backend/src/app.ts:62`
- **Router mounts:** `backend/src/routes/index.ts:44-73`
- **Content type:** JSON unless noted (uploads use `multipart/form-data`)

## Auth legend

| Code | Meaning | Middleware |
|---|---|---|
| **—** | Public | none |
| **A** | Any signed-in user | `requireAuth` |
| **AE** | Admin + Editor | `requireRole("admin","editor")` |
| **AET** | Admin + Editor + Teacher | `requireRole("admin","editor","teacher")` |
| **ADM** | Admin only | `requireRole("admin")` |

Authenticated requests send `Authorization: Bearer <token>`.

## Status codes used

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Validation failure / bad request |
| 401 | Missing or invalid token (`"Please sign in to continue."` / `"Session expired. Please sign in again."`) |
| 403 | Authenticated but insufficient role (`"You do not have permission for this action."`) |
| 404 | Not found |
| 500 | Unhandled error — `{ "error": "Internal server error" }` |

⚠️ Error bodies are inconsistent: `errorHandler` and some controllers emit
`{ error }`, `boards.controller.ts` emits `{ message }`. The frontend
`parseResponse` only reads `data.error`.

---

## 1. Root & static

| Method | Path | Auth | Response |
|---|---|---|---|
| GET | `/` | — | `{ name: "BoardNotes API", message: "Backend is running." }` — `app.ts:55` |
| GET | `/api/health` | — | `{ status: "ok", service: "boardnotes-backend", timestamp }` — `routes/index.ts:36` |
| GET | `/demo-pdfs/*` | — | Static, `express.static` — `app.ts:25-28` |
| GET | `/book-covers/*` | — | Static, `express.static` — `app.ts:29-32` |
| GET | `/uploads/:filename` | — | PDF; local disk first, then R2 proxy. `400 { error: "Invalid filename." }` for non-`.pdf`, `..`, or `/` — `app.ts:34-49` |
| GET | `/uploads/*` | — | Static fallback — `app.ts:51-54` |

---

## 2. Auth — `/api/auth`

Source: `backend/src/modules/auth/auth.routes.ts`

| Method | Path | Auth | Body / Params | Response |
|---|---|---|---|---|
| POST | `/api/auth/register` | — | `{ name, email, password }` | `201 { user: PublicUser, token }`. 400 on name<2, invalid email, password<6, duplicate email. Role always forced to `student` (`auth.controller.ts:10`) |
| POST | `/api/auth/login` | — | `{ email, password }` | `200 { user, token }`. 400 if missing, 401 `"Invalid email or password."` |
| POST | `/api/auth/logout` | — | — | `200 { loggedOut: true }` (stateless no-op) |
| GET | `/api/auth/me` | A | — | `200 { user }` |
| PATCH | `/api/auth/preferences` | A | `{ emailUpdates: boolean }` | `200 { user }` |

```ts
type PublicUser = { id, name, email, role, emailUpdates }  // auth.service.ts:12-18
```

---

## 3. Boards — `/api/boards`

Source: `backend/src/modules/boards/boards.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/boards` | — | Default: `{slug,title,classCount,chapterCount,ready}[]`. With `?full=1`: `{id,slug,title,classCount}[]` |
| GET | `/api/boards/:slug` | — | Board + classes → subjects → chapters → exercises (published chapters only). 404 `{message:"Board not found"}` |
| GET | `/api/boards/:slug/classes/:classSlug` | — | `{board, class:{..., subjects}}`. 404 |
| GET | `/api/boards/:slug/classes/:classSlug/subjects/:subject` | — | `{board, class, subject:{..., chapters (published)}}`. 404 |
| GET | `/api/boards/:slug/classes/:classSlug/subjects/:subject/chapters/:chapter` | — | `{board,class,subject,chapter}`. 404 if not published |
| GET | `…/chapters/:chapter/zip/info` | — | `{chapterTitle, pdfCount, filenames[], downloadPath}`. 404 |
| GET | `…/chapters/:chapter/zip` | — | Streams `application/zip` via archiver. 404 if `pdfCount === 0` |
| GET | `…/chapters/:chapter/exercises/:exercise` | — | `{board,class,subject,chapter, exercise:{slug,title,questions:[{num,question}]}}`. 404 |
| GET | `…/exercises/:exercise/q/:questionNum` | — | `questionNum` defaults to `3` (`boards.controller.ts:339`). Returns `{board,class,subject,chapter,exercise,question:{num,question,questionUr?,marks,difficulty,pdfName,steps:[{title,content}],stepsUr?}}`. 404 |
| POST | `/api/boards` | AE | `{slug, title}` → `201 {id,slug,title,classCount}`; 400 if missing or duplicate |
| PUT | `/api/boards/:slug` | AE | `Partial<{title}>` → 200; 404 |
| DELETE | `/api/boards/:slug` | AE | → `200 {deleted:true}`; 400 `"Board not found or still has classes."` |

---

## 4. Classes — `/api/classes`

Source: `backend/src/modules/classes/classes.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/classes` | — | `[{id, boardSlug, boardTitle, slug, title, subjectCount}]` |
| GET | `/api/classes/:slug` | — | `{id, boardSlug, boardTitle, slug, title, subjectCount, subjects:[{slug,title,chapterCount}]}`; 404 |
| POST | `/api/classes` | AET | `{boardSlug, title, slug?}` → 201; 400 |
| PUT | `/api/classes/:slug` | AET | `Partial<{title}>` → 200; 404 |
| DELETE | `/api/classes/:slug` | AE | 400 `"Remove all subjects before deleting this class."` |

---

## 5. Subjects — `/api/subjects`

Source: `backend/src/modules/subjects/subjects.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/subjects` | — | Accepts `?classId=<number>` **or** `?board=&class=`. Returns `[{id, boardSlug, boardTitle, classSlug, classTitle, slug, title, chapterCount}]` |
| GET | `/api/subjects/:slug` | — | Board-less resolution; prefers `fbise` / class `9` (`subjects.service.ts:109-113`). Returns record + `chapters:[{slug,title,summary,summaryUr,formulas,formulasUr,status}]`; 404 |
| POST | `/api/subjects` | AET | `{boardSlug, classSlug, title, slug?}` → 201; 400 |
| PUT | `/api/subjects/:slug` | AET | `Partial<{title}>`; 404 |
| DELETE | `/api/subjects/:slug` | AE | 400 `"Remove all chapters before deleting this subject."` |

---

## 6. Chapters — `/api/chapters`

Source: `backend/src/modules/chapters/chapters.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/chapters` | **conditional** | With `?board=&class=&subject=` → public `listPublic`. Otherwise runs `requireAuth` + `requireRole("admin","editor","teacher")` inline (`routes.ts:17-23`) → CMS list. `?status=` filters |
| GET | `/api/chapters/:slug` | — | Searches `listChapters()` by slug; 200 record; 404 |
| POST | `/api/chapters` | AET | `{boardSlug, classSlug, subjectSlug, title, summary, summaryUr?, formulas?, formulasUr?, definitions?, videoUrl?, driveUrl?, status?}` → 201. 400 if board/class/subject unresolved. Default status `draft` (`chapters.service.ts:184`) |
| PUT | `/api/chapters/:id` | AET | Partial. **`status` stripped for teachers** (`chapters.controller.ts:110-112`) |
| PATCH | `/api/chapters/:id/review` | AET | 400 `"Chapter is already in review."` / `"Published chapters cannot be submitted for review."` → `status: "in_review"` |
| PATCH | `/api/chapters/:id/publish` | AE | → `status: "published"` |
| PATCH | `/api/chapters/:id/unpublish` | AE | → `status: "draft"` |
| PATCH | `/api/chapters/:id/reject` | AE | 400 unless `status === "in_review"` → `status: "draft"` |
| DELETE | `/api/chapters/:id` | AE | → `{deleted:true}` |

**Audit actions written:** `create_chapter`, `update_chapter`, `delete_chapter`,
`publish_chapter`, `reject_chapter`.

**Side effect:** transitioning to `published` triggers classroom notification
emails (`chapters.service.ts:24-37`, call sites `:278`, `:291`).

---

## 7. Exercises — `/api/exercises`

Source: `backend/src/modules/exercises/exercises.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/exercises` | AET | `?chapterId=` **required** → else 400 `"chapterId query required."` Returns `[{id, chapterId, slug, title, questionCount}]` |
| POST | `/api/exercises` | AET | `{chapterId, title}` → 201; 400 |
| DELETE | `/api/exercises/:id` | AE | `{deleted:true}`; 404 |

`exercises.controller.ts:38-40` exports unused stubs (`getBySlug`, `update`,
`reorder`).

---

## 8. Questions — `/api/questions`

Source: `backend/src/modules/questions/questions.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/questions` | — | With numeric `?exerciseId=` → full question list including steps. Otherwise falls back to `getQuestionData(board,class,subject,chapter,exercise,question)` with defaults `fbise / 9 / mathematics / real-numbers / exercise-1-1 / 3` (`questions.controller.ts:21-26`); 404 `"Question not found."` |
| GET | `/api/questions/:id` | — | Iterates in-memory `cmsStore` chapters → exercises → questions; 404 |
| POST | `/api/questions` | AET | `{exerciseId, num, questionText, questionTextUr?, marks, difficulty, pdfName?, steps[], stepsUr?}` → 201. Duplicate `num` → 400 `"Could not create question. Number may already exist."` |
| PUT | `/api/questions/:id` | AET | Partial. The `steps` array **fully replaces** `solution_steps` (`questions.service.ts:57-77`) |
| DELETE | `/api/questions/:id` | AE | `{deleted:true}` |

---

## 9. Solutions — `/api/solutions` ⚠️ STUB

Source: `backend/src/modules/solutions/solutions.routes.ts` (9 lines)

`solutions.service.ts` is a one-line comment. **No auth middleware on any route.**

| Method | Path | Auth | Response |
|---|---|---|---|
| GET | `/api/solutions/:questionId` | **—** | `200 []` |
| POST | `/api/solutions` | **— (none)** | `201 {created:true}` |
| PUT | `/api/solutions/:id` | **— (none)** | `200 {updated:true}` |
| DELETE | `/api/solutions/:id` | **— (none)** | `200 {deleted:true}` |

These write endpoints are unauthenticated. See
[`ISSUES-AND-RISKS.md`](./ISSUES-AND-RISKS.md#3-unauthenticated-write-endpoints).

---

## 10. MCQs — `/api/mcqs`

Source: `backend/src/modules/mcqs/mcqs.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/mcqs` | — | Query `board, class, subject, chapter` → `chapterKey = board/class/subject/chapter`. Returns `[{id, chapterKey, question, options:[{label,text}], correctLabel, reason}]` |
| GET | `/api/mcqs/:id` | — | 404 |
| POST | `/api/mcqs` | AET | `{boardSlug, classSlug, subjectSlug, chapterSlug, question, options, correctLabel, reason}` → 201; 400 on empty question, no options, or empty `correctLabel` |
| PUT | `/api/mcqs/:id` | AET | Partial |
| DELETE | `/api/mcqs/:id` | AE | `{deleted:true}` |

Note: the list endpoint returns `correctLabel` and `reason` publicly.

---

## 11. PDFs — `/api/pdfs`

Source: `backend/src/modules/pdfs/pdfs.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/pdfs/storage/info` | AET | `{ mode: "r2" \| "local", r2: boolean }` |
| GET | `/api/pdfs` | — | `[{id, filename, url, size, uploadedAt, source:"demo"\|"upload", storage:"local"\|"r2"}]` — uploads first, then 7 demo PDFs |
| GET | `/api/pdfs/:id` | — | 404 `"PDF not found."` |
| POST | `/api/pdfs/upload` | AET | `multipart/form-data`, field **`file`**. 10 MB limit, memory storage, mimetype-or-extension filter. 400 `"PDF file is required."` / `"PDF must be under 10 MB."` → 201 |
| DELETE | `/api/pdfs/:id` | AE | 400 `"Cannot delete demo PDFs or missing file."` — demo ids protected (`pdf-store.ts:23-31`) |

---

## 12. Search — `/api/search`

Source: `backend/src/modules/search/search.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/search?q=` | — | `{ query, results: SearchResult[], resources: [...6 popular...], total }`. Empty query returns the top 10 results (`search.service.ts:186`). `type` ∈ `chapter \| exercise \| question \| paper` |

```ts
type SearchResult = {          // shared/src/index.ts:95-105
  title, board, boardSlug,
  className, classSlug,
  subject, subjectSlug,
  path, type
}
```

---

## 13. Users — `/api/users`

Source: `backend/src/modules/users/users.routes.ts` — **admin gate at `:9`**

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/users` | ADM | `PublicUser[]`, newest first |
| GET | `/api/users/:id` | ADM | 400 `"Invalid user id."` / 404 `"User not found."` |
| PUT | `/api/users/:id/role` | ADM | `{role}` ∈ `admin\|editor\|teacher\|student` else 400 `"Invalid role."` |
| DELETE | `/api/users/:id` | ADM | 400 `"You cannot delete your own account."` → `{deleted:true}` |

---

## 14. Reports — `/api/reports`

Source: `backend/src/modules/reports/reports.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/reports` | AE | `[{id, pageUrl, boardSlug, questionRef, message, status:"open"\|"resolved", createdAt}]` |
| POST | `/api/reports` | — | `{pageUrl, boardSlug?, questionRef?, message}` → 201. 400 if no `pageUrl` or `message` < 10 chars. Triggers admin email |
| PATCH | `/api/reports/:id/resolve` | AE | → report with `status: "resolved"`; 404 |

---

## 15. Audit — `/api/audit`

Source: `backend/src/modules/audit/audit.routes.ts`

| Method | Path | Auth | Response |
|---|---|---|---|
| GET | `/api/audit` | AE | Last **100** entries, newest first: `[{id, userId, userName, action, target, createdAt}]` |
| GET | `/api/audit/stats` | AE | `{ users, openReports, contactMessages, boards }` |

---

## 16. Contact — `/api/contact`

Source: `backend/src/modules/contact/contact.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/contact` | AE | `[{id, name, email, message, createdAt}]` |
| POST | `/api/contact` | — | `{name, email, message}` → 201. 400 on name<2, no `@`, or message<10. Triggers admin email |

---

## 17. Bookmarks — `/api/bookmarks`

Source: `backend/src/modules/bookmarks/bookmarks.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/bookmarks` | A | `[{id, title, path, createdAt}]` |
| POST | `/api/bookmarks` | A | `{title, path}` → 201. Idempotent on `(userId, path)`. 400 if blank |
| DELETE | `/api/bookmarks/:id` | A | Scoped to owner; 400 / 404 |

---

## 18. Quiz — `/api/quiz`

Source: `backend/src/modules/quiz/quiz.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/quiz` | — | **All four of `board`, `class`, `subject`, `chapter` required** → else 400. Returns `[{id, question, options}]` — **answers stripped** |
| POST | `/api/quiz/submit` | A | `{chapterKey, answers: {[mcqId]: label}}` → `{score, total, results:[{id, correct, selected, correctLabel, reason}], savedAt}`. 400 `"Invalid chapter key."` if not 4 parts; 404 `"No quiz for this chapter."` |
| GET | `/api/quiz/scores` | A | `[{id, userId, chapterKey, score, total, createdAt}]` |

---

## 19. Progress — `/api/progress`

Source: `backend/src/modules/progress/progress.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/progress` | A | `ProgressEntry[]` |
| POST | `/api/progress/track` | A | `{subjectKey, chapterSlug, path, label}` → `ProgressEntry`. 400 if any of the first three are missing. Upserts per `(userId, subjectKey)` |
| GET | `/api/progress/flashcards?chapterKey=` | A | `{chapterKey, masteredIndices: [], updatedAt}`; 400 if `chapterKey` blank |
| POST | `/api/progress/flashcards` | A | `{chapterKey, cardIndex, mastered}` → same shape. 400 `"cardIndex must be a non-negative integer."` |

```ts
type ProgressEntry = {
  subjectKey, subjectLabel,
  visitedChapters: string[],
  totalChapters, percent,
  lastPath, lastLabel, updatedAt
}
```

---

## 20. Authors — `/api/authors`

Source: `backend/src/modules/authors/authors.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/authors` | — | `[{id, slug, name, title, bio, boards: string[], noteCount}]` |
| GET | `/api/authors/:slug` | — | Author + `notes:[{title, path, subject}]` (max 6 published chapters). 404 uses key **`error`**, not `message` (`authors.controller.ts:29`) |
| POST | `/api/authors` | AE | `{name, title, bio, boards[], slug?}` → 201; 400 |
| PUT | `/api/authors/:slug` | AE | Partial `{name, title, bio, boards, noteCount}` |
| DELETE | `/api/authors/:slug` | AE | `{deleted:true}` |

---

## 21. Books — `/api/books`

Source: `backend/src/modules/books/books.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/books` | — | Query `board`, `class`, `subject`. Returns `[{id, boardSlug, boardTitle, classSlug, classTitle, subjectSlug, subjectTitle, title, priceLabel, coverUrl, pdfUrl, driveUrl, notesPath}]` |
| GET | `/api/books/:id` | — | 404 `"Book not found."` |
| POST | `/api/books` | AET | Body = `Omit<BookRecord,"id">` → 201; 400 if `title`/`boardSlug`/`classSlug` blank |
| POST | `/api/books/:id/pdf` | AET | `multipart/form-data`, field **`file`** → stores the PDF and sets `pdfUrl` → 200 book. 400 `"PDF file is required."` |
| PUT | `/api/books/:id` | AET | Partial |
| DELETE | `/api/books/:id` | AE | `{deleted:true}` |

---

## 22. Past papers — `/api/past-papers`

Source: `backend/src/modules/past-papers/past-papers.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/past-papers` | — | Query `board, year, type, class, syllabus, solved`. `solved=solved` → only `isSolved`; `solved=unsolved` → only `!isSolved` (`past-papers.service.ts:63-64`). Sort: year desc → paper-type rank (`2nd-annual`, `model`, `1st-annual`, `pba`) → subject → id |
| GET | `/api/past-papers/:id` | — | 404 |
| POST | `/api/past-papers` | AET | → 201; 400 on missing subject/year |
| PUT | `/api/past-papers/:id` | AET | Normalises `paperType`, `syllabus`, `isSolved`, `driveUrl` |
| DELETE | `/api/past-papers/:id` | AE | `{deleted:true}` |

---

## 23. Legal — `/api/legal`

Source: `backend/src/modules/legal/legal.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/legal` | — | `[{slug, title}]` |
| GET | `/api/legal/:slug` | — | Full page `{slug, ...content}`. Allowed slugs: `about`, `privacy`, `terms`, `copyright`, `educational-notice` (`legal.service.ts:9`); else 404 |
| PUT | `/api/legal/:slug` | AE | Shallow-merges into the stored JSONB `content` (`legal.service.ts:47`) — raw body spread |

---

## 24. Formulas — `/api/formulas`

Source: `backend/src/modules/formulas/formulas.routes.ts`

| Method | Path | Auth | Response |
|---|---|---|---|
| GET | `/api/formulas` | — | All **published** chapters with ≥1 formula: `[{boardSlug, classSlug, subjectSlug, chapterSlug, boardTitle, classTitle, subjectTitle, chapterTitle, formulas[], formulasUr?}]` |

---

## 25. Comments — `/api/comments`

Source: `backend/src/modules/comments/comments.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/comments/moderation?status=` | AE | Default status `pending`. Returns `[{id, userId, userName, pagePath, questionRef, body, status, createdAt}]` |
| GET | `/api/comments?path=` | — | Only `status === "approved"` for that `pagePath`. Missing/empty path → `200 []` |
| POST | `/api/comments` | A | `{pagePath, questionRef?, body}`. `userName` resolved from the user record, else the email local-part. 400 `"Comment cannot be empty."` / `"Comment is too long."` (>2000). Always created as `pending` |
| PATCH | `/api/comments/:id/approve` | AE | → `status: "approved"` |
| PATCH | `/api/comments/:id/reject` | AE | → `status: "rejected"` |
| DELETE | `/api/comments/:id` | AE | `{deleted:true}` |

---

## 26. Exams — `/api/exams`

Source: `backend/src/modules/exams/exams.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/exams` | — | **Upcoming only** (`examDate > now`), ascending |
| GET | `/api/exams/all` | — | All, ascending by date |
| GET | `/api/exams/:id` | — | `{id, boardSlug, boardTitle, classSlug, classTitle, title, examDate}`; 404 |
| POST | `/api/exams` | AE | 400 on missing title/board/class, or 400 `"Invalid exam date."` |
| PUT | `/api/exams/:id` | AE | Patch with an explicit allow-list |
| DELETE | `/api/exams/:id` | AE | `{deleted:true}` |

---

## 27. Classrooms — `/api/classrooms`

Source: `backend/src/modules/classrooms/classrooms.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/classrooms/mine` | A | teacher/admin/editor → classrooms they own; student → memberships |
| POST | `/api/classrooms` | AET | `{name, boardSlug, classSlug, subjectSlug}` → 201. Generates a 6-char join code from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` with up to 8 collision retries (`classrooms.service.ts:15-23,72-77`) |
| POST | `/api/classrooms/join` | A | `{joinCode}` (upper-cased). 400 `"Enter a valid class code."` if <4 chars; 404 `"Class code not found."` Idempotent |
| GET | `/api/classrooms/:id` | A | `{classroom, members:[{id,userId,userName,joinedAt}], assignments:[{id,classroomId,title,exercisePath,dueDate,createdAt}], isTeacher}`. 403 `"You are not in this classroom."` if not owner/admin/editor and not a member |
| GET | `/api/classrooms/:id/scores` | A | **Teacher only** — 403 `"Only the classroom teacher can view scores."` Returns flat `[{userId, userName, chapterKey, score, total, createdAt}]` for all members |
| POST | `/api/classrooms/:id/assignments` | AET | `{title, exercisePath, dueDate?}` → 201. 403 `"Only the classroom teacher can assign work."` |
| DELETE | `/api/classrooms/:id/assignments/:assignmentId` | AET | 403 `"Only the classroom teacher can remove assignments."`; 404 |

---

## 28. Categories — `/api/categories`

Source: `backend/src/modules/categories/categories.routes.ts`

| Method | Path | Auth | Response |
|---|---|---|---|
| GET | `/api/categories` | — | `{ categories: [...], tree: [top + children] }` |
| GET | `/api/categories/:slug` | — | `{ category, trail[], children[], siblings[], resources[≤24], total }`; 404 `"Category not found."` |

---

## 29. Resources — `/api/resources`

Source: `backend/src/modules/resources/resources.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/resources` | — | Query `sort=latest\|popular\|a-z`, `category`, `q`, `limit` (default 60) → `{resources, total, category}` |
| GET | `/api/resources/latest?limit=8` | — | Array |
| GET | `/api/resources/by-id/:id` | — | 404 `"Resource not found."` |
| GET | `/api/resources/:slug` | — | `{resource, category, trail, related[4]}` |
| POST | `/api/resources` | **A (any role)** | `multipart/form-data`, `file` optional. Body `{title*, categoryId*, subject="General", board?, description?, fileUrl?}`. `fileUrl` must contain `drive.google.com` or `docs.google.com` else 400 `"Only Google Drive links are allowed."`. `author` from the JWT user's name; `classLabel` inferred from digits in the category name → 201 |
| POST | `/api/resources/:slug/download` | — | Increments the counter → `{slug, downloads}` |
| PATCH | `/api/resources/:id` | AET | Whitelisted fields `{status, title, categoryId, board, subject, description, fileUrl}` |
| DELETE | `/api/resources/:id` | AE | `{deleted:true}` |

⚠️ `POST /api/resources` uses only `requireAuth` — **students can create
resources**. See [`ISSUES-AND-RISKS.md`](./ISSUES-AND-RISKS.md#4-students-can-create-resources).

---

## 30. Portal — `/api/portal`

Source: `backend/src/modules/portal/portal.routes.ts` (router only, no controller/service)

| Method | Path | Auth | Response |
|---|---|---|---|
| GET | `/api/portal/stats` | — | `{books, categories, users}` — `users` from the auth service (`:7-19`) |
| GET | `/api/portal/nav` | — | `{tree:[{slug, name, nameUr, icon, gradient, imageUrl, children[]}]}` (`:21-40`) |
| GET | `/api/portal/categories` | — | `{categories: PortalCategory[]}` — raw, un-mapped (`:42-44`) |

---

## 31. Test generator — `/api/test-generator`

Source: `backend/src/modules/test-generator/test-generator.routes.ts`

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/test-generator/generate` | **— (none)** | Body `{board, classSlug, subject, chapterSlugs[], mcqCount}`. 400 `"board, classSlug, subject, chapterSlugs, mcqCount required."` → `{test:{mcqs:[{id, question, options, chapterKey}], timeMinutes}}`. **DB-only — no in-memory fallback** |

---

## 32. Catalog — not mounted ⛔

`backend/src/modules/catalog/catalog.routes.ts:5` defines `GET /boards` with a
hard-coded FBISE stub. `catalogRouter` is never imported or mounted in
`backend/src/routes/index.ts` — verified by grep. **Dead code.**

---

## Endpoint index

30 mounted routers under `/api`:

| Prefix | Router mount | Endpoints |
|---|---|---|
| `/api/health` | `routes/index.ts:36` | 1 |
| `/api/auth` | `:54` | 5 |
| `/api/boards` | `:44` | 12 |
| `/api/classes` | `:45` | 5 |
| `/api/subjects` | `:46` | 5 |
| `/api/chapters` | `:47` | 9 |
| `/api/exercises` | `:48` | 3 |
| `/api/questions` | `:49` | 5 |
| `/api/solutions` | `:50` | 4 (stubs) |
| `/api/mcqs` | `:51` | 5 |
| `/api/pdfs` | `:52` | 5 |
| `/api/search` | `:53` | 1 |
| `/api/users` | `:55` | 4 |
| `/api/reports` | `:56` | 3 |
| `/api/audit` | `:57` | 2 |
| `/api/contact` | `:58` | 2 |
| `/api/bookmarks` | `:59` | 3 |
| `/api/quiz` | `:60` | 3 |
| `/api/progress` | `:61` | 4 |
| `/api/authors` | `:62` | 5 |
| `/api/books` | `:63` | 6 |
| `/api/past-papers` | `:64` | 5 |
| `/api/legal` | `:65` | 3 |
| `/api/formulas` | `:66` | 1 |
| `/api/comments` | `:67` | 6 |
| `/api/exams` | `:68` | 5 |
| `/api/classrooms` | `:69` | 7 |
| `/api/categories` | `:70` | 2 |
| `/api/resources` | `:71` | 8 |
| `/api/portal` | `:72` | 3 |
| `/api/test-generator` | `:73` | 1 |

**Total: ~130 endpoint handlers**, plus 6 root/static routes.
