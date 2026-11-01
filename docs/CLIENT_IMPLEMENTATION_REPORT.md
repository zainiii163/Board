# Client Implementation Report — BoardNotes

**Date:** 2026-11-01  
**Companion audit:** `docs/CLIENT_REQUIREMENTS_AUDIT.md`  
**Resource status:** `docs/RESOURCE_VERIFICATION_MATRIX.md`  
**QA:** `docs/FINAL_QA_REPORT.md`

## A. Completed requirements (by PDF)

| PDF | Requirement | Implementation |
|---|---|---|
| 123(2).pdf | Federal + Punjab only in Books & Notes selection | `BOOKS_NOTES_BOARD_SLUGS`; header/home; footer Boards = Federal, Punjab, FBISE Past Papers link; search board filter trimmed |
| 123(2).pdf | Remove Past Papers from Books & Notes pages | Hierarchy no longer fetches/renders past papers; `?view=past-papers` redirects to `/past-papers`; sitemap updated |
| 123(2).pdf | Dedicated Past Papers route | `/past-papers` + FBISE explorer |
| 111(3).pdf | FBISE past papers IA (class → subject → session, search, source/download) | `FbisePastPapersExplorer` live |
| 113(3).pdf | Class 9 subjects; no Pakistan Studies; Tarjuma included | Seed + explorer + API `applyFbiseClientPolicy` |
| 113(3).pdf | New syllabus only in public UI | Old syllabus filtered unless explicit |
| 113(3).pdf | 2025–2027 annotated sessions as inventory | 9×7 source rows; `pdfUrl` null until upload |
| 125(3).pdf | Class 10 subjects; no Islamiat | Seed + explorer + API policy |
| 125(3).pdf | Distinct 1st/2nd annual, model, Chemistry PBA | Typed `paperType` inventory |
| Books UX | Sparse DB subjects (Math-only) on class pages | API merges `publishedCurriculumSubjects` for listing + empty subject shells |

## B. Modified files (this pass)

### Frontend
- `frontend/src/app/(public)/[board]/page.tsx` — stop past-paper fetch
- `frontend/src/app/(public)/[board]/[classSlug]/page.tsx` — redirect `view=past-papers`; books-only props
- `frontend/src/components/content/hierarchy-pages.tsx` — remove Past Papers sections/props
- `frontend/src/components/layout/footer.tsx` — Books boards allowlist
- `frontend/src/components/content/search-page-content.tsx` — Federal/Punjab filter options
- `frontend/src/app/sitemap.ts` — past-paper URLs → `/past-papers?...`

### Backend
- `backend/src/modules/search/search.service.ts` — paper hits → `/past-papers?...`
- `backend/src/modules/past-papers/past-papers.service.ts` — public FBISE Class 9/10 subject + old-syllabus policy
- `backend/src/modules/boards/boards.controller.ts` — merge published curriculum subjects into board/class responses; catalog empty shells
- `backend/src/db/seed-book-covers.ts` — FBISE source subject gaps (CS / Tarjuma)

### Docs
- `docs/CLIENT_REQUIREMENTS_AUDIT.md` (new)
- `docs/CLIENT_IMPLEMENTATION_REPORT.md` (this file)
- `docs/RESOURCE_VERIFICATION_MATRIX.md` (new)
- `docs/FINAL_QA_REPORT.md` (new)

## C. Resource inventory (summary)

- **89** FBISE annotated source rows live; **0** hosted exam `pdfUrl` values.
- Chemistry **PBA** present as source row.
- Class **11–12** empty by design until verified inventory.
- Books/notes PDFs remain client-licensed content; covers catalog drives subject listing.

## D. Testing (see FINAL_QA_REPORT)

- FBISE policy tests: **pass**
- Frontend `tsc --noEmit`: **pass**
- Full `npm test -w backend`: **2 fail** in `demo-api.test.ts` (DB seed hierarchy expectations vs live Aiven content — pre-existing relative to this change set)
- Live past-papers explorer: Class 9 subjects correct; Class 11–12 “coming soon”
- Live `/fbise/9` (pre-deploy): still shows Past Papers CTA + Math-only subjects until backend/FE deploy

## E. Remaining work

1. Deploy FE + BE so Books/Notes separation, footer allowlist, curriculum merge, and API policy go live.
2. Obtain licensed exam PDFs and set `pdfUrl` per verified row.
3. Authorized `SEED_BACKFILL=true` / admin seed-backfill to persist curriculum subjects in Postgres (optional once merge is live).
4. Class 11–12 inventory after client confirmation.
5. Resolve `demo-api.test.ts` failures against current DB content or isolate tests from production seed drift.

## F. Deployment readiness

**Ready for staging review after deploy of this branch.**  
**Not ready for production approval** until licensed PDFs, Class 11–12 decision, and clean browser QA on the deployed build.  
No automatic production deploy performed. No destructive DB migration run.
