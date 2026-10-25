# Implementation summary

## Delivered

- Dedicated responsive Federal Board past-paper explorer at `/past-papers`.
- Class selection, subject chips, accessible search, clear empty states and source/PDF action distinction.
- New `paper-pattern` resource type supported end-to-end.
- Annotation-driven Class 9/Class 10 subject and syllabus visibility policy.
- Idempotent FBISE source seed records; no fabricated local file URLs.
- **Books & Notes UI allowlist** — Federal + Punjab only (`BOOKS_NOTES_BOARD_SLUGS`) on home covers, header Boards / Books & Notes menus, and hero search. Other boards remain in DB/API for Past Papers.
- Backend test suite updated for 8-board catalog + FBISE policy regression tests.
- Isolated QA Compose file (`docker-compose.qa.yml`) and Playwright browser script (`scripts/browser-qa.mjs`).

## Deliberate limitations

The implementation does not claim an external source archive is a hosted PDF. Admin staff must attach a verified, licensed PDF before a student sees a download button.

Class 11–12 FBISE past-paper inventory is not fully seeded; explorer shows classes present in `/api/past-papers`.

## Files changed (this completion pass)

- `frontend/src/lib/constants.ts` — Books & Notes allowlist
- `frontend/src/app/(public)/page.tsx` — home board filter
- `frontend/src/components/layout/header.tsx` — Boards / Books & Notes menus
- `frontend/src/components/portal/hero-search.tsx` — search suggestions
- `frontend/src/app/(public)/books/page.tsx` — library copy clarity
- `backend/src/demo-api.test.ts` — 8-board expectation
- `backend/src/fbise-past-papers.test.ts` — new
- `backend/src/db/seed-fbise-past-paper-sources.ts` — exported policy constants
- `backend/package.json` — test script + force-exit
- `docker-compose.qa.yml`, `backend/.env.qa.example`, `scripts/browser-qa.mjs`
- `docs/client-requirements-matrix.md`, `docs/qa-test-report.md`, this file
