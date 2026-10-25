# QA test report

Updated: 2026-10-24

## Performed

- Books & Notes board allowlist (Federal + Punjab) at UI layer; DB/API boards preserved.
- Board-count test root-cause analysis and fix; FBISE regression tests added.
- Isolated QA Postgres (`boardnotes_qa` :5434), migrations, full-stack run.
- Playwright browser QA at 375 / 768 / 1440 (system Edge channel).
- Fixed client API base double-`/api` bug discovered during browser QA.
- Seed path hardened so FBISE sources still load if optional platform seed fails.

## Automated results

| Command | Result | Evidence |
|---|---|---|
| `npm test -w backend` | **Passed 5/5** | `demo-api.test.ts` (3) + `fbise-past-papers.test.ts` (2); duration ~34s |
| `drizzle-kit migrate` (QA DB) | **Passed** | Applied against `postgresql://…@localhost:5434/boardnotes_qa` |
| `GET /api/health` | **ok** | Backend on :4000 with PostgreSQL |
| `GET /api/past-papers?board=fbise` | **88 rows** | Source inventory; `pdfUrl` null; class archive `driveUrl` |

### Board-count failure — root cause

API correctly returns **8** boards (curriculum six + Lahore + D.G. Khan Punjab variants). The test expecting **6** was outdated. Books & Notes filtering is **frontend-only** (`BOOKS_NOTES_BOARD_SLUGS`), not by shrinking `/api/boards`.

## Browser QA

| Item | Result |
|---|---|
| Command | `node scripts/browser-qa.mjs` (Playwright + `channel: msedge`) |
| Viewports | 375, 768, 1440 |
| Paths | `/`, `/fbise`, `/punjab`, `/fbise/9`, `/punjab/9`, `/past-papers`, `/past-papers?board=fbise`, `/books` |
| Outcome | **Passed 24/24** page loads; no horizontal overflow flagged |
| Screenshots | `docs/qa-screenshots/` |
| JSON | `docs/qa-browser-results.json` |
| Chromium download | **Blocked** (`ENOSPC`) — used installed Edge instead |

### Console / network notes

- Pre-fix: `/backend-api/api/api/portal/*` 404s (double `/api`) — **fixed** in `api-client.ts`.
- Hydration warning on hero search caret style — polish item, non-blocking.
- Missing book-cover assets → 404 — content gap, not a route failure.

## Full-stack QA environment

| Piece | Config |
|---|---|
| Isolated DB | `docker compose -f docker-compose.qa.yml up -d` |
| Env | `backend/.env` pointed at QA (`backend/.env.qa.example`) |
| Frontend | http://localhost:3000 |
| Backend | http://localhost:4000 |

## Deployment

**Not approved** for production — see `docs/deployment-readiness.md`. Licensed exam PDFs still missing; Class 11–12 FBISE inventory incomplete.
