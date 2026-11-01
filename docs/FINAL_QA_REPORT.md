# Final QA Report — BoardNotes Client Requirements

**Date:** 2026-11-01 (stabilization pass)  
**Repo:** `https://github.com/zainiii163/Board.git` · branch `main`  
**Targets:** Frontend Vercel `board-3nll` · Backend Vercel `board-gccf`  
**Companion docs:** `CLIENT_REQUIREMENTS_AUDIT.md`, `CLIENT_IMPLEMENTATION_REPORT.md`, `RESOURCE_VERIFICATION_MATRIX.md`, `MISSING_EXACT_RESOURCE_LINKS.md`

---

## 1. Test results

| Check | Command / method | Result |
|---|---|---|
| Backend unit/integration (isolated demo CMS) | `npm test -w backend` | **8/8 PASS** |
| Backend TypeScript | `npx tsc -p tsconfig.json --noEmit` | **PASS** |
| Frontend TypeScript | `npx tsc --noEmit` | **PASS** |
| Frontend production build | `npm run build` (frontend) | **PASS** |
| FBISE inventory policy | `past-paper-inventory.test.ts` | **PASS** — 89 archive rows, `pdfUrl` always null in catalog |
| Curriculum merge | `curriculum-merge.test.ts` + local `/fbise/9`, `/punjab/10` | **PASS** — not Math-only |
| Live API inventory | `GET https://board-gccf.vercel.app/api/past-papers?board=fbise` | **89** rows; **0** hosted PDFs |
| Live Class 9/10 subject policy | Live API grouping | Class 9 excludes Pakistan Studies; Class 10 excludes Islamiat; Chemistry PBA present |
| Browser smoke (local) | `/fbise/9`, `/punjab/10`, `/fbise/9/physics` | **PASS** — pending shells labeled; Past Papers removed from Books pages |
| Browser smoke (live) | `/past-papers` @ ~375px | **PASS** for IA; footer still shows old board links until FE deploy |

### Root cause of prior `demo-api.test.ts` failures

Failures were **database seed drift against live Aiven**, not API regressions in the demo hierarchy.  
Fix: `BOARDNOTES_DATA_MODE=demo` via `backend/src/test-setup.ts` + `initDbMode()` short-circuit so tests use deterministic in-memory CMS.

---

## 2. Remaining failures / non-blockers

| Item | Severity | Notes |
|---|---|---|
| Licensed exam PDFs missing | **Content blocker** | 0 exact `pdfUrl` values; Download correctly disabled |
| Class 11–12 past-paper inventory | Content | Empty states only — no invented rows |
| Live site not yet on this commit | Deploy lag | Local verified; production still shows old footer / class Past Papers CTA until deploy |
| Mobile bottom nav overlap on past-papers hero | Low UX | Pre-existing; does not break navigation |

---

## 3. Verified resource counts

| Category | Count | Meaning |
|---:|---:|---|
| FBISE annotated source inventory rows | 89 | Metadata + class-archive `driveUrl` |
| Exact hosted exam PDFs (`pdfUrl`) | **0** | Not verified downloads |
| Chemistry PBA source rows | 1 | Archive link only |
| Class 11–12 seeded sessions | 0 | Coming soon |

---

## 4. Missing PDF counts

| Missing exact paper files | 89 / 89 inventory rows |
|---|---|
| See | `docs/MISSING_EXACT_RESOURCE_LINKS.md` |

**Do not claim** 2026 Second Annual or 2027 model/pattern as verified BoardNotes downloads. They are source-inventory placeholders pointing at class archives.

---

## 5. Frontend deployment readiness

| Item | Status |
|---|---|
| Typecheck + production build | Ready |
| Books & Notes Federal/Punjab allowlist | Ready (code) |
| Past Papers removed from Books hierarchy | Ready (code) |
| Empty subject shells labeled | Ready (code) |
| Past-paper “PDF pending” badge | Ready (code) |
| Env keys present locally | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL` set (values not printed) |
| Must point at | `https://board-gccf.vercel.app` in Vercel FE project |

**Frontend: READY TO DEPLOY** after commit/push of this pass.

---

## 6. Backend deployment readiness

