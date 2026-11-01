# PDF Requirements Completion Report — BoardNotes

**Audit date:** 2026-11-01  
**Git commit:** `d7f5b212dfcabf1cd237de21b2feb8432d782ed6` (`d7f5b21`)  
**Branch:** `fix/ui-responsive-past-papers-nav` (not merged to `main`)  
**Production data:** not modified  
**PDFs audited:** `111.pdf`, `113.pdf`, `123.pdf`, `125.pdf` only (no invented PDF sources)

## Review URLs

| Environment | Frontend | Backend | Notes |
|---|---|---|---|
| **Local (recommended)** | http://localhost:3000 | http://localhost:4000 | FE/BE verified `200` / health `ok` during this audit |
| Vercel Preview | https://board-3nll-git-fix-ui-responsive-pa-d8681d-zainiii163s-projects.vercel.app | https://board-gccf-git-fix-ui-responsive-pa-f15c61-zainiii163s-projects.vercel.app | Deployment Protection SSO — browser login required |
| Production (baseline, not this branch) | https://board-3nll.vercel.app | — | Still on older main until you approve merge |

**Key local routes:** `/` · `/fbise` · `/fbise/9` · `/fbise/10` · `/punjab` · `/punjab/10` · `/books` · `/past-papers`

Draft PR (do not merge until you approve): https://github.com/zainiii163/Board/pull/2

---

## Executive verdict

Structural client instructions from the four PDFs are **Implemented** on this commit for Past Papers policy/IA and Books & Notes board navigation. Remaining gaps are **content** (licensed individual PDFs, Class 11–12 inventory, Punjab curriculum depth) and one **Partial** CMS library listing on `/books` that still surfaces demo rows outside Federal/Punjab. No Incorrect UI policies found for annotated 113/125 subject removals.

No additional code fixes applied in this audit pass: remaining Incomplete items need client-supplied files or content decisions, not invented links.

---

## Live inventory check (local API, this audit)

| Metric | Result |
|---|---|
| FBISE rows | **88** |
| Class 9 subjects | Biology, Chemistry, Computer Science, English, Islamiat, Mathematics, Physics, Tarjuma-tul-Quran, Urdu |
| Class 9 Pakistan Studies | **0** |
| Class 10 subjects | Biology, Chemistry, Computer Science, English, Mathematics, Pakistan Studies, Physics, Urdu |
| Class 10 Islamiat | **0** |
| `syllabus=old` visible | **0** |
| Hosted `pdfUrl` | **0** (source archive links only) |
| Chemistry Class 10 PBA | present (`2026:pba`) |
| Class 9 Chemistry sessions | 2027 pattern/model, 2026 1st/2nd, 2025 1st/2nd, 2024 model |

---

## PDF-by-PDF checklist

Status legend: **Implemented** · **Partial** · **Missing** · **Incorrect**

### 111.pdf — FBISE Past Papers IA (reference site structure)

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 111.1 | Hero: “FBISE Past Papers, All in One Place” | **Implemented** | `/past-papers` H1 |
| 111.2 | Class selector 9–12 | **Partial** | Cards present; 11–12 “Inventory coming soon” (no annotated inventory — not fabricated) |
| 111.3 | Subject-led browsing + search | **Implemented** | Explorer chips + search box |
| 111.4 | Honest download vs source | **Implemented** | Hero “Browse… / View source”; Download only when `pdfUrl` set (`d7f5b21`) |
| 111.5 | Model / pattern / year sessions | **Implemented** | Session types in inventory + UI |
| 111.6 | Hosted free PDF downloads for every row | **Missing** | Content ops — `pdfUrl` still null for all 88 rows |
| 111.7 | Pixel-copy of fbisepastpapers.com branding/assets | N/A (IA reference only) | Not required; BoardNotes branding kept |

### 113.pdf — Class 9 FBISE annotations

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 113.1 | Remove Pakistan Studies (Class 9 past papers only) | **Implemented** | API + explorer chips; note remains on `/fbise/9` Books/Notes curriculum (out of past-paper scope) |
| 113.2 | Include Tarjuma-tul-Quran | **Implemented** | Class 9 subject list |
| 113.3 | New syllabus only; hide crossed-out old rows | **Implemented** | `old=0` in API; UI filters old |
| 113.4 | Annotated sessions (2026/2025 annuals, 2027 model/pattern, etc.) | **Implemented** (source inventory) | 9×7 session matrix; archive `driveUrl` |
| 113.5 | Exact per-paper PDF files | **Missing** | See `docs/MISSING_EXACT_RESOURCE_LINKS.md` |

