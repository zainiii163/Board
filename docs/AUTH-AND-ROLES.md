# Authentication & Roles

Complete reference for the BoardNotes auth model.

---

## 1. Mechanism

Stateless **JWT Bearer** tokens. No sessions, no cookies, no refresh tokens, no
server-side revocation list.

```
┌─────────┐   POST /api/auth/login          ┌──────────┐
│ Browser │   { email, password }           │ Express  │
└────┬────┘ ───────────────────────────────► │          │
     │                                      │ bcrypt   │
     │  { user, token }                     │ compare  │
     ◄───────────────────────────────────── │          │
     │                                      │ jwt.sign │
     │  localStorage.boardnotes_token       └──────────┘
     │
     │  Authorization: Bearer <token>
     │ ──────────────────────────────────────────────►
     │                                      ┌──────────────────────┐
     │                                      │ requireAuth          │
     │                                      │  → jwt.verify        │
     │                                      │  → req.user = {...}  │
     │                                      │ requireRole(...)     │
     │                                      │  → 403 if no match   │
     │                                      └──────────────────────┘
```

### Token issuance

`backend/src/utils/jwt.ts:12-14`

```ts
export type AuthTokenPayload = {
  userId: number;
  email: string;
  role: UserRole;
};

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}
```

| Property | Value |
|---|---|
| Algorithm | HS256 (`jsonwebtoken` default) |
| Expiry | `7d` |
| Issuer / audience | **not set** |
| Signing key | `env.jwtSecret` — default `"change-me"` (`config/env.ts:4`) |

### Token verification

`backend/src/utils/jwt.ts:16-18` — `verifyToken(token)` casts the decoded
payload to `AuthTokenPayload` without runtime shape validation.

### Middleware

`backend/src/middleware/auth.middleware.ts`

```ts
export type AuthedRequest = Request & {
  user?: { userId: number; email: string; role: string };   // :6-12
};

export function requireAuth(req, _res, next) {              // :14
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Please sign in to continue."));
  }
  try {
    req.user = verifyToken(header.slice(7));
    return next();
  } catch {
    return next(ApiError.unauthorized("Session expired. Please sign in again."));
  }
}

export function optionalAuth(req, _res, next) { ... }        // :29 — UNUSED
```

`backend/src/middleware/role.middleware.ts:7-17`

```ts
export function requireRole(...roles: UserRole[]) {
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role as UserRole)) {
      return next(ApiError.forbidden("You do not have permission for this action."));
    }
    return next();
  };
}
```

`optionalAuth` (`:29`) is defined but **imported nowhere**.

### 401 vs 403

| Condition | Status | Message |
|---|---|---|
| No `Authorization` header | 401 | `"Please sign in to continue."` |
| Header does not start with `Bearer ` | 401 | `"Please sign in to continue."` |
| Token fails verification / expired | 401 | `"Session expired. Please sign in again."` |
| `requireRole` with no `req.user` | 401 | `ApiError.unauthorized()` default |
| Role not in the allowed list | 403 | `"You do not have permission for this action."` |

## 2. Passwords

`backend/src/utils/password.ts`

```ts
const SALT_ROUNDS = 10;                                             // :3

export async function hashPassword(password: string) {             // :5
  return bcrypt.hash(password, SALT_ROUNDS);
}
export async function verifyPassword(password, hash) {             // :9
  return bcrypt.compare(password, hash);
}
```

| Property | Value |
|---|---|
| Algorithm | bcrypt via `bcryptjs` ^3.0.3 |
| Cost | 10 rounds |
| Storage | `users.password_hash` (`schema.ts:126`) |
| Serialisation | Never exposed — `toPublicUser` (`auth.service.ts:20-34`) strips it |

## 3. Roles

`shared/src/index.ts:15`

```ts
export type UserRole = "admin" | "editor" | "teacher" | "student";
```

| Role | Purpose |
|---|---|
| `admin` | Full control, including user management |
| `editor` | Content publishing and moderation; no user management |
| `teacher` | Content authoring and classrooms; **cannot publish** |
| `student` | Reading, bookmarks, quizzes, progress, classrooms |

