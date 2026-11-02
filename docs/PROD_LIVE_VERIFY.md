# Production live verify — 2026-11-02

**Commit on main (prior merge):** `994d720` (includes `380df59` PDF UI fixes)  
**Live FE:** https://board-3nll.vercel.app/  
**Live BE:** https://board-gccf.vercel.app/

## Automated checks (`scripts/prod-verify.mjs`)

| Check | Result |
|---|---|
| `/`, `/past-papers`, `/books`, `/fbise/9`, `/punjab/10` | HTTP 200 |
| Past Papers hero “Browse Federal” | Present; “Download Federal” absent |
| `/oxford` / `/apsacs` hrefs on key pages | Absent |
| FBISE past-papers API | 88 rows; Class 9 no Pak Studies; Class 10 no Islamiat; `pdfUrl`=0; `old`=0 |
| `/api/resources?scope=books-notes` | 104 rows; boards = Federal + Punjab only; bad matches = 0 |
| Live `/books` | Shows **104 resources**; category filter Text Books + Notes only |

## PDF policy on production

| PDF | Live status |
|---|---|
| 111 IA | Pass |
| 113 Class 9 subjects / new syllabus | Pass |
| 125 Class 10 subjects / PBA inventory | Pass |
| 123 Books Federal+Punjab + Past Papers separation | Pass |

## Remaining content (not inventable)

- Hosted exam Word/PDF files still missing (`pdfUrl` null)
- Class 11–12 past-paper inventory empty until annotated sources supplied
