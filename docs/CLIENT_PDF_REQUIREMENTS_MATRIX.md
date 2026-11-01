# Client PDF requirements matrix

Canonical audit for this delivery: `docs/CLIENT_REQUIREMENTS_AUDIT.md`.  
Also see `docs/CLIENT_IMPLEMENTATION_REPORT.md`, `docs/RESOURCE_VERIFICATION_MATRIX.md`, `docs/FINAL_QA_REPORT.md`.  
Older detailed matrix: `docs/client-requirements-matrix.md`.

| Source | Page(s) | Exact visual instruction / outcome | Module | Status | Verification |
|---|---:|---|---|---|---|
| 111.pdf | 1–7 | FBISE-style hierarchy: hero, class selector, subject-led browsing, search and resource actions | `/past-papers`, `FbisePastPapersExplorer` | COMPLETE | Explorer and responsive screenshots. |
| 113.pdf | 2 | Remove Pakistan Studies from Class 9 only | Class 9 FBISE policy | COMPLETE | `CLASS_9_SUBJECTS` regression test and explorer filter. |
| 113.pdf | 2 | Include Tarjuma Quran with listed Class 9 subjects | Class 9 FBISE policy | COMPLETE | Standardised as `Tarjuma-tul-Quran`; regression test. |
| 113.pdf | 3–9 | New syllabus only; crossed-out old rows not visible | Class 9 FBISE policy | COMPLETE | `syllabus !== "old"` client policy. |
| 113.pdf | 3–9 | Current sessions plus annotated 2027 pattern/model references | Class 9 source inventory | COMPLETE AS SOURCE INVENTORY | 9 subjects × 7 typed records; no fabricated local PDF URL. |
| 125.pdf | 2 | Remove Islamiat from Class 10 only | Class 10 FBISE policy | COMPLETE | `CLASS_10_SUBJECTS` regression test and explorer filter. |
| 125.pdf | 3–7 | 2026 first/second annual; model papers from 2025; marked PBA | Class 10 source inventory | COMPLETE AS SOURCE INVENTORY | 8 subjects × 3 records plus Chemistry PBA. |
| 125.pdf | 3–7 | Crossed-out old paper rows not visible | Class 10 FBISE policy | COMPLETE | `syllabus !== "old"` client policy. |
| Books & Notes annotated screenshot | 123.pdf p. 1 | Federal/Punjab only in client-facing Books & Notes; separate Past Papers area | navigation/home/books search | COMPLETE | `BOOKS_NOTES_BOARD_SLUGS` applied without deleting DB content. |
| Voice note | — | Detailed transcription unavailable | Requirements source | BLOCKED | Local transcription stalled; no unverified voice instruction was inferred. |

## Controlled deviations

1. Generic class archive URLs are source links, not files. Download UI requires an uploaded `pdfUrl`.
2. Class 11 and Class 12 do not have an annotated source inventory; they are not manufactured.
3. The reference sites guide information architecture, not visual asset copying.
