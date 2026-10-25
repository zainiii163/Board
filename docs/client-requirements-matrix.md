# Client requirements matrix

Status reflects the implementation in this workspace, not an assertion that third-party PDFs have been supplied.

| PDF | Page | Annotated instruction | Class | Subject | Resource/session | Action | Verification |
|---|---:|---|---|---|---|---|---|
| 123.pdf | 1 | Remove Past Papers from Books & Notes | All | — | Navigation | REMOVE | **COMPLETE** — Books/Notes and Past Papers use separate routes; header Past Papers → `/past-papers`. |
| 123.pdf | 1 | Keep Federal and Punjab Boards; remove Lahore, D.G. Khan, KPK, Sindh, Oxford, Cambridge and APSACS from the requested Books & Notes list | Books & Notes | — | Board selector | REORGANIZE | **COMPLETE** — UI allowlist `BOOKS_NOTES_BOARD_SLUGS` (`fbise`, `punjab`) applied to home cover grid, Boards menu, Books & Notes nav, and hero search. Other boards remain in DB/API for Past Papers and deep links (not deleted). |
| 123.pdf | 1 | Match book/note names to Study++ | All | — | Books / notes | VERIFY | **PARTIAL** — hierarchy and naming reviewed against Study++; no third-party books copied. Resource-by-resource licensed PDF inventory still needed from the client. |
| 123.pdf | 1 | Add a dedicated Federal Board Past Papers area with Class 9–12 links | 9–12 | — | Past papers | ADD | **PARTIAL** — `/past-papers` FBISE explorer is live for Classes present in inventory (seeded 9–10). Classes 11–12 need seeded inventory or client PDFs. |
| 123.pdf | 1 | Class 9: remove Pakistan Studies; add Tarjuma-tul-Quran | 9 | Pakistan Studies / Tarjuma-tul-Quran | Subject list | REMOVE / ADD | **COMPLETE** — seed + explorer policy; regression tests cover subject lists. |
| 123.pdf | 1–2 | 2027 paper pattern and model paper; 2026 2nd/1st annual; 2025 2nd/1st annual; 2024 model paper | 9 | Per allowed subject | New syllabus | ADD | **COMPLETE** as source inventory records (`pdfUrl: null`, `driveUrl` → class archive). Not claimed as hosted PDFs. |
| 111.pdf | 1–7 | Use the Federal Board reference information architecture | 9–12 | — | Home / class navigation | REORGANIZE | **COMPLETE** for explorer IA (class → subject → sessions, search, source vs download, empty states). |
| 113.pdf | 2 | Do not include Pakistan Studies | 9 | Pakistan Studies | Subject list | REMOVE | **COMPLETE** |
| 113.pdf | 2 | Include Biology, Chemistry, Physics, Computer Science, Mathematics, English, Urdu, Islamiat and Tarjuma Quran | 9 | Listed subjects | Subject list | ADD / KEEP | **COMPLETE** — label “Tarjuma-tul-Quran”. |
| 113.pdf | 3–9 | New syllabus only; do not add the crossed-out old-syllabus rows | 9 | Listed subjects | Old syllabus | REMOVE | **COMPLETE** — Class 9 UI hides `old` syllabus rows. |
| 113.pdf | 3–9 | Same requested sessions above across subject pages | 9 | Listed subjects | Current sessions | REORGANIZE | **COMPLETE** as source inventory; download appears only when `pdfUrl` is set. |
| 125.pdf | 2 | Exclude Islamiat | 10 | Islamiat | Subject list | REMOVE | **COMPLETE** |
| 125.pdf | 3–7 | New syllabus; 2026 1st and 2nd annual, 2025 model papers; assessment practice where marked | 10 | Listed subjects | Current sessions | ADD | **COMPLETE** as source inventory; Chemistry includes PBA. |
| 125.pdf | 3–7 | Do not add crossed-out older annual rows | 10 | Listed subjects | Old syllabus | REMOVE | **COMPLETE** — Class 10 UI hides `old` syllabus rows. |

## Status legend

- **COMPLETE** — implemented and verified in code/tests (not necessarily with client-owned PDFs).
- **PARTIAL** — implemented but content or verification incomplete.
- **BLOCKED** — cannot finish without an unavailable dependency.
- **NEEDS CLIENT APPROVAL** — product decision required.

## Clarifications required (NEEDS CLIENT APPROVAL)

1. Actual exam PDF file URLs / licensed uploads were not supplied. Rows are source records, not local PDFs.
2. Confirm whether “Model paper 2027 onward” should create future years prospectively or only after official release.
3. Confirm whether Class 11–12 FBISE past-paper inventory should mirror Class 9/10 session sets.
4. Audio attachment could not be transcribed earlier; no instruction from it was applied.