### 125.pdf — Class 10 FBISE annotations

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 125.1 | Remove Islamiat (Class 10 past papers only) | **Implemented** | API + Class 10 chips |
| 125.2 | Keep Pakistan Studies | **Implemented** | Class 10 subjects |
| 125.3 | Hide old syllabus rows | **Implemented** | Policy + `old=0` |
| 125.4 | 2026 1st/2nd annual, 2025 model, Chemistry PBA | **Implemented** (source inventory) | Chem sessions include `pba` |
| 125.5 | Exact per-paper PDF files | **Missing** | Same content blocker as 113.5 |

### 123.pdf — Books & Notes vs Past Papers

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 123.1 | Books & Notes board selector = Federal + Punjab only | **Implemented** | `BOOKS_NOTES_BOARD_SLUGS`; header/home; footer Boards = Federal, Punjab, FBISE Past Papers |
| 123.2 | Exclude Lahore / D.G. Khan / KPK / Sindh / Oxford / Cambridge / APSACS from that selector | **Implemented** (nav) | Not in Books & Notes / footer board links |
| 123.3 | Remove Past Papers block from board/class Books & Notes pages | **Implemented** | `/fbise/9` Notes\|Books only |
| 123.4 | Dedicated Past Papers area | **Implemented** | `/past-papers` + header menu |
| 123.5 | `/books` resource library lists only Federal/Punjab | **Partial** | Page copy correct; CMS `/api/resources` demo rows still include Oxford/Sindh/Cambridge/AQA |
| 123.6 | Full licensed textbook/notes PDFs for all subjects | **Partial / Missing** | Hierarchy shows “notes pending” for most subjects; Math has chapters |

---

## Route visual review (this branch, local)

| Route | Desktop | Mobile | Result |
|---|---|---|---|
| `/` Home | `audit-home-1440.png` | `audit-home-375.png` | OK — Books/Notes/Past Papers messaging |
| `/fbise` | — | `audit-fbise-375.png` | OK — Notes\|Books, classes 5–12 |
| `/fbise/9` | `audit-fbise-9-1440.png` | (prior live `live-fbise-9-375.png`) | OK — no Past Papers block; Tarjuma present |
| `/punjab/10` | `audit-punjab-10-1440.png` | (prior `live-punjab-10-768.png`) | OK — Bio/Chem/Math curriculum depth limited |
| `/books` | `audit-books-1440.png` | — | Partial — Federal/Punjab copy; CMS mix remains |
| `/past-papers` Class 9 | `audit-past-papers-1440.png` | `audit-past-papers-375.png` | OK — Browse Federal; subject policy |
| `/past-papers` Class 10 | — | `audit-past-papers-class10-375.png` | OK — Pak Studies, no Islamiat |

### Before → after (Past Papers honesty / mobile chrome)

| Before (production baseline) | After (this branch) |
|---|---|
| `docs/qa-screenshots/live-past-papers-1440.png` (“Download Federal…”) | `docs/qa-screenshots/fix-past-papers-after-1440.png` + `audit-past-papers-1440.png` (“Browse Federal…”) |
| Mobile tab overlap / hero clip | `fix-past-papers-after-375.png` / `audit-past-papers-375.png` |

All audit shots live under `docs/qa-screenshots/audit-*.png`.

---

## Pending requirements (do not invent)

1. **Licensed individual exam PDFs** for Class 9/10 inventory rows (`pdfUrl` uploads) — blocked on client assets.  
2. **Class 11–12 FBISE past-paper inventory** — no annotated matrix in supplied PDFs.  
3. **`/books` CMS listing filter** to Federal/Punjab-only (and drop past-paper-type cards from that library) — clear intent, deferred here to avoid deleting seed/DB rows without content-ops plan.  
4. **Punjab Class 10 subject coverage** beyond Bio/Chem/Math — expand when licensed covers exist.  
5. **Voice-note transcription** (if any) — still blocked; nothing inferred.  
6. **Production merge / deploy** — waiting on your review approval.

---

## Incorrect items

None found for annotated subject/syllabus policies on Past Papers. Production main may still show older “Download Federal” copy until this branch ships.

---

## Sign-off gate

- [ ] You review local or Preview URLs above  
- [ ] You approve merge of PR #2  
- [ ] Only then: merge to `main` and production deploy  

**Do not merge or deploy until you approve.**