Role values are validated in exactly one place —
`users.controller.ts:34-36`, rejecting anything outside the four with
`400 "Invalid role."`.

## 4. Registration

`backend/src/modules/auth/auth.service.ts:50`

```ts
role: input.role === "admin" ? "student" : (input.role ?? "student")
```

`backend/src/modules/auth/auth.controller.ts:10` hardcodes `role: "student"`,
so the service-level escalation guard is currently unreachable through the
public API.

Validation (`auth.service.ts:46-48`):

| Rule | Failure |
|---|---|
| `name.length >= 2` | 400 |
| Valid email format | 400 |
| `password.length >= 6` | 400 |
| Email not already registered | 400 |

## 5. Permission matrix

Legend: **—** public · **A** any signed-in user · **AE** admin + editor ·
**AET** admin + editor + teacher · **ADM** admin only

### Content hierarchy

| Endpoint | Auth | Source |
|---|---|---|
| `GET /api/boards/*` (all reads) | — | `boards.routes.ts:11-37` |
| `POST /api/boards` | AE | `:38` |
| `PUT /api/boards/:slug` | AE | `:39` |
| `DELETE /api/boards/:slug` | AE | `:40` |
| `GET /api/classes`, `/api/classes/:slug` | — | `classes.routes.ts:11-12` |
| `POST`, `PUT` `/api/classes` | AET | `:13-14` |
| `DELETE /api/classes/:slug` | AE | `:15` |
| `GET /api/subjects`, `/api/subjects/:slug` | — | `subjects.routes.ts:11-12` |
| `POST`, `PUT` `/api/subjects` | AET | `:13-14` |
| `DELETE /api/subjects/:slug` | AE | `:15` |
| `GET /api/chapters?board&class&subject` | — (conditional) | `chapters.routes.ts:12-16` |
| `GET /api/chapters` (no hierarchy query) | AET (inline `:17-23`) | `chapters.routes.ts:12-24` |
| `GET /api/chapters/:slug` | — | `:25` |
| `POST /api/chapters` | AET | `:26` |
| `PUT /api/chapters/:id` | AET (`status` stripped for teachers) | `:27` |
| `PATCH /api/chapters/:id/review` | AET | `:31-40` |
| `PATCH /api/chapters/:id/publish` | AE | `:28` |
| `PATCH /api/chapters/:id/unpublish` | AE | `:29` |
| `PATCH /api/chapters/:id/reject` | AE | `:30` |
| `DELETE /api/chapters/:id` | AE | `:41` |

### Questions, MCQs, PDFs

| Endpoint | Auth | Source |
|---|---|---|
| `GET /api/exercises?chapterId=` | AET | `exercises.routes.ts:11` |
| `POST /api/exercises` | AET | `:12` |
| `DELETE /api/exercises/:id` | AE | `:13` |
| `GET /api/questions`, `/api/questions/:id` | — | `questions.routes.ts:11-12` |
| `POST`, `PUT /api/questions` | AET | `:13-14` |
| `DELETE /api/questions/:id` | AE | `:15` |
| `GET /api/solutions/*` | **— (none)** | `solutions.routes.ts:6` |
| `POST`, `PUT`, `DELETE /api/solutions/*` | **— (none)** ⚠️ | `solutions.routes.ts:7-9` |
| `GET /api/mcqs`, `/api/mcqs/:id` | — | `mcqs.routes.ts:11-12` |
| `POST`, `PUT /api/mcqs` | AET | `:13-14` |
| `DELETE /api/mcqs/:id` | AE | `:15` |
| `GET /api/pdfs`, `/api/pdfs/:id` | — | `pdfs.routes.ts:10` |
| `GET /api/pdfs/storage/info` | AET | `:9` |
| `POST /api/pdfs/upload` | AET | `:11-17` |
| `DELETE /api/pdfs/:id` | AE | `:18-23` |

### Platform

