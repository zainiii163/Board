# Resource Verification Matrix — BoardNotes

**Date:** 2026-11-01  
**Rule:** A resource is **verified** only when subject, class, board, year, session/type, and accessible destination match. Class-archive URLs are **source links**, not individual hosted PDFs.

## Summary

| Status | Count (FBISE past papers) | Notes |
|---|---:|---|
| Source inventory (annotated sessions) | 89 | Live API `board=fbise` |
| Hosted `pdfUrl` verified downloads | 0 | No licensed exam PDFs uploaded |
| Pending / unavailable downloads | 89 | UI shows View source; Download gated |
| Class 11–12 inventory | 0 | Empty states only |
| Chemistry PBA (Class 10) | 1 source row | `driveUrl` → class archive; `pdfUrl` null |

## Class 9 FBISE (113.pdf)

Subjects (allowed): Biology, Chemistry, Physics, Computer Science, Mathematics, Islamiat, Tarjuma-tul-Quran, Urdu, English.  
Excluded from this interface only: Pakistan Studies.

| Session / type | Year | Per-subject rows | pdfUrl | driveUrl | Status |
|---|---|---|---|---|---|
| Paper Pattern | 2027 | 9 | null | class-9 archive | Source / pending PDF |
| Model Paper | 2027 | 9 | null | class-9 archive | Source / pending PDF |
| 2nd Annual | 2026 | 9 | null | class-9 archive | Source / pending PDF |
| 1st Annual | 2026 | 9 | null | class-9 archive | Source / pending PDF |
| 2nd Annual | 2025 | 9 | null | class-9 archive | Source / pending PDF |
| 1st Annual | 2025 | 9 | null | class-9 archive | Source / pending PDF |
| Model Paper | 2024 | 9 | null | class-9 archive | Source / pending PDF |

Old-syllabus archive rows: hidden in public UI/API policy; not destroyed.

## Class 10 FBISE (125.pdf)

Subjects (allowed): Biology, Chemistry, Physics, Computer Science, Mathematics, Urdu, Pakistan Studies, English.  
Excluded from this interface only: Islamiat.

| Session / type | Year | Scope | pdfUrl | Status |
|---|---|---|---|---|
| 2nd Annual | 2026 | 8 subjects | null | Source / pending PDF |
| 1st Annual | 2026 | 8 subjects | null | Source / pending PDF |
| Model Paper | 2025 | 8 subjects | null | Source / pending PDF |
| PBA | 2026 | Chemistry only | null | Source / pending PDF |

## Books & Notes

| Board | Class path | Verification |
|---|---|---|
| Federal (`fbise`) | Hierarchy Notes \| Books | Structure OK; textbook PDF licensing is client-owned |
| Punjab (`punjab`) | Hierarchy Notes \| Books | Structure OK; same content caveat |
| Excluded boards in Books selector | Lahore, D.G. Khan, KPK, Sindh, Oxford, Cambridge, APSACS | Hidden from Books & Notes nav; DB retained |

## Broken / misleading links

| Pattern | Finding | Mitigation |
|---|---|---|
| Many cards → one class archive URL | Expected until per-file PDFs exist | Label as View source; no fake Download |
| Invented individual PDF URLs | Not used | Policy enforced in seed + DownloadGate |
| `?view=past-papers` on board/class | Redirects to `/past-papers` (local; deploy pending) | Sitemap + search updated |

## How to promote a row to Verified

1. Obtain licensed/authorized PDF for exact board/class/subject/year/type.  
2. Upload via admin / uploads.  
3. Set `pdfUrl` on the matching `past_papers` row.  
4. Confirm View + Download against that file.  
5. Update this matrix row status to **Verified**.
