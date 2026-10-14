# Testing Report

Current test suite, what it covers, and what it does not.

---

## 1. Summary

| | |
|---|---|
| Test files | **1** |
| Test cases | **2** |
| Assertions | ~40 |
| Runner | `node:test` + `node:assert/strict` (Node built-in) |
| Command | `npm test` → `tsx --test src/demo-api.test.ts` |
| Frontend tests | **None** — no test script, no framework |
| CI | **None** — no workflow files |
| Coverage tooling | **None** |

**Verified on Node v22.20.0 / npm 10.9.3:**

| Check | Result |
|---|---|
| Test 1 — `GET /api/boards returns the demo boards` | ❌ **FAILS** (`8 !== 6`) |
| Test 2 — `GET /api/classes/9 and /api/subjects/mathematics…` | ✅ passes |
| Process exit after all tests complete | ❌ **hangs** — still running after 60 s |

---

## 2. The test file

`backend/src/demo-api.test.ts` — 203 lines.

### Harness pattern

Both tests use the same shape:

```ts
const app = createApp();          // :7, :112
const server = app.listen(0);      // :8, :113  → ephemeral port
await new Promise<void>((resolve) => server.once("listening", resolve));
const address = server.address();
const response = await fetch(`http://127.0.0.1:${address.port}/api/boards`);
// … assertions …
await new Promise<void>((resolve, reject) => {
  server.close((error) => { if (error) reject(error); else resolve(); });   // :103-108, :197-202
});
```

`createApp()` is deliberately side-effect free — it does **not** call
`initDbMode()`, `applyMigrations()`, or `seedDefaultUsers()`. Therefore
`dbAvailable` stays `null` and **`useDb()` returns `false`**, so every test
exercises the **in-memory demo-data path only**. The PostgreSQL/Drizzle path is
never tested.

### Test 1 — `GET /api/boards returns the demo boards` (`:6-109`) ❌

Intended: verify the board catalogue and drill into the hierarchy.

| Assertion | Line | Status |
|---|---|---|
| `GET /api/boards` → 200 | `:18` | ✅ |
| `payload.length === 6` | `:19` | ❌ **actual 8** |
| Deep-equal on 6 boards with exact `{slug,title,ready,chapterCount}` | `:20-35` | ❌ not reached |
| `GET /api/boards/fbise/classes/5` → 200, slug `5`, title `Class 5` | `:37-43` | not reached |
| `GET …/oxford/classes/11/subjects/mathematics/chapters/trigonometry` → 200, first exercise `Exercise 1.1` | `:45-52` | not reached |
| `GET …/cambridge/classes/10/…/quadratic-equations/exercises/exercise-1-1/q/2` → 200, `num === 2`, question contains `2x^2 - 5x - 3`, a step contains `\frac{5 \pm \sqrt{49}}{4}` | `:54-65` | not reached |
| `GET …/punjab/classes/9/…/sets` → 200, title `Sets` | `:67-73` | not reached |
| `GET …/kpk/classes/9/…/linear-equations` → 200 | `:75-80` | not reached |
| `GET …/sindh/classes/9/…/algebraic-expressions` → 200 | `:82-87` | not reached |
| `GET …/oxford/classes/9/…/number-systems` → 200 | `:89-94` | not reached |
| `GET …/cambridge/classes/9/…/algebra` → 200 | `:96-101` | not reached |

#### Root cause — stale assertion

The demo catalogue now has **8** boards, not 6. Verified against a running
server (`GET /api/boards`):

| slug | title | chapters | ready |
|---|---|---|---|
| `fbise` | Federal Board (FBISE) | 9 | true |
| `punjab` | Punjab Board | 8 | true |
| `kpk` | KPK Board | 8 | true |
| `sindh` | Sindh Board | 8 | true |
| `oxford` | Oxford Board | 8 | true |
| `cambridge` | Cambridge Board | 8 | true |
| `lahore` | Lahore Board | 8 | true |
| `d-g-khan` | D.G. Khan Board | 8 | true |

`lahore` and `d-g-khan` were added in commit `165aee4`
*"fix: solid card backgrounds; add Lahore/D.G. Khan board variants"* without
updating the test.

**Fix:** change `:19` to `assert.equal(payload.length, 8)` and add
`{ slug: "lahore", title: "Louvre Board"… }`-style entries for the two new
boards to the expected array at `:27-34` (using the real titles
`Lahore Board` and `D.G. Khan Board`).

A hard-coded board count is fragile. Prefer asserting that the expected slugs
are a subset of the response rather than the exact length.

### Test 2 — `GET /api/classes/9 and /api/subjects/mathematics serve the SRS learning hierarchy` (`:111-203`) ✅

| Assertion | Line |
|---|---|
| `GET /api/classes/9` → 200, slug `9`, title `Class 9` | `:120-124` |
| `GET /api/subjects/mathematics` → 200, title `Mathematics`, chapters include `real-numbers` | `:126-131` |
| `GET /api/chapters/real-numbers` → 200, title `Real Numbers` | `:133-139` |
| `GET …/real-numbers/exercises/exercise-1-1/q/3` → 200, exact LaTeX `Express $0.75$ as a rational number in the form $\frac{a}{b}$.` | `:141-147` |
| `…/q/4` → 200, exact LaTeX `Simplify $\sqrt{12} + \sqrt{27}$.` | `:149-155` |
| `…/q/5` → 200, exact LaTeX `Evaluate $\frac{1}{\sqrt{2} - 1}$.` | `:157-163` |
| `GET /api/chapters/logarithms` → 200 | `:165-170` |
| `…/logarithms/exercises/exercise-3-2/q/2` → 200, contains `\log_{10}` | `:172-178` |
| `…/logarithms/exercises/exercise-3-1/q/2` → 200, contains `\log_2 8` | `:180-186` |
| `GET /api/boards/fbise/classes/9` → 200, board/class assertions | `:188-195` |

This test is the SRS acceptance path: guest → Class 9 → Mathematics →
Real Numbers → Exercise 1.1 → Question 3, matching SRS §6 "first launch goal".

---

## 3. Verified defect — the test process never exits

Both tests complete, but `npm test` does **not** terminate:

```
TAP version 13
# Subtest: GET /api/boards returns the demo boards
not ok 1 - GET /api/boards returns the demo boards
  ...