| Endpoint | Auth | Source |
|---|---|---|
| `GET /api/search` | — | `search.routes.ts:6` |
| `GET /api/formulas` | — | `formulas.routes.ts:7` |
| `GET /api/legal`, `/api/legal/:slug` | — | `legal.routes.ts:9-10` |
| `PUT /api/legal/:slug` | AE | `:11` |
| `GET /api/authors`, `/api/authors/:slug` | — | `authors.routes.ts:11-12` |
| `POST`, `PUT`, `DELETE /api/authors/*` | AE | `:13-15` |
| `GET /api/books`, `/api/books/:id` | — | `books.routes.ts:11-12` |
| `POST`, `PUT /api/books`, `POST /api/books/:id/pdf` | AET | `:13-15` |
| `DELETE /api/books/:id` | AE | `:16` |
| `GET /api/past-papers`, `/api/past-papers/:id` | — | `past-papers.routes.ts:11-12` |
| `POST`, `PUT /api/past-papers` | AET | `:13-14` |
| `DELETE /api/past-papers/:id` | AE | `:15` |
| `GET /api/exams`, `/api/exams/all`, `/api/exams/:id` | — | `exams.routes.ts:11-13` |
| `POST`, `PUT`, `DELETE /api/exams/*` | AE | `:14-16` |

### Portal & resources

| Endpoint | Auth | Source |
|---|---|---|
| `GET /api/categories`, `/api/categories/:slug` | — | `categories.routes.ts:7-8` |
| `GET /api/resources`, `/latest`, `/by-id/:id`, `/:slug` | — | `resources.routes.ts:9-12` |
| `POST /api/resources` | **A (any role, incl. student)** ⚠️ | `:14` |
| `POST /api/resources/:slug/download` | — | `:15` |
| `PATCH /api/resources/:id` | AET | `:17` |
| `DELETE /api/resources/:id` | AE | `:18` |
| `GET /api/portal/*` | — | `portal.routes.ts:7-44` |
| `POST /api/test-generator/generate` | **— (none)** ⚠️ | `test-generator.routes.ts:6` |

### User-scoped features

| Endpoint | Auth | Source |
|---|---|---|
| `GET /api/auth/me`, `PATCH /api/auth/preferences` | A | `auth.routes.ts:11-12` |
| `GET`, `POST /api/bookmarks` | A | `bookmarks.routes.ts:8-9` |
| `DELETE /api/bookmarks/:id` | A (owner-scoped) | `:10` |
| `GET /api/quiz` | — (answers stripped) | `quiz.routes.ts:8` |
| `POST /api/quiz/submit` | A | `:9` |
| `GET /api/quiz/scores` | A | `:10` |
| `GET /api/progress` | A | `progress.routes.ts:8` |
| `POST /api/progress/track` | A | `:9` |
| `GET`, `POST /api/progress/flashcards` | A | `:10-11` |
| `GET /api/comments?path=` | — (approved only) | `comments.routes.ts:12` |
| `POST /api/comments` | A (always `pending`) | `:13` |
| `GET /api/comments/moderation` | AE | `:11` |
| `PATCH /api/comments/:id/approve`, `/reject` | AE | `:14-15` |
| `DELETE /api/comments/:id` | AE | `:16` |

### Classrooms

| Endpoint | Auth | Extra check |
|---|---|---|
| `GET /api/classrooms/mine` | A | — |
| `POST /api/classrooms` | AET | — |
| `POST /api/classrooms/join` | A | — |
| `GET /api/classrooms/:id` | A | 403 `"You are not in this classroom."` |
| `GET /api/classrooms/:id/scores` | A | 403 `"Only the classroom teacher can view scores."` |
| `POST /api/classrooms/:id/assignments` | AET | 403 `"Only the classroom teacher can assign work."` |
| `DELETE /api/classrooms/:id/assignments/:assignmentId` | AET | 403 `"Only the classroom teacher can remove assignments."` |

### Administration

