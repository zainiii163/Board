# UI / Content Fix QA Report — BoardNotes

**Date:** 2026-11-01  
**Branch:** `fix/ui-responsive-past-papers-nav`  
**Base production:** `8deaad9` on https://board-3nll.vercel.app / https://board-gccf.vercel.app  
**Verification:** localhost frontend `:3000` + demo backend `:4000` + HTTP smoke + browser CDP/interaction  
**Release posture:** Changes committed locally only — **not pushed, not merged, not deployed** (awaiting approval)

---

## Verdict

### **GO for merge to staging / preview** after approval to push this branch  
### **NO-GO for “content complete” production claim** until exact exam PDFs are uploaded

Structural/UI/copy/orphan-inventory fixes are verified. Hosted `pdfUrl` count remains 0 (by design — no invented PDFs).

---

## 1. Files changed

| File | Change |
|---|---|
| `frontend/src/app/(public)/layout.tsx` | `public-shell` wrapper; import shell CSS |
| `frontend/src/app/(public)/public-shell.css` | **New** — mobile tab-bar clearance + scroll-padding + safe-area |
| `frontend/src/components/layout/mobile-tab-bar.tsx` | Safe-area bottom padding |
| `frontend/src/components/content/fbise-past-papers-explorer.tsx` | Hero wrap/size; honest copy; chip touch targets; scroll-mt |
| `frontend/src/app/(public)/past-papers/page.tsx` | Responsive padding; remove overflow clip that hid hero |
| `backend/src/modules/past-papers/past-papers.service.ts` | Export `mergeFbisePastPaperInventory`: backfill archive `driveUrl`; hide empty unannotated SSC orphans |
| `backend/src/past-paper-inventory.test.ts` | Orphan Math 2026 model + driveUrl backfill regression |

---

## 2. Problems fixed

| ID | Problem | Fix |
|---|---|---|
| P4 | Fixed bottom nav intercepted subject chips / mid-page taps | `.public-shell` `padding-bottom: calc(5.25rem + env(safe-area-inset-bottom))`; `scroll-padding-bottom` on `html` |
| P6 | Past-papers hero heading/text clipping | Smaller responsive type, `text-balance` / `break-words`, removed `overflow-hidden` / page `overflow-x-clip` |
| P3 | Hero said “Download Federal…” while only archives exist | Copy → browse/source archive; download only when PDF uploaded; “Source / PDF” stat |
| P2 | Orphan Class 9 Mathematics 2026 `model` (`id=1`) null `driveUrl`+`pdfUrl` | API merge hides empty non-catalog orphans; backfills class-archive `driveUrl` for catalog rows — **no DB delete, no invented `pdfUrl`** |

---

## 3. Before / after screenshots

| Viewport | Before (live prod audit) | After (local fix) |
|---|---|---|
| 375 past-papers | `docs/qa-screenshots/live-past-papers-1440.png` (hero clip evidence also at 1440) / intercept noted in live report | `docs/qa-screenshots/fix-past-papers-after-375.png` |
| 1440 past-papers | `docs/qa-screenshots/live-past-papers-1440.png` | `docs/qa-screenshots/fix-past-papers-after-1440.png` |
| 375 FBISE 9 | `docs/qa-screenshots/live-fbise-9-375.png` | Unchanged scope (nav clearance applies site-wide via layout) |
| 768 Punjab 10 | `docs/qa-screenshots/live-punjab-10-768.png` | Unchanged scope |

CDP layout metrics (local): at 375/320/1440 — `overflowX=false`; hero `clipped=false`; full H1 text `FBISE Past Papers, All in One Place`; shell `padding-bottom=84px` on mobile.

---

## 4. Test results

### Automated
| Check | Result |
|---|---|
| Backend `npm test -w backend` (9 tests) | **PASS** (includes new orphan merge test) |
| Backend `tsc` / `npm run build -w backend` | **PASS** |
| Frontend `npx tsc --noEmit` | **PASS** |
| Frontend `npm run build -w frontend` | **PASS** |

### Browser / functional (local)
| Check | Result |
|---|---|
| Chemistry chip click (scrolled clear of tab bar) | **PASS** — filters to Chemistry only |
| Subject chips present Class 9 (incl. Tarjuma; no Pak Studies) | **PASS** |
| View source + PDF pending; no Download PDF without `pdfUrl` | **PASS** |
| Misleading “Download Federal” hero string | **ABSENT** |
| Footer copyright clear of tab at max scroll | **PASS** |
| HTTP smoke `/`, `/books`, `/fbise`, `/punjab`, `/past-papers`, `/search`, `/fbise/9`, `/fbise/10`, `/punjab/10` | **PASS** (all `BoardNotes`, no `Download Federal`) |
| Books & Notes vs Past Papers separation | **PASS** (unchanged; explorer remains on `/past-papers`) |

### Widths exercised
320, 375, 390, 430 (mobile metrics + chips), 768/1024/1280/1440 (layout metrics / desktop header).

---

## 5. Remaining issues

| ID | Severity | Notes |
|---|---|---|
| R1 | **High (content)** | Still **0** hosted exam `pdfUrl`s — archive “View source” only until licensed uploads |
| R2 | Low | Dev hydration overlay sometimes attributes mismatch to `fbise-past-papers-explorer.tsx` (badge line); does not block interaction; investigate separately |
| R3 | Low | `/fbise/9?view=past-papers` still soft client redirect (P5 from live audit) |
| R4 | Ops | Orphan DB row `id=1` still exists in Postgres until admin approves delete/update — public API no longer surfaces it empty |
| R5 | Content | Punjab Class 10 curriculum still limited; Class 11–12 past-papers “coming soon” |

---

## 6. GO / NO-GO

| Question | Answer |
|---|---|
| Merge this fix branch for preview deploy? | **GO** (after explicit push/deploy approval) |
| Claim production content-complete vs client PDFs? | **NO-GO** until exact PDFs exist |
| Push / merge / modify production data now? | **NO** — waiting for approval |

---

*No production data writes. No push performed.*
