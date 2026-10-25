# Backend and database review (QA session)

## Environment

| Item | Value |
|---|---|
| QA Compose | `docker-compose.qa.yml` |
| Database | `boardnotes_qa` on localhost:**5434** |
| Migrations | Applied successfully via `drizzle-kit migrate` |
| Backend mode | PostgreSQL connected (`[db] PostgreSQL is the source of truth`) |

## Findings

1. **Board catalog** — `/api/boards` returns 8 boards (6 curriculum + Lahore + D.G. Khan). Correct for Past Papers / deep links. Books & Notes UI filters to Federal + Punjab only.
2. **FBISE inventory** — 88 source rows after seed (`pdfUrl` null, `driveUrl` → class archive). Matches Class 9/10 policy.
3. **Seed resilience** — Empty-DB path previously aborted on `question_comments` insert failure before FBISE seed. Fixed with `runOptional` wrappers in `seed-if-empty.ts`.
4. **Constraints / uploads** — Past-paper downloads gated on `pdfUrl`; source-only rows use `driveUrl`. Admin past-papers page remains the upload path.
5. **API double-prefix bug** — Client browser base was `/backend-api/api` while paths already start with `/api`, producing `/backend-api/api/api/...` 404s. Fixed to `/backend-api`.

## Integration checks run

- `npm test -w backend` → 5/5 pass
- `GET /api/health` → ok
- `GET /api/past-papers?board=fbise` → 88 rows
- Playwright browser QA → 24/24 page loads (see `qa-browser-results.json`)
