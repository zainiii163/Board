# Client Requirements Audit — BoardNotes

**Audit date:** 2026-11-01  
**Live site:** https://board-3nll.vercel.app/  
**Reference sites:** https://studyplusplus.com/ · https://fbisepastpapers.com/  
**Primary specs:** `111(3).pdf`, `113(3).pdf`, `125(3).pdf`, `123(2).pdf` (handwritten annotations take priority)

## Architecture snapshot

| Layer | Stack | Notes |
|---|---|---|
| Frontend | Next.js 16 App Router, React 19 | Vercel `board-3nll` |
| Backend | Express 5 ESM | Vercel `board-gccf` |
| ORM / DB | Drizzle + PostgreSQL (Aiven) | In-memory store when DB unreachable |
| Past papers model | `past_papers` + FBISE source catalog merge | `pdfUrl` null until licensed upload; `driveUrl` → class archive |
| Books & Notes boards | Allowlist `fbise`, `punjab` | Other boards retained in DB; not deleted |

## Existing feature map

| Feature | Route / module | Status |
|---|---|---|
| Homepage | `/` | Live; Books & Notes cover grid Federal + Punjab |
| Books & Notes | `/books`, `/[board]`, `/[board]/[classSlug]` | Hierarchy Notes \| Books only (Past Papers removed from these pages) |
| Federal / Punjab boards | `/fbise`, `/punjab` | Primary Books & Notes destinations |
| Past Papers | `/past-papers` | Dedicated FBISE explorer + list filters |
| Class 9 / 10 FBISE | Explorer + seed catalog | Subject/session policy from 113/125 |
| Class 11 / 12 | Explorer cards | Empty until verified inventory |
| Subject / chapter / PDF | Hierarchy + `PdfSection` / `DownloadGate` | Download only when `pdfUrl` set |
| Search | `/search` + `/api/search` | Board filter Federal + Punjab; papers → `/past-papers` |
| Admin CMS | `/admin/*` | Past papers CRUD with syllabus / type / URLs |

## Requirement matrix