| Endpoint | Auth | Source |
|---|---|---|
| `GET /api/users`, `/api/users/:id` | ADM | `users.routes.ts:9-12` |
| `PUT /api/users/:id/role` | ADM | `:13` |
| `DELETE /api/users/:id` | ADM (self-delete blocked) | `:14` |
| `GET /api/audit` | AE | `audit.routes.ts:9` |
| `GET /api/audit/stats` | AE | `:10` |
| `GET /api/reports` | AE | `reports.routes.ts:9` |
| `POST /api/reports` | — | `:10` |
| `PATCH /api/reports/:id/resolve` | AE | `:11` |
| `GET /api/contact` | AE | `contact.routes.ts:9` |
| `POST /api/contact` | — | `:10` |

### Role capability matrix

| Capability | student | teacher | editor | admin |
|---|:---:|:---:|:---:|:---:|
| Read all public content | ✅ | ✅ | ✅ | ✅ |
| Submit quizzes, track progress | ✅ | ✅ | ✅ | ✅ |
| Bookmarks, comments (pending) | ✅ | ✅ | ✅ | ✅ |
| Join classrooms | ✅ | ✅ | ✅ | ✅ |
| Create chapters / questions / MCQs | ❌ | ✅ | ✅ | ✅ |
| Create classes / subjects | ❌ | ✅ | ✅ | ✅ |
| Upload PDFs / book PDFs | ❌ | ✅ | ✅ | ✅ |
| Create classrooms + assignments | ❌ | ✅ | ✅ | ✅ |
| Patch resources | ❌ | ✅ | ✅ | ✅ |
| Submit a chapter for review | ❌ | ✅ | ✅ | ✅ |
| **Publish / unpublish / reject chapters** | ❌ | ❌ | ✅ | ✅ |
| Delete classes / subjects / chapters | ❌ | ❌ | ✅ | ✅ |
| Delete questions / MCQs / books / papers | ❌ | ❌ | ✅ | ✅ |
| Moderation (comments, reports, contact) | ❌ | ❌ | ✅ | ✅ |
| Audit log | ❌ | ❌ | ✅ | ✅ |
| Edit legal pages | ❌ | ❌ | ✅ | ✅ |
| Manage users / roles | ❌ | ❌ | ❌ | ✅ |
| **Create resources** (`POST /api/resources`) | ⚠️ ✅ | ✅ | ✅ | ✅ |

⚠️ `POST /api/resources` uses only `requireAuth`
(`modules/resources/resources.routes.ts:14`), so **students can create
resources**. This is the one place where the capability model breaks down.

### Per-field authorization

The only field-level permission check in the codebase:

`backend/src/modules/chapters/chapters.controller.ts:110-112`

```ts
if (req.user?.role === "teacher") delete payload.status;
```

A teacher can `PUT /api/chapters/:id` but cannot change publication status —
they must go through `PATCH /api/chapters/:id/review`.

## 6. Public exposure of answers

Two endpoints leak answer keys to anonymous callers:

| Endpoint | Leaks |
|---|---|
| `GET /api/mcqs` | `correctLabel` and `reason` for every MCQ — `mcqs.routes.ts:11` |
| `POST /api/reports`, `POST /api/contact` | Unauthenticated write (by design, with validation) |

By contrast `GET /api/quiz` deliberately strips answers
(`quiz.routes.ts:8` → returns `{id, question, options}` only) and answers are
revealed only in `POST /api/quiz/submit` results.

## 7. Frontend auth

### Token storage

`frontend/src/lib/api-client.ts:7-16`

```ts
function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("boardnotes_token");
}
export function setAuthToken(token: string | null) { ... }
```

Stored in `localStorage` — readable by any XSS. Not an httpOnly cookie.

### Context

`frontend/src/lib/auth-context.tsx:31` — `AuthProvider` exposes:

```
{ user, loading, signIn, signUp, signOut, refreshUser,
  isAdmin, isEditor, isStaff, isTeacher }
```

`isStaff` = admin ∨ editor ∨ teacher.

### Route guards (client-side only)

