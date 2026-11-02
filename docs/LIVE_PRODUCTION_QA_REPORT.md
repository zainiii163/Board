# LIVE Production QA Audit — BoardNotes

**Date:** 2026-11-01  
**Frontend:** https://board-3nll.vercel.app  
**Backend:** https://board-gccf.vercel.app  
**Compared to:** `docs/FINAL_QA_REPORT.md`  
**Method:** Live HTTP requests + browser automation (375 / 768 / 1440). No production writes, no deploy, no push.

---

## Overall verdict

### **CONDITIONAL PASS** (structure & policy) / **FAIL** (exact exam PDF content)

Client IA and class policies are live and working. Exact downloadable exam PDFs are still **missing** (0 hosted `pdfUrl`). Archive “View source” links must not be treated as verified individual papers.

---

## 6. Is commit `b81efd8` deployed to production?

| Check | Result |
|---|---|
| `b81efd8` ancestor of `origin/main` | **YES** (`git merge-base --is-ancestor` exit 0) |
| Production merge commit | **`8deaad9`** (PR #1 merge of the release branch) |
| Vercel `board-3nll` on `8deaad9` | **success** |
| Vercel `board-gccf` on `8deaad9` | **success** |
| GitHub Production deployment | `8deaad9` Production – board @ 2026-11-01T19:29:39Z |

**Answer:** Production is on merge **`8deaad9`**, which **includes** `b81efd8`. The release commit’s changes are live.

---

## HTTP route matrix

| URL | Status | Notes |
|---|---:|---|
| `/` | 200 | Homepage loads |
| `/books` | 200 | Books & Notes library |
| `/fbise` | 200 | Federal board |
| `/fbise/9` | 200 | Multi-subject curriculum |
| `/fbise/10` | 200 | Multi-subject curriculum |
| `/punjab` | 200 | Punjab board |
| `/punjab/10` | 200 | Bio/Chem pending + Math notes |
| `/past-papers` | 200 | FBISE explorer |
| `/search` | 200 | Search |
| `/fbise/9/physics` | 200 | Notes pending empty shell |
| `/fbise/9?view=past-papers` | 200* | Browser navigates to `/past-papers?board=fbise&class=9`; raw curl sees 200 without `Location` (RSC/client redirect behavior) |
| `/api/health` | 200 | `{"status":"ok",...}` |

---

## Requirement matrix vs annotated PDFs

| PDF / req | Live check | Verdict |
|---|---|---|
| **123** Federal + Punjab Books & Notes | Footer boards: Federal, Punjab, FBISE Past Papers only (`href="/apsacs"` / `/oxford` absent on `/fbise/9`) | **PASS** |
| **123** Past Papers separated from Books pages | `/fbise/9` Notes\|Books only; no “View Class 9 past papers” CTA | **PASS** |
| **111** FBISE past papers IA | Hero, class cards 9–12, subject chips, search, sessions | **PASS** |
| **113** Class 9 subjects; no Pakistan Studies; Tarjuma | API + UI: Pak Studies absent; Tarjuma present | **PASS** |
| **113** New syllabus sessions 2025–2027 | API sessions present for pattern/model/annuals | **PASS** (inventory only) |
| **113** Old syllabus hidden | `oldSyllabusVisible=false` on public API | **PASS** |
| **125** Class 10 no Islamiat; Pak Studies kept | UI chips + API | **PASS** |
| **125** Distinct 1st/2nd annual + Chemistry PBA | API has `pba` Chemistry 2026; `pdfUrl` null | **PASS** (inventory) / **FAIL** (exact PDF) |
| Exact downloadable PDFs | `withPdf=0`; HTML `Download PDF` count **0**; `PDF pending` + `View source` present | **PASS** (no fake downloads) |
| Class 11–12 | “Inventory coming soon” | **PASS** (honest empty) |

---

## API / resource findings

| Metric | Value |
|---:|---|
| FBISE past-paper rows | 89 |
| Hosted `pdfUrl` | **0** |
| Archive `driveUrl` only | 88 |
| Neither pdf nor drive | **1** — Class 9 Mathematics 2026 `model` (`id=1`) |
| Class-archive destinations | `fbisepastpapers.com/class-9-…` (63) · `class-10-…` (25) |

**Fake PDF check:** **PASS** — no Download PDF buttons without `pdfUrl`.

---

## Viewport / UX

| Viewport | Routes checked | Result |
|---|---|---|
| **375px** | Home, `/fbise/9`, `/past-papers` | Mobile nav works; document `scrollWidth` = client width. Bottom nav **intercepted** a subject click on past-papers (fixed bar covers content). |
| **768px** | `/punjab/10` | Notes\|Books, pending cards OK. Screenshot: `docs/qa-screenshots/live-punjab-10-768.png` |
| **1440px** | `/past-papers` | Desktop header menus OK. Hero screenshot shows **clipped heading** (“FBISE Past Pape…” / “Place”) — visual truncation risk. Screenshot: `docs/qa-screenshots/live-past-papers-1440.png` |

Screenshots also: `docs/qa-screenshots/live-fbise-9-375.png`

---

## Problems found

| ID | Severity | Problem | Evidence | Recommended fix |
|---|---|---|---|---|
| P1 | **High (content)** | No exact exam PDFs; all rows archive or pending | API `withPdf=0` | Client-authorized uploads → set `pdfUrl` |
| P2 | Medium | Orphan inventory row: Math Class 9 2026 model has **null** `driveUrl` and `pdfUrl` | API `id=1` | Admin: attach class-9 archive `driveUrl` or remove/hide empty row |
| P3 | Medium | Past-papers hero marketing says “Download…” while UI correctly shows View source / PDF pending | Live hero copy | Soften copy to “Browse sources / download when uploaded” |
| P4 | Medium | Mobile bottom nav intercepts mid-page clicks | Browser click on Chemistry blocked by Boards tab | Add bottom padding / scroll-margin; raise z-index discipline |
| P5 | Low | `/fbise/9?view=past-papers` does not emit HTTP `Location` for plain curl (browser still lands on past-papers) | curl headers 200 | Prefer middleware/`next.config` redirect for crawlers |
| P6 | Low | Desktop past-papers hero text clipping in screenshot | 1440 screenshot | Check overflow/width of gradient hero text |
| P7 | Low / content | Punjab Class 10 only 3 curriculum subjects (Bio/Chem/Math) | API + UI | Expand Punjab cover catalog when licensed assets exist |
| P8 | Docs drift | `FINAL_QA_REPORT.md` still says live not deployed | Doc §2 | Update docs to reflect `8deaad9` live |

---

## Comparison to `FINAL_QA_REPORT.md`

| Prior report claim | Live now |
|---|---|
| “Live site not yet on this commit” | **Outdated** — merge `8deaad9` containing `b81efd8` is production |
| Footer still old boards | **Fixed** on audited pages |
| 0 hosted PDFs | **Still true** |
| Class 11–12 empty | **Still true** |
| Mobile bottom nav friction | **Still true** (confirmed intercept) |

---

## PASS / FAIL summary

| Area | Result |
|---|---|
| Deploy of release changes | **PASS** (`b81efd8` ⊆ `8deaad9`) |
| Homepage / Books / FBISE / Punjab routes | **PASS** (HTTP 200) |
| Books vs Past Papers separation | **PASS** |
| Class 9 / 10 FBISE subject policy | **PASS** |
| No fake downloadable PDFs | **PASS** |
| Exact verified exam PDFs | **FAIL** (0/89) |
| Responsive polish | **CONDITIONAL PASS** (nav intercept + hero clip) |
| Full client PDF content acceptance | **FAIL** until licensed files exist |

### Final recommendation

**Accept for staging / client structural review.**  
**Do not claim production content-complete** until exact PDFs are uploaded and P2–P6 are addressed.

No production modifications were made during this audit.
