# BoardNotes client requirements implementation report

Updated: 2026-10-25

## Executive summary

BoardNotes now separates Books & Notes from Past Papers, limits client-facing Books & Notes board selection to Federal and Punjab, and provides a dedicated FBISE past-papers explorer. Class 9 and Class 10 have independent, annotation-derived subject and syllabus policies. External archive records are deliberately marked as sources rather than presented as uploaded BoardNotes PDFs.

The project uses Next.js 16 App Router/React 19 on the frontend and Express 5/Drizzle/PostgreSQL on the backend. An in-memory fallback supports local/demo behavior. The current database model stores paper board, class, subject, year, paper type, syllabus, source URL and optional uploaded PDF URL.

## Books & Notes

- The client-facing boards selector is allowlisted to `fbise` and `punjab`; other existing boards remain in the database/API and their deep links are not deleted.
- The public flow is Books & Notes → Board → Class → Subject → resources. Past Papers has its own `/past-papers` destination.
- Study++ was used as an organisational reference only. No third-party textbook or notes files were copied.
- Real book/PDF destination status remains dependent on the client-owned, licensed content inventory.

## FBISE Past Papers

- `/past-papers` provides class selection, subject filtering, text search, session grouping, source actions and PDF download actions only when a file is genuinely uploaded.
- Class 9: Biology, Chemistry, Physics, Computer Science, Mathematics, English, Urdu, Islamiat and Tarjuma-tul-Quran. Pakistan Studies is excluded in this class only. Old-syllabus rows are hidden.
- Class 10: Biology, Chemistry, Physics, Computer Science, Mathematics, English, Urdu and Pakistan Studies. Islamiat is excluded in this class only. Old-syllabus rows are hidden.
- Supported labels distinguish first/second annual, model paper, paper pattern and PBA. The source inventory is 88 rows, with `pdfUrl: null` unless an administrator attaches a verified PDF.
- Classes 11–12 remain a content dependency: the UI can show them when inventory exists, but no matching source matrix was seeded without client confirmation.

## Changed areas

- `frontend/src/components/content/fbise-past-papers-explorer.tsx` — public class/subject/session explorer and class-specific policy.
- `frontend/src/components/content/past-papers-list.tsx` and `backend/src/store/resources-store.ts` — paper-pattern type and session labels/sorting.
- `backend/src/db/seed-fbise-past-paper-sources.ts` — idempotent source inventory.
- `frontend/src/lib/constants.ts`, header, home, search and Books page — Books & Notes board allowlist and route clarity.
- `backend/src/fbise-past-papers.test.ts` — subject-policy/source regression coverage.

## Test results

| Check | Result |
|---|---|
| `npm run lint` | Passed in the previous implementation pass. |
| `npm run build -w frontend` | Passed in the previous implementation pass. |
| `npm run build -w backend` | Passed in the previous implementation pass. |
| `npm test -w backend` | Passed 5/5 in isolated QA, as recorded in `docs/qa-test-report.md`. |
| Responsive browser QA | Existing evidence covers 24 route/viewport checks. A fresh rerun on 2026-10-25 was interrupted by browser-process sandbox handling after the first page and is not counted as a new pass. |

## Deployment status

Ready for client review, not approved for production deployment. Blocking items are licensed/verified PDF assets, the Class 11–12 source inventory, confirmation of prospective 2027 entries, and a final clean browser run against the release configuration.