| Guard | File:Line | Behaviour |
|---|---|---|
| `AdminGuard` | `components/auth/admin-guard.tsx:13` | Requires `isStaff`; `router.replace("/login?next=/admin")` (`:19`); renders "Checking access…" and "Admin access required" states |
| `AccountGuard` | `components/auth/account-guard.tsx:9` | Anonymous → `router.replace("/login?next=/account")` (`:14`) |

⚠️ **There is no `middleware.ts` or `proxy.ts` in the Next app.** These guards
run in the browser and are a UX affordance only. The real authorization
boundary is Express `requireAuth` / `requireRole`.

### Login form

`components/auth/auth-form.tsx:18` — `mode: "login" | "register"`, posts via
`useAuth().signIn` / `signUp`, then `router.push("/account")`. Demo credentials
are listed in the UI at `:123-126`.

## 8. Demo accounts

Created automatically on every boot by
`backend/src/modules/auth/auth.service.ts:158-190` and
`backend/src/store/memory-store.ts:64-106`.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@boardnotes.com` | `admin123` |
| Editor | `editor@boardnotes.com` | `editor123` |
| Teacher | `teacher@boardnotes.com` | `teacher123` |
| Student | `student@boardnotes.com` | `student123` |

⚠️ These are weak, well-known credentials created on every start, including in
production. The root `README.md` notes "change passwords in production" but no
code path does this automatically.

## 9. Production sanity warnings

`backend/src/server.ts:11-22`

| Condition | Warning |
|---|---|
| No `DATABASE_URL` | `"CMS data will not persist."` |
| `jwtSecret === "change-me"` or contains `"dev-secret"` | `"Set a strong JWT_SECRET in production."` |
| 1–3 of the 4 R2 vars set | Incomplete R2 configuration |

⚠️ **Warnings only.** The server always starts, including with
`JWT_SECRET="change-me"`. Combined with the auto-created demo accounts, a
production deployment that forgets `JWT_SECRET` is fully compromised — an
attacker who knows the default secret can mint an admin token.

## 10. Security hardening backlog

| Item | Location | Severity |
|---|---|---|
| Require a non-default `JWT_SECRET` at boot when `NODE_ENV=production` | `server.ts:11-22` | High |
| Disable demo-account seeding in production, or force random passwords | `auth.service.ts:158-190` | High |
| Add `requireAuth` + `requireRole("admin","editor","teacher")` to `/api/solutions` writes | `solutions.routes.ts:7-9` | High |
| Add auth to `POST /api/test-generator/generate` | `test-generator.routes.ts:6` | Medium |
| Restrict `POST /api/resources` to AET | `resources.routes.ts:14` | Medium |
| Implement `rate-limit.middleware.ts` | `middleware/rate-limit.middleware.ts:3-6` | Medium (login, register, reports, contact, quiz submit) |
| Implement `validate.middleware.ts` (zod) | `middleware/validate.middleware.ts:3-6` | Medium |
| Whitelist update payloads in 4 services (mass assignment) | `boards.service.ts:91`, `authors.service.ts:109`, `mcqs.service.ts:88`, `legal.service.ts:40` | Medium |
| Stop returning `correctLabel`/`reason` from the public `GET /api/mcqs` | `mcqs.routes.ts:11` | Medium |
| Add `iss`/`aud` claims and validate them | `utils/jwt.ts:12-18` | Low |
| Move the JWT to an httpOnly cookie | `frontend/src/lib/api-client.ts:7-16` | Low |
| Add token revocation / shorter expiry + refresh | `utils/jwt.ts:13` | Low |
| Remove or wire up the unused `optionalAuth` | `middleware/auth.middleware.ts:29` | Low |

## 11. CORS

`backend/src/app.ts:18-23`

```ts
cors({ origin: env.corsOrigins, allowedHeaders: ["Content-Type", "Authorization"] })
```

`env.corsOrigins` is `CORS_ORIGINS` split on `,`, trimmed, empty-filtered
(`config/env.ts:6-9`). Default:
`http://localhost:3000,http://127.0.0.1:3000`.

`credentials` is **not** enabled — consistent with the Bearer-token model
(no cookies are sent).
