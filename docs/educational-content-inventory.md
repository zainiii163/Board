# Educational content inventory

## Verified source organisation

- Study++ presents Federal Board classes 5–12 and Punjab Board classes 9–12 for books/notes.
- BoardNotes Books & Notes UI now surfaces **Federal + Punjab only** (other boards remain in DB for Past Papers).

## Implemented FBISE source records (QA DB count: 88)

| Class | Included subjects | Requested resource labels | Hosted PDF? |
|---|---|---|---|
| 9 (SSC Part I) | Biology, Chemistry, Physics, Computer Science, Mathematics, English, Urdu, Islamiat, Tarjuma-tul-Quran | 2027 Paper Pattern, 2027 Model Paper, 2026 2nd/1st Annual, 2025 2nd/1st Annual, 2024 Model Paper | **No** — `pdfUrl` null; `driveUrl` → class archive |
| 10 (SSC Part II) | Biology, Chemistry, Physics, Computer Science, Mathematics, English, Urdu, Pakistan Studies | 2026 2nd/1st Annual, 2025 Model Paper; 2026 PBA for Chemistry | **No** — same |

## Explicit exclusions

- Class 9: Pakistan Studies and all old-syllabus rows (UI + seed).
- Class 10: Islamiat and all old-syllabus rows (UI + seed).

## Missing assets (do not invent)

| Gap | Notes |
|---|---|
| Client-provided exam PDFs | Required before Download buttons appear |
| Per-session deep links | Current `driveUrl` is class-level archive only |
| Class 11–12 FBISE past-paper inventory | Explorer ready; seed not populated |
| Licensed textbook PDFs / covers | Some cover URLs 404; replace with approved assets |
| Study++ name-for-name book parity | Hierarchy reviewed; full resource mapping needs client list |