# Subtest: GET /api/classes/9 and /api/subjects/mathematics serve the SRS learning hierarchy
ok 2 - ...
```

…and then the process stays alive indefinitely (observed > 60 s; a 180 s
`npm test` invocation was terminated by timeout).

The servers are explicitly closed at `:103-108` and `:197-202`, so the cause is
a lingering handle — most plausibly undici's global `fetch` dispatcher keeping
keep-alive sockets to `127.0.0.1` open, which holds the event loop alive on
Node 22.

**Practical impact:** CI cannot use `npm test` as-is; it will hang until the
job is killed.

**Possible fixes**

1. `process.exit(0)` after both tests (crude but effective).
2. Disable keep-alive on the test client:
   `fetch(url, { headers: { Connection: "close" } })`
3. Track sockets and destroy them on close:
   ```ts
   const sockets = new Set<Socket>();
   server.on("connection", (s) => { sockets.add(s); s.on("close", () => sockets.delete(s)); });
   // …
   sockets.forEach((s) => s.destroy());
   ```
4. Use `server.closeAllConnections()` (Node 18.2+) alongside `server.close()`.

---

## 4. Coverage gaps

### By HTTP method

| Method | Covered | Total endpoints |
|---|:---:|:---:|
| GET | ~14 unique | ~75 |
| POST | 0 | ~35 |
| PUT | 0 | ~15 |
| PATCH | 0 | ~12 |
| DELETE | 0 | ~12 |

**Zero** write endpoints are tested. That includes every code path that reaches
Drizzle.

### By domain

| Domain | Tested |
|---|:---:|
| Public hierarchy reads (`boards`, `classes`, `subjects`, `chapters`, `questions`) | ✅ |
| Search | ❌ |
| MCQs / quiz | ❌ |
| Formulas | ❌ |
| Authors | ❌ |
| Books / past papers | ❌ |
| Exams | ❌ |
| Legal pages | ❌ |
| Categories / resources / portal | ❌ |
| PDFs (list, upload, delete) | ❌ |
| Chapter ZIP streaming | ❌ |
| Test generator | ❌ |
| **Auth** (register, login, JWT verify, logout) | ❌ |
| **Roles** (`requireAuth`, `requireRole`) | ❌ |
| **Users** (list, role change, delete) | ❌ |
| Bookmarks | ❌ |
| Progress / flashcards | ❌ |
| Comments + moderation | ❌ |
| Classrooms (join codes, assignments, scores) | ❌ |
| Reports / contact | ❌ |
| Audit log | ❌ |
| Upload validation (multer filters, 10 MB cap) | ❌ |
| Email (`notifyAdmin`, `sendUserMail`) | ❌ |
| R2 storage | ❌ |
| Seeding | ❌ |
| Migrations | ❌ |

### By status code

| Code | Tested |
|---|:---:|
| 200 | ✅ |
| 201 | ❌ |
| 400 | ❌ |
| 401 | ❌ |
| 403 | ❌ |
| 404 | ❌ |
| 500 | ❌ |

No error-path assertion exists anywhere in the suite.

### By data mode

| Mode | Tested |
|---|:---:|
| In-memory (`useDb() === false`) | ✅ |
| PostgreSQL (`useDb() === true`) | ❌ |

`createApp()` never calls `initDbMode()`, so `dbAvailable` remains `null` and
`useDb()` returns `false`. **Every Drizzle query, transaction, and join in the
codebase is unexercised by the test suite.** This is the highest-value gap,
because the in-memory and PostgreSQL paths are separate implementations of the
same logic.

---

## 5. Infrastructure gaps

| Item | Status |
|---|---|
| CI workflow (GitHub Actions etc.) | ❌ none in repo |
| Coverage reporting (`--experimental-test-coverage`, c8, nyc) | ❌ |
| Lint for backend | ❌ no script; root `npm run lint` is frontend-only |
| TypeScript check on backend | Only via `npm run build -w backend` / Dockerfile |
| Pre-commit hooks | ❌ |
| Test frontend | ❌ no script in `frontend/package.json` |
| `.gitattributes` | ❌ (LF/CRLF churn on Windows) |

---

## 6. Recommended test plan

### Priority 0 — unblock CI

1. Fix `demo-api.test.ts:19` and `:27-34` for the 8-board catalogue.
2. Make the runner exit (see §3).
3. Add a minimal GitHub Actions workflow running `npm ci && npm run build -w
   backend && npm test`.

### Priority 1 — security regression tests

4. `requireAuth` → 401 on missing, malformed, and tampered tokens.
5. `requireRole` → 403 for each disallowed role; 401 when unauthenticated.
6. Assert `/api/solutions/*` writes and `/api/test-generator/generate` are
   authenticated (will fail until fixed — good, that is the point).
7. Assert `POST /api/resources` rejects `student`.

### Priority 2 — database mode

8. Spin up PostgreSQL 15 in CI (the existing `docker-compose.local.yml` is
   enough), set `DATABASE_URL`, call `initDbMode()` + `applyMigrations()` +
   `seedIfEmpty()`, then run the **same** hierarchy assertions. This is the only
   way to catch divergence between the two data paths.

### Priority 3 — validation and error paths

9. One table-driven test per resource for: missing required fields, invalid ids,
   duplicate slugs/numbers, over-length strings, non-PDF uploads, oversize
   uploads.
10. `POST /api/pdfs/upload` with a 10 MB+ file → 400.
11. A non-PDF renamed `.pdf` → confirm the current behaviour, then assert the
    desired behaviour once magic-byte checking is added.

### Priority 4 — subsystems

12. Quiz submit: score computation, `chapterKey` must have 4 parts → 400.
13. Classrooms: join code generation, collision retry, membership 403s.
14. Comments: creation as `pending`, public list shows only `approved`.
15. Progress/flashcards: upsert semantics and the non-negative-integer rule.
16. Search: empty query returns the top 10; result `type` values.
17. Chapter ZIP: 404 when `pdfCount === 0`, 200 + `application/zip` otherwise.
18. Audit: each CMS mutation writes the expected `action`.

### Priority 5 — frontend

19. Add a test runner (Vitest is the lightest fit for Next 16 + Turbopack).
20. Unit-test `lib/api-client.ts` (token handling, error parsing,
    `pdfUrl` resolution) and `lib/i18n.ts` (EN/UR key parity).
21. Component-test `chapter-flashcards`, `chapter-quiz`, `download-gate`.
22. End-to-end: the SRS §6 first-launch flow —
    `/fbise/9/mathematics/real-numbers/exercise-1-1/q/3` → read steps → download
    PDF, no login.

---

## 7. Useful commands

```bash
npm test                                          # full suite (currently hangs after completion)
npm test -w backend                               # same

# Run with TAP output only, and force exit
npx tsx --test src/demo-api.test.ts               # from backend/

# Node's built-in coverage
node --experimental-test-coverage --import tsx --test src/demo-api.test.ts

# Type-check the backend (there is no lint script)
npm run build -w backend

# Lint the frontend
npm run lint -w frontend
```
