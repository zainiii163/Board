# Educational platform audit

## Stack and structure

- Frontend: Next.js 16 App Router, React 19, TypeScript and Tailwind CSS.
- Backend: Express 5, TypeScript, Drizzle ORM and PostgreSQL, with an in-memory development fallback.
- Content hierarchy: `boards → classes → subjects → chapters → exercises → questions`; books and past papers retain their board/class/subject metadata.
- Admin: authenticated routes for books, past papers, PDFs and other content; staff-only write routes are enforced for past papers.

## Findings

1. The repository contained uncommitted work in the relevant Books, Notes and Past Papers areas. It was retained.
2. PDF upload handling checks MIME/name and has a file size cap in resource upload routes. Past-paper records support either an uploaded PDF or an external source URL.
3. Past-paper filtering already supports board, year, type, class, syllabus and solved-state queries. The dedicated FBISE UI adds class, subject and text search controls.
4. The prior FBISE seed contradicted the annotation scope: it contained Class 9 Pakistan Studies, Class 10 Islamiat, and old-syllabus rows. The public explorer now applies class-specific policy filters and the source seed no longer creates those rows.
5. Exact documents are not present in this repository. It would be misleading to expose local download actions for them, so source records show “View source” and only uploaded files receive download controls.

## Risks

- No client-owned or licensed exam PDF asset inventory has been provided.
- The schema uses descriptive board/class/subject fields on books and papers rather than foreign keys to the hierarchy, so administrative validation must remain in application logic.
- Existing data may still include legacy rows. The public Class 9 and 10 explorer safely hides excluded/old rows; a destructive database cleanup requires client approval and backup.