| Item | Status |
|---|---|
| Typecheck | Ready |
| Isolated tests | Ready (8/8) |
| Curriculum merge for sparse subjects | Ready |
| FBISE public subject/syllabus policy | Ready |
| No destructive migration in this pass | Confirmed |
| Env keys present locally | `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`, `PORT`, `NODE_ENV` set (values not printed) |
| CORS must allow | `https://board-3nll.vercel.app` (and preview URLs if used) |

**Backend: READY TO DEPLOY** after commit/push of this pass.  
Deploy **backend first**, then frontend, so curriculum merge is live when FE class pages refresh.

---

## 7. Environment configuration checks (no secrets)

### Frontend Vercel (`board-3nll`)
- Root: `frontend/`
- Required: `NEXT_PUBLIC_API_URL=https://board-gccf.vercel.app`
- Required: `NEXT_PUBLIC_SITE_URL=https://board-3nll.vercel.app`
- Rebuild after changing `NEXT_PUBLIC_*`

### Backend Vercel (`board-gccf`)
- Root: `backend/`
- Required: `DATABASE_URL` (Aiven)
- Required: `JWT_SECRET` (strong, non-default)
- Required: `CORS_ORIGINS` includes frontend origin
- Optional: `SEED_BACKFILL=true` only for a **one-time** authorized backfill — not required for this deploy (merge covers listing)
- Do **not** set `BOARDNOTES_DATA_MODE=demo` in production

---

## 8. Post-deployment QA checklist

1. `GET https://board-gccf.vercel.app/api/health` → healthy  
2. `GET .../api/boards/fbise/classes/9` → multiple subjects + `chapterCount`  
3. `GET .../api/past-papers?board=fbise` → ≥89; Class 9 no Pakistan Studies; Class 10 no Islamiat; Chemistry PBA; no fake pdfUrl  
4. Open `https://board-3nll.vercel.app/fbise/9` → multi-subject; no Past Papers section; pending labels  
5. Open `/punjab/10` → curriculum subjects beyond Math  
6. Open `/past-papers` → Class 9/10 policy; View source; PDF pending / no Download without pdfUrl  
7. Open `/fbise/9/physics` → Notes pending empty state  
8. Mobile 375 / tablet 768 / desktop 1440 spot check: home, books, fbise, past-papers, search  
9. Confirm footer Boards = Federal, Punjab, FBISE Past Papers  
10. Browser console: no hard API failures on those routes  

---

## 9. Rollback procedure

1. In Vercel, promote the previous successful deployment for `board-gccf`, then `board-3nll` (or redeploy prior git SHA).  
2. Prefer rolling backend back first if API contract breaks FE.  
3. Do **not** run DB truncate/reset. Schema was not destructively migrated in this pass.  
4. If a mistaken `SEED_BACKFILL` ran, restore from Aiven backup only with explicit approval.  

---

## 10. Final GO / NO-GO

| Decision | Verdict |
|---|---|
| **Staging / client-review deploy** | **GO** — deploy this branch’s FE+BE |
| **Production content approval (exam PDFs)** | **NO-GO** until licensed exact PDFs are uploaded and verified |
| **Automatic production deploy by agent** | **NOT PERFORMED** |

**Overall:** Code-level blockers for this requirements pass are cleared. Remaining blockers are **external content** (exact PDFs, Class 11–12 inventory) and **your deploy authorization**.

---

## Exact next steps for you (safe Vercel deploy)

1. **Commit & push** the current `main` changes to `origin` (or open a PR and merge).  
2. In Vercel project **board-gccf** (backend): confirm env vars above → **Deploy** (or auto-deploy from push).  
3. Wait until `https://board-gccf.vercel.app/api/health` and `/api/boards/fbise/classes/9` show multi-subject merge.  
4. In Vercel project **board-3nll** (frontend): confirm `NEXT_PUBLIC_API_URL=https://board-gccf.vercel.app` → **Deploy** / rebuild.  
5. Run the post-deployment checklist in §8.  
6. Only after checklist passes, share staging URL with the client.  
7. Do **not** mark exam papers as downloadable until individual authorized PDFs are attached in admin.