| PDF | Page | Exact client instruction | Existing implementation | Missing / gap | Required modification | Files / components | Status | Verification |
|---|---:|---|---|---|---|---|---|---|
| 123(2).pdf | 1 | Books & Notes: Federal + Punjab only; exclude Lahore, D.G. Khan, KPK, Sindh, Oxford, Cambridge, APSACS from this selector | `BOOKS_NOTES_BOARD_SLUGS` on home/header; footer trimmed to Federal + Punjab + Past Papers link | Books library categories may still list wider CMS tree | Keep allowlist; do not delete DB boards | `constants.ts`, `header.tsx`, `footer.tsx`, home | **COMPLETE** (UI) | Nav inspection; DB rows still present |
| 123(2).pdf | 1 | Remove Past Papers from end of Books & Notes | Hierarchy board/class pages no longer fetch or render past-paper blocks; `?view=past-papers` redirects to `/past-papers` | Older cached deploys may still show CTAs until redeploy | Done in this pass | `hierarchy-pages.tsx`, `[board]/page.tsx`, `[classSlug]/page.tsx` | **COMPLETE** | Route load + redirect |
| 123(2).pdf | 1 | Dedicated Past Papers route / clear nav separation | `/past-papers`, header Past Papers menu | — | Preserve | `past-papers/page.tsx`, header | **COMPLETE** | Live `/past-papers` |
| 123(2).pdf | 1 | Board → Class → Subject → Resource Type → Resource for books/notes | Hierarchy pages + books listing | Licensed textbook PDF inventory incomplete | Content ops, not schema | hierarchy + portal books | **PARTIAL** | Manual browse |
| 111(3).pdf | 1–7 | FBISE past papers IA: hero, search, class/subject/year, model/pattern/SLO-style resources, view/download | `FbisePastPapersExplorer` | Hosted exam PDFs not supplied; SLO labeled via paper-pattern / source | No fake PDFs | `fbise-past-papers-explorer.tsx` | **COMPLETE** (IA) / **PARTIAL** (files) | Live explorer + API count |
| 111(3).pdf | — | Classes 9–12 (SSC-I/II, HSSC-I/II) | Cards for 9–12; inventory for 9–10 | Class 11–12 empty | Seed only with verified sources | explorer + seed | **PARTIAL** | Empty states for 11–12 |
| 113(3).pdf | 2 | Class 9 subjects incl. Tarjuma; **remove Pakistan Studies** | `CLASS_9_SUBJECTS` + explorer `REQUIRED_SUBJECTS` + API policy filter | — | Keep class-scoped only | seed + explorer + `past-papers.service` | **COMPLETE** | `fbise-past-papers.test.ts` |
| 113(3).pdf | 3–9 | New syllabus sessions; cross out old syllabus | UI hides `old`; API policy hides old for Class 9/10 unless `syllabus=old` | Admin can still store archival rows | Preserve archival data | explorer, list, service | **COMPLETE** | Filter + tests |
| 113(3).pdf | 3–9 | 2026 Annual / 2025 1st & 2nd / 2027 model & pattern | Source catalog rows (`pdfUrl: null`, archive `driveUrl`) | Individual file URLs unavailable | Client PDF uploads | `seed-fbise-past-paper-sources.ts` | **COMPLETE** as inventory | Row count 89 |
| 125(3).pdf | 2 | Class 10 subjects; **remove Islamiat** | `CLASS_10_SUBJECTS` + explorer + API policy | — | Class-scoped only | same as above | **COMPLETE** | Tests |
| 125(3).pdf | 3–7 | 2026 1st/2nd annual distinct; 2025 model; PBA | Distinct `paperType` values; Chemistry PBA | Verified PBA PDF missing | Upload when licensed | seed + explorer | **COMPLETE** as inventory | Chemistry PBA row |
| 125(3).pdf | — | “Same as above” per subject | Expected sessions merged per subject; fake PDF not invented | Per-subject file parity unknown | Document pending per subject | explorer `mergeSubjectRows` | **PARTIAL** | Matrix below |
| Voice / ambiguous | — | Unclear handwritten or audio notes | Not inferred | Transcription / client confirm | Document only | — | **AMBIGUOUS / BLOCKED** | Ask client |

## Ambiguities (not guessed)

1. Whether every Class 9 subject truly has identical 2027 pattern/model files, or only a subset — UI shows pending/source until `pdfUrl` exists.
2. Whether Class 10 PBA applies only to Chemistry (annotated) or more science subjects — currently Chemistry only.
3. Class 11–12 session sets — no annotated inventory; not fabricated.
4. Voice-note attachment from prior delivery — transcription unavailable; no silent requirements applied.

## Duplicate / broken content findings

| Issue | Disposition |
|---|---|
| Past Papers mixed into Books & Notes pages | Removed in this pass |
| Search results linking papers to `/{board}/{class}?view=past-papers` | Redirected target `/past-papers?...` |
| Sitemap deep links to `?view=past-papers` | Updated to `/past-papers?board=&class=` |
| Multiple paper cards sharing one class archive URL | Intentional source link; download gated on `pdfUrl` |
| Null/empty titles | Guarded in create validation; empty states in UI |
| Excluded boards still in DB | Retained by design |

## Live / reference comparison (audit pass)

| Check | Result |
|---|---|
| Live `/api/past-papers` inventory | ~89 FBISE annotated source rows (prior live check) |
| Live FE Tarjuma / Class 9 policy markers | Present on prior deploy; this pass adds API-side policy + Books/Notes separation |
| studyplusplus.com | Structural reference for Federal/Punjab books organization only |
| fbisepastpapers.com | Structural reference for class → subject → session; assets not copied |

## Phase readiness after this audit

| Phase | Ready to implement / verify |
|---|---|
| 2 Books & Notes | Gaps closed in code (separation + allowlist); content licensing still external |
| 3–5 Past Papers | IA + policy complete; PDF file verification blocked on licensed uploads |
| 6–7 Backend / resources | Schema adequate; no destructive migration required |
| 8–9 QA | Regression + targeted browser checks |
| 10 Reports | This file + implementation / resource / QA reports |
