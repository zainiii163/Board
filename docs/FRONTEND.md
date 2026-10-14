# Frontend Report

Next.js 16 App Router frontend for BoardNotes.

- **Root:** `frontend/`
- **Framework:** Next.js `16.3.1` (pinned exactly) + React `19.2.8`
- **Port:** 3000
- **Scale:** 167 `.ts`/`.tsx` files, ~16,500 lines, 61 route pages

---

## 1. Directory layout

```
frontend/
├── .env.example
├── .env.local
├── eslint.config.mjs        flat config (next lint removed in v16)
├── next-env.d.ts            auto-generated
├── next.config.ts           rewrites, redirects, image config
├── postcss.config.mjs
├── tsconfig.json
│
├── public/
│   ├── sw.js                hand-written service worker (89 lines)
│   └── icon.svg, file.svg, globe.svg, next.svg, vercel.svg, window.svg
│
└── src/
    ├── app/
    │   ├── layout.tsx       RootLayout (async, cookie-driven theme)
    │   ├── globals.css      622 lines — Tailwind v4 + design tokens
    │   ├── manifest.ts
    │   ├── robots.ts
    │   ├── sitemap.ts
    │   ├── favicon.ico
    │   │
    │   ├── (public)/        38 pages — PublicLayout chrome
    │   └── (admin)/         23 pages — AdminShell chrome
    │
    ├── components/          79 .tsx across 7 groups
    │   ├── providers.tsx    Locale → Theme → Auth context stack
    │   ├── admin/           6 files
    │   ├── auth/            3 files
    │   ├── content/         43 files — page-level content blocks
    │   ├── layout/          15 files — header, footer, nav chrome
    │   ├── motion/          2 files — framer-motion primitives
    │   ├── portal/          12 files — resource portal UI
    │   └── ui/              4 files — Button, Card, Badge, SearchInput
    │
    ├── hooks/               use-keyboard-shortcut.ts, use-search.ts
    └── lib/
        ├── api-client.ts    the API layer
        ├── auth-context.tsx
        ├── locale-context.tsx
        ├── theme-context.tsx
        ├── i18n.ts          711 lines — EN/UR translation table
        ├── constants.ts     204 lines
        ├── book-covers.ts   224 lines
        ├── offline-chapters.ts
        ├── seo.ts
        ├── shared-types.ts  duplicate of shared/src/index.ts
        ├── youtube.ts
        └── content/types.ts
```

## 2. Next.js 16 specifics

> **Important:** this project is on Next.js **16**, which has substantial
> breaking changes relative to Next 13/14. Version-matched docs are bundled at
> `node_modules/next/dist/docs/` — read them before changing routing, caching,
> or middleware code.

| Item | Value |
|---|---|
| Version | `16.3.1` |
| React | `19.2.8` |
| Router | App Router only (`src/app/`), no `pages/` |
| `src` directory | Yes |
| TypeScript | `.tsx` for all components/pages |
| Route groups | `(public)`, (admin)` |
| Bundler | Turbopack (default in 16 for `dev` **and** `build`) |
| Route handlers (`route.ts`) | **None** |
| Middleware / Proxy | **None** (no `middleware.ts`, no `proxy.ts`) |
| Server Actions | **None** |
| `error.tsx` / `not-found.tsx` / `global-error.tsx` | **None** — framework defaults |
| `template.tsx` / parallel / intercepting routes | None |
| `instrumentation.ts` | None |
| Metadata files | `manifest.ts`, `robots.ts`, `sitemap.ts` |
| Dynamic route params | `[board]`, `[classSlug]`, `[subject]`, `[chapter]`, `[exercise]`, `[questionNum]`, `[slug]` |

### Next 16 conventions this codebase already follows

- **Async Request APIs** — `cookies()`, `headers()`, `params`, `searchParams`
  are Promises only. Compliant: `await cookies()` at
  `src/app/layout.tsx:23`; every dynamic page types
  `params: Promise<…>` / `searchParams: Promise<…>`.
- **`next lint` removed** — replaced with `eslint .` (`package.json:9`) and a
  flat `eslint.config.mjs`. Correct.
- **`middleware` → `proxy`** rename — not applicable, neither file exists.
- **`next dev` config loading** — `next.config.ts:28` correctly uses
  `process.env.NODE_ENV` because `process.argv.includes('dev')` now returns
  `false` inside the config.
- **ESLint flat config** is the default in 16.

### Next 16 deprecations still present

| Issue | Location |
|---|---|
| `<Image priority>` deprecated in favour of `preload` | `src/app/(public)/books/[slug]/page.tsx:94`, `src/app/(public)/[board]/books/[classSlug]/[subject]/page.tsx:127` |
| `scroll-behavior: smooth` in CSS without `data-scroll-behavior="smooth"` on `<html>` — Next 16 no longer injects the override | `src/app/globals.css:68` vs `src/app/layout.tsx:29` |
| `next build` no longer runs lint, so `npm run lint` must be called separately | — |

## 3. Route map — 61 pages

### Public group `(public)` — 38 pages

| Route | File | Type |
|---|---|---|
| `/` | `page.tsx:67` | RSC, `force-dynamic` |
| `/[board]` | `[board]/page.tsx:32` | RSC + `generateMetadata` (`:20`) |
| `/[board]/[classSlug]` | `.../page.tsx:29` | RSC + `generateMetadata` (`:16`), reads `searchParams` |
| `/[board]/[classSlug]/[subject]` | `.../page.tsx:37` | RSC + `generateMetadata` (`:25`) |
| `/[board]/[classSlug]/[subject]/[chapter]` | `.../page.tsx:42` | RSC + `generateMetadata` (`:28`) |
| `/[board]/[classSlug]/[subject]/[chapter]/[exercise]` | `.../page.tsx:77` | RSC + `generateMetadata` (`:63`) |
| `/…/[exercise]/q/[questionNum]` | `.../page.tsx:26` | RSC |
| `/[board]/books/[classSlug]/[subject]` | `.../page.tsx:69` | RSC + `generateMetadata` (`:53`) |
| `/about` | `about/page.tsx:3` | RSC shell → `LegalPageContent` |
| `/account` | `account/page.tsx:35` | **Client** |
| `/a-level` | `a-level/page.tsx:54` | RSC + static `metadata` (`:10`) |
| `/apsacs` | `apsacs/page.tsx:19` | RSC |
| `/apsacs/[classSlug]` | `apsacs/[classSlug]/page.tsx:28` | RSC + `generateMetadata` (`:9`) |
| `/authors` | `authors/page.tsx:13` | RSC |
| `/authors/[authorSlug]` | `authors/[authorSlug]/page.tsx:16` | RSC |
| `/books` | `books/page.tsx:18` | RSC + static `metadata` (`:12`) |
| `/books/[slug]` | `books/[slug]/page.tsx:44` | RSC + `generateMetadata` (`:28`) |
| `/categories` | `categories/page.tsx:10` | RSC |
| `/categories/[slug]` | `categories/[slug]/page.tsx:31` | RSC |
| `/contact` | `contact/page.tsx:3` | RSC shell |
| `/copyright` | `copyright/page.tsx:3` | RSC shell |
| `/formulas` | `formulas/page.tsx:17` | RSC |
| `/guess-papers` | `guess-papers/page.tsx:3` | `redirect("/categories/guess-papers")` |
| `/login` | `login/page.tsx:3` | RSC shell → `AuthForm` |
| `/model-papers` | `model-papers/page.tsx:14` | RSC |
| `/o-level` | `o-level/page.tsx:56` | RSC + static `metadata` (`:10`) |
| `/online-quizzes` | `online-quizzes/page.tsx:88` | RSC + `generateMetadata` from `searchParams` (`:65`) |
| `/past-papers` | `past-papers/page.tsx:15` | RSC, `force-dynamic` |
| `/privacy` | `privacy/page.tsx:3` | RSC shell |
| `/register` | `register/page.tsx:3` | RSC shell |
| `/results-news` | `results-news/page.tsx:3` | `redirect("/categories/results-news")` |
| `/search` | `search/page.tsx:46` | RSC + `searchParams` |
| `/terms` | `terms/page.tsx:3` | RSC shell |
| `/test` | `test/page.tsx:3` | `redirect("/categories/test")` |
| `/test-generator` | `test-generator/page.tsx:44` | **Client** |
| `/tuition` | `tuition/page.tsx:18` | RSC |
| `/upload` | `upload/page.tsx:5` | RSC shell, `force-dynamic` |
| `/whiteboard` | `whiteboard/page.tsx:5` | RSC → `ComingSoonPage` |

### Admin group `(admin)` — 23 pages

All under `/admin`, all **Client Components** (`"use client"` on line 1):

`/admin`, `/admin/audit-log`, `/admin/authors`, `/admin/boards`, `/admin/books`,
`/admin/categories`, `/admin/chapters`, `/admin/classes`, `/admin/classroom`,
`/admin/comments`, `/admin/contact`, `/admin/content-review`, `/admin/exams`,
`/admin/exercises`, `/admin/legal-pages`, `/admin/mcqs`, `/admin/past-papers`,
`/admin/questions`, `/admin/reports`, `/admin/resources`, `/admin/subjects`,
`/admin/uploads`, `/admin/users`

### Layouts

| File | Purpose |
|---|---|
| `src/app/layout.tsx:22` | `RootLayout({children}: LayoutProps<"/">)` — **async**, reads `boardnotes_theme` cookie via `await cookies()` (`:23`), applies `dark` class + `suppressHydrationWarning` on `<html>` and `<body>`, wraps children in `<Providers>` (`:31`) |
| `src/app/(public)/layout.tsx:15` | `PublicLayout` — `ServiceWorkerRegister`, `SearchShortcut`, `<Suspense><Header/></Suspense>` (`:26-28`), `OfflineBanner`, `<main>`, `PlatformIntro`, `ProfessionalContent`, `Footer`, `PwaInstallPrompt`, `WhatsAppButton`, `FloatingActions`, `MobileTabBar` |
| `src/app/(admin)/layout.tsx:3` | `AdminLayout` — thin wrapper → `<AdminShell>` |

### Loading UI

5 `loading.tsx` skeleton files along the hierarchy:
`[board]/`, `[board]/[classSlug]/`, `[board]/[classSlug]/[subject]/`,
`…/[chapter]/`, `…/[chapter]/[exercise]/`.

### Segment config

23 `export const dynamic = "force-dynamic"` exports. No `revalidate`,
`fetchCache`, `dynamicParams`, `runtime`, or `instant` exports anywhere.

## 4. Data fetching

### Architecture

There is no server-side data layer and no route handlers. **All** data comes from
the external Express API at `NEXT_PUBLIC_API_URL` (default
`http://localhost:4000`).

- **RSC pages** fetch during server render via `src/lib/api-client.ts` helpers.
- **Client components** fetch in `useEffect` via the same helpers.
- Three raw network calls bypass the client: two `fetch` and one
  `XMLHttpRequest`.

No react-query, no SWR, no cache layer beyond `fetch`'s `next: { revalidate: 60 }`.

### API client — `src/lib/api-client.ts`

| Line | Export | Behaviour |
|---|---|---|
| `:1` | `BASE` | `process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"` |
| `:3` | `getApiBaseUrl()` | Returns `BASE` |
| `:7-10` | `getToken()` *(private)* | Reads `localStorage.boardnotes_token`; `null` on server |
| `:12` | `setAuthToken(token \| null)` | Writes/removes the key; no-op on server |
| `:18` | `getAuthToken()` | Public token getter |
| `:22-29` | `parseResponse<T>` *(private)* | `res.json().catch(() => ({}))`; throws `Error(data.error)` or `API ${status}: ${path}` |
| `:31` | `apiFetch<T>(path, init?)` | `fetch(BASE+path)`; JSON content-type; `next: { revalidate: 60 }` for GET only (`:38`) |
| `:43` | `apiFetchOrNull<T>(path)` | `apiFetch` in try/catch → `null` |
| `:51` | `apiAuthFetch<T>(path, init?)` | Adds `Authorization: Bearer <token>`; no cache directives |
| `:64` | `apiAuthFetchWithQuery<T>(path, params)` | Builds `?a=b`, delegates |
| `:69` | `apiPost<T>(path, body, auth?)` | |
| `:74` | `apiPatch<T>` | |
| `:81` | `apiPut<T>` | |
| `:85` | `apiDelete<T>` | |
| `:89` | `apiUploadFile<T>(path, file)` | multipart FormData + Bearer, no explicit Content-Type |
| `:101` | `pdfUrl(path)` | Absolute-ises relative asset paths against `BASE` |

### Caching conflict

`apiFetch` sets `next: { revalidate: 60 }` for GETs, but 23 route segments also
declare `dynamic = "force-dynamic"`, which forces request-time rendering and
neutralises `fetch` caching. The two settings are contradictory; in practice
every public page is rendered per-request.

No `cacheTag`, `revalidateTag`, `updateTag`, `"use cache"`, `unstable_cache`, or
`cacheComponents` anywhere.

### Endpoint call sites

**Auth / user**

| File:Line | Call |
|---|---|
| `lib/auth-context.tsx:43` | `GET /api/auth/me` |
| `lib/auth-context.tsx:60` | `POST /api/auth/login` |
| `lib/auth-context.tsx:66` | `POST /api/auth/register` |
| `app/(public)/account/page.tsx:117` | `PATCH /api/auth/preferences` |

**Bookmarks / progress / quiz**

| File:Line | Call |
|---|---|
| `app/(public)/account/page.tsx:74,129` | `GET /api/bookmarks`, `DELETE /api/bookmarks/{id}` |
| `components/content/bookmark-button.tsx:27` | `POST /api/bookmarks` |
| `app/(public)/account/page.tsx:76` | `GET /api/progress` |
| `components/content/progress-tracker.tsx:26` | `POST /api/progress/track` |
| `components/content/chapter-flashcards.tsx:61,78,119` | `GET`/`POST /api/progress/flashcards` |
| `components/content/chapter-quiz.tsx:41,53` | `GET /api/quiz`, `POST /api/quiz/submit` |
| `app/(public)/account/page.tsx:75` | `GET /api/quiz/scores` |
| `app/(public)/test-generator/page.tsx:75,97,153,178` | subjects, chapters, generate, submit |

**Hierarchy**

| File:Line | Call |
|---|---|
| `app/(public)/page.tsx:54,59` | `GET /api/boards`, `GET /api/boards/{slug}` |
| `app/(public)/[board]/page.tsx:22,34` | `GET /api/boards/{board}` |
| `app/(public)/[board]/[classSlug]/page.tsx:18,38` | `…/classes/{classSlug}` |
| `app/(public)/[board]/[classSlug]/[subject]/page.tsx:27,45` | `…/subjects/{subject}` |
| `…/[subject]/[chapter]/page.tsx:31,49` | `…/chapters/{chapter}` |
| `…/[chapter]/[exercise]/page.tsx:66,92` | `…/exercises/{exercise}` |
| `…/[exercise]/page.tsx:49,95` | `…/exercises/{exercise}/q/{num}` |
| `…/q/[questionNum]/page.tsx:40` | `…/exercises/{exercise}/q/{questionNum}` |
| `components/content/chapter-zip-download.tsx:29` | `…/chapters/{chapter}/zip/info` |
| `app/(public)/[board]/[classSlug]/[subject]/page.tsx:46` | `GET /api/authors` |

**Portal / resources / categories**

| File:Line | Call |
|---|---|
| `app/(public)/page.tsx:69,70,71` | categories, resources/latest, resources sorted |
| `app/(public)/categories/page.tsx:11` | `GET /api/categories` |
| `app/(public)/categories/[slug]/page.tsx:33` | `GET /api/categories/{slug}` |
| `app/(public)/tuition/page.tsx:19` | `GET /api/categories/tuition` |
| `app/(public)/books/page.tsx:20-21` | categories + resources |
| `app/(public)/books/[slug]/page.tsx:30,46` | `GET /api/resources/{slug}` |
| `components/portal/books-listing.tsx:42` | `GET /api/resources?…` |
| `components/portal/resource-actions.tsx:29` | `POST /api/resources/{slug}/download` |
| `components/portal/upload-form.tsx:18,157` | categories; XHR multipart POST `/api/resources` |

**Search**

| File:Line | Call |
|---|---|
| `app/(public)/search/page.tsx:39` | `GET /api/search?q=` (RSC) |
| `components/portal/hero-search.tsx:133` | **raw `fetch("/api/search?q=")` — relative** |
| `hooks/use-search.ts:17` | `GET /api/search?q=` (hook unused) |

**Past papers / exams / books / PDFs**

| File:Line | Call |
|---|---|
| `app/(public)/[board]/page.tsx:43` | `GET /api/past-papers?board=` |
| `app/(public)/[board]/[classSlug]/page.tsx:43` | `GET /api/past-papers?board=&class=` |
| `app/(public)/past-papers/page.tsx:9` | `GET /api/past-papers` |
| `app/(public)/model-papers/page.tsx:8` | `GET /api/past-papers?type=model` |
| `app/(admin)/admin/exams/page.tsx:50,56` | `GET /api/exams/all` |
| `…/[exercise]/page.tsx:56`, `…/q/[questionNum]/page.tsx:46` | `GET /api/pdfs/{pdfName}` |
| `app/(public)/[board]/books/[classSlug]/[subject]/page.tsx:55,73` | `GET /api/books?board=&class=&subject=` |

**Content / feedback**

| File:Line | Call |
|---|---|
| `app/(public)/formulas/page.tsx:18` | `GET /api/formulas` |
| `components/content/legal-page-content.tsx:32,69` | `GET /api/legal/{slug}`, `/educational-notice` |
| `components/content/contact-form.tsx:21` | `POST /api/contact` |
| `components/content/report-mistake-form.tsx:26` | `POST /api/reports` |
| `components/content/question-comments.tsx:31,42` | `GET`/`POST /api/comments` |

**Classrooms**

| File:Line | Call |
|---|---|
| `app/(public)/account/page.tsx:61,77,64,84,103` | `/api/classrooms/mine`, `/api/classrooms/{id}`, join |
| `app/(admin)/admin/classroom/page.tsx:122-198` | full CRUD + scores + assignments |

**Admin-only surfaces** — `/api/audit`, `/api/audit/stats`, boards/classes/
subjects/chapters/exercises/questions/mcqs/books/pdfs CRUD,
`/api/portal/categories`, `/api/portal/stats`, `/api/portal/nav`,
resources CRUD, past-papers CRUD, exams CRUD, comments moderation,
reports resolve, contact inbox, legal PUT, users + role + delete, authors CRUD.
Also `/api/boards` + `/api/chapters` from
`components/admin/board-coverage-panel.tsx:42,43` and `/api/boards`,
`/api/classes`, `/api/subjects` from `components/admin/hierarchy-picker.tsx:46-48,186`.

### Known defect — hero search hits the wrong origin

`components/portal/hero-search.tsx:133`

```ts
const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
```

This is a **relative** URL, so it resolves against the Next.js origin
(`localhost:3000`), which has **no `/api/search` route handler**. The request
404s and the `catch` at `:156` silently falls back to local suggestions. Live
autocomplete on the home hero is therefore never actually querying the backend.
Fix: use `apiFetch` or prefix `getApiBaseUrl()`.

## 5. Component inventory

### `components/providers.tsx:7` — `Providers`

Client boundary nesting `LocaleProvider → ThemeProvider → AuthProvider`
(`:9-13`). Mounted once in the root layout.

### `components/auth/` (3 files)

| File:Line | Export | Purpose |
|---|---|---|
| `account-guard.tsx:9` | `AccountGuard` | Blocks `/account` for anonymous users; `router.replace("/login?next=/account")` (`:14`) |
| `admin-guard.tsx:13` | `AdminGuard` | Requires `isStaff`; redirects to `/login?next=/admin` (`:19`) |
| `auth-form.tsx:18` | `AuthForm` | Login/register form, `mode: "login" \| "register"`; hardcoded demo credentials listed at `:123-126` |

### `components/admin/` (6 files)

| File:Line | Export | Purpose |
|---|---|---|
| `admin-shell.tsx:8` | `AdminShell` | Responsive chrome; mobile overlay, collapsible sidebar, `AdminGuard` |
| `admin-sidebar.tsx:80` | `AdminSidebar` | Role-filtered 5-section nav (Content / Portal / Users / Reports / System) defined `:24-78`; collapsible sections; `usePathname()` active state; `LocaleToggle` + `ThemeToggle` + sign-out |
| `admin-ui.ts:2-25` | 22 consts | Shared Tailwind class tokens (`adminPageTitle`, `adminInput`, `adminPrimaryBtn`, …) |
| `board-coverage-panel.tsx:37` | `BoardCoveragePanel` | Per-board coverage matrix (classes / chapters / published / inReview / drafts / exercises) |
| `hierarchy-picker.tsx:33` | `HierarchyPicker` | Cascading Board → Class → Subject selects |
| `hierarchy-picker.tsx:174` | `BoardSelect` | Standalone board select |

### `components/layout/` (15 files)

| File:Line | Export | Purpose |
|---|---|---|
| `header.tsx:381` | `Header` | **719 lines** — largest component. `usePathname` + `useSearchParams` (`:6`), `createPortal` dropdowns, `AnimatePresence`, lucide icons, auth-aware user menu. `BOARDS_ITEM` (`:44-65`), `OTHER_NAV_ITEMS` (`:72-120+`) |
| `footer.tsx:17` | `Footer` | 5-column; fetches `/api/portal/nav` + `/api/portal/stats` in `useEffect` (`:22-29`) |
| `platform-intro.tsx:43` | `PlatformIntro` | Marketing strip, 4 feature cards + stats |
| `professional-content.tsx:3` | `ProfessionalContent` | Long SEO paragraph block |
| `breadcrumbs.tsx:7` | `Breadcrumbs`, `Crumb` | Presentational breadcrumb nav |
| `localized-breadcrumbs.tsx:6` | `LocalizedBreadcrumbs` | Wraps `Breadcrumbs`, localises first "Home" crumb |
| `page-heading.tsx:12` | `PageHeading` | Localised `<h1>`/subtitle from `TranslationKey`s |
| `mobile-tab-bar.tsx:20` | `MobileTabBar` | Fixed 5-tab bottom bar (`/`, `/fbise`, `/past-papers`, `/search`, `/upload`), `layoutId` pill, `lg:hidden` |
| `search-shortcut.tsx:8` | `SearchShortcut` | `/` key → `/search`; renders `null` |
| `offline-banner.tsx:7` | `OfflineBanner` | `online`/`offline` listeners, amber banner |
| `pwa-install-prompt.tsx:14` | `PwaInstallPrompt` | `beforeinstallprompt` capture, `boardnotes_pwa_dismissed` key |
| `service-worker-register.tsx:5` | `ServiceWorkerRegister` | Registers `/sw.js` |
| `whatsapp-button.tsx:10` | `WhatsAppButton` | `useSyncExternalStore` mount gate + `createPortal` FAB |
| `floating-actions.tsx:9` | `FloatingActions` | Left-edge floating `ThemeToggle` |

### `components/motion/` (2 files)

| File:Line | Export | Purpose |
|---|---|---|
| `hover-card.tsx:12` | `HoverCard` | `whileHover` lift/scale + reduced-motion fallback |
| `hover-card.tsx:40` | `Pressable` | `whileTap` scale 0.96 |
| `hover-card.tsx:66` | `IconBounce` | Spring hover scale |
| `hover-card.tsx:90` | `POPOVER_SPRING` | Shared spring config (also imported by `header.tsx:27`) |
| `hover-card.tsx:98` | `EASE_OUT` | Shared easing |
| `reveal.tsx:22` | `Reveal` | `whileInView` fade + slide |
| `reveal.tsx:61` | `Stagger` | Container with `staggerChildren` |
| `reveal.tsx:85` | `StaggerItem` | Variant child |
| `reveal.tsx:112` | `FadeIn` | Mount fade + slide |

### `components/portal/` (12 files)

| File:Line | Export | Purpose |
|---|---|---|
| `portal-home.tsx:26` | `PortalHome` | Home composition — `HeroSlider`, `BoardCoverSections`, category grid, latest/trending rails, `AdBanner`; resolves relative cover URLs via `getApiBaseUrl()` (`:33-37`) |
| `hero-slider.tsx:25` / `:10` | `HeroSlider`, `HeroSlide` | 6 s autoplay crossfade; pauses on hover / reduced motion; overlays `HeroSearch` |
| `hero-search.tsx:101` | `HeroSearch` | 355 lines — 220 ms debounce, `AbortController`, keyboard nav, `/` hotkey. **Contains the relative-fetch defect** |
| `board-cover-sections.tsx:27` / `:12` | `BoardCoverSections`, `HomeBoardSection` | Per-board textbook cover carousels |
| `books-listing.tsx:19` | `BooksListing` | Filter/sort/paginate browser (`PAGE_SIZE 24`) |
| `category-card.tsx:11` | `CategoryCard` | Animated category tile |
| `resource-card.tsx:17` | `ResourceCard` | Glass cover card → `/books/[slug]` |
| `resource-actions.tsx:21` | `ResourceActions` | Download gate + read-online + copy link + WhatsApp; `POST /api/resources/{slug}/download` (`:29`) |
| `cover-art.tsx:44` | `CoverArt` | Gradient/initial/label placeholder cover (hash-based gradient `:20`) |
| `ad-banner.tsx:11` / `:32` | `AdBanner`, `AdSenseBanner` | Placeholder ad slots; AdSense scaffold commented out |
| `coming-soon-page.tsx:20` | `ComingSoonPage` | Generic coming-soon page with waitlist form |
| `upload-form.tsx:61` | `UploadForm` | 387 lines — drag-drop uploader with progress, `CATEGORY_KEYWORDS` auto-suggest (`:36`), XHR POST `${getApiBaseUrl()}/api/resources` (`:157`) |
| `portal-types.ts:1,13,32,38,44` | types | `PortalCategory`, `PortalResource`, `PortalTrailNode`, `PortalStats`, `NavCategory` |

### `components/ui/` (4 files)

| File:Line | Export | Purpose |
|---|---|---|
| `button.tsx:13` | `Button` | `variant: primary \| secondary \| ghost` |
| `card.tsx:1` | `Card` | Bordered surface |
| `badge.tsx:1` | `Badge` | Accent pill |
| `search-input.tsx:3` | `SearchInput` | **Unused** |

### `components/content/` (43 files)

| File:Line | Export | Purpose |
|---|---|---|
| `hierarchy-pages.tsx:51` | `BoardPageContent` | Board hub: class cards, notes/books toggle, past papers |
| `hierarchy-pages.tsx:266` | `ClassPageContent` | Class page with `notes`/`books`/`past-papers` views (`:53` sets `initialView`) |
| `hierarchy-pages.tsx:565` | `SubjectPageContent` | Subject page: chapter list, authors, quiz CTA |
| `hierarchy-pages.tsx:871` | `ChapterPageContent` | Chapter: summary, video, formulas, exercises, flashcards, quiz, ZIP, offline save, FAQ |
| `hierarchy-pages.tsx:1027` | `ExercisePageContent` | Exercise page + prev/next nav + question list |
| `apsacs-pages.tsx:17` | `APSACSClassPageContent` | APSACS class page |
| `question-page-view.tsx:46` | `QuestionPageView` | Single question: breadcrumbs, KaTeX, solution steps, PDF, comments, report mistake, share, bookmark, progress, text-size |
| `past-papers-list.tsx:89` | `PastPapersList` (+ `:22`, `:13`, `:15`) | 435-line faceted browser (board/year/subject/type), PBA bucketing (`:63`), FBISE/NBF label normalisation (`:80`) |
| `search-page-content.tsx:44` | `SearchPageContent` | Filter chips, `<mark>` highlighting (`:22`), results + resource rails |
| `formulas-hub-content.tsx:22` | `FormulasHubContent` | Localised formula sheets |
| `chapter-flashcards.tsx:44` / `:11` | `ChapterFlashcards`, `Flashcard` | Flip cards, server + localStorage progress |
| `chapter-quiz.tsx:31` | `ChapterQuiz` | MCQ practice quiz; auth required to submit |
| `chapter-video.tsx:11` | `ChapterVideo` | Lazy YouTube embed |
| `chapter-zip-download.tsx:23` | `ChapterZipDownload` | Fetches ZIP manifest, gated download |
| `bookmark-button.tsx:15` | `BookmarkButton` | Save page to account |
| `download-gate.tsx:33` | `DownloadGate` | 12 s unlock timer, ad-blocker detection (`:10`), Drive bypass, animated states |
| `drive-link-button.tsx:12` | `DriveLinkButton` | Google Drive open button with invalid-link fallback |
| `pdf-viewer.tsx:11` | `PdfViewer` | Iframe PDF + download gate |
| `pdf-section.tsx:13` | `PdfSection` | Viewer + educational-notice caption |
| `legal-page-content.tsx:27` / `:10` / `:64` | `LegalPageContent`, `LegalPageData`, `useEducationalNotice` | CMS-driven legal/about/copyright pages, EN/UR |
| `question-comments.tsx:22` | `QuestionComments` | Per-question comments |
| `report-mistake-form.tsx:14` | `ReportMistakeForm` | Mistake ticket form |
| `progress-tracker.tsx:17` | `ProgressTracker` | Fire-and-forget `POST /api/progress/track` |
| `save-offline-button.tsx:24` | `SaveOfflineButton` | Persists chapter payload + asks SW to cache |
| `contact-form.tsx:8` | `ContactForm` | Contact form |
| `subject-faq.tsx:19` | `SubjectFaq` | Localised FAQ with board/year token substitution (`:29-32`) |
| `text-size-control.tsx:10` | `TextSizeControl` | A−/A+ scaling via `--text-scale` |
| `math-text.tsx:6` | `MathText` | Splits on `$…$` → `InlineMath` |
| `math-block.tsx:11` | `MathBlock` | `BlockMath`/`InlineMath` toggle |
| `share-buttons.tsx:7` | `ShareButtons` | Copy link + WhatsApp + native share |
| `static-pages.tsx:6` | `ContactPageContent` | Contact page shell |
| `authors-list-content.tsx:16` | `AuthorsListContent` | Author index grid |
| `author-page-content.tsx:17` | `AuthorPageContent` | Author detail + notes list |

**Dead components (declared, never rendered):**

| File | Export |
|---|---|
| `content/chapter-card.tsx:10` | `ChapterCard` |
| `content/exercise-card.tsx:10` | `ExerciseCard` |
| `content/books-list.tsx:23` | `BooksList`, `BookItem` (`:11`) |
| `content/continue-reading-tracker.tsx:7` | `ContinueReadingTracker` |
| `content/home-resume-card.tsx:20` | `HomeResumeCard` |
| `content/saved-offline-card.tsx:9` | `SavedOfflineCard` |
| `content/solution-steps.tsx:7` | `SolutionSteps` |
| `content/question-nav.tsx:8` | `QuestionNav` |
| `content/share-button.tsx:3` | `ShareButton` |
| `content/exam-countdown.tsx:29` | `ExamCountdown` |
| `ui/search-input.tsx:3` | `SearchInput` |
| `hooks/use-search.ts:7` | `useSearch` |

## 6. State management

No external store library. Three hand-rolled React Contexts, composed in
`components/providers.tsx`:

| Context | File | Provides | Persistence |
|---|---|---|---|
| `LocaleProvider` | `lib/locale-context.tsx:23` | `{locale, toggleLocale, tr, isRtl}` | `localStorage.boardnotes_locale` (`:27,:35`); sets `document.documentElement.lang`/`dir` (`:36-37`) |
| `ThemeProvider` | `lib/theme-context.tsx:18` | `{theme, toggleTheme}` | `localStorage.boardnotes_theme` **and** cookie `boardnotes_theme` (`:22,:31,:32`); toggles `html.dark`; adds `html.theme-ready` after 120 ms (`:38-40`) |
| `AuthProvider` | `lib/auth-context.tsx:31` | `{user, loading, signIn, signUp, signOut, refreshUser, isAdmin, isEditor, isStaff, isTeacher}` | `localStorage.boardnotes_token` via `setAuthToken` |

Hooks: `useLocale()` (`:53`), `useTheme()` (`:55`), `useAuth()` (`:95`).
UI: `LocaleToggle` (`:59`), `ThemeToggle` (`:61`).

Custom hooks:

- `useKeyboardShortcut(key, cb)` — `hooks/use-keyboard-shortcut.ts:5`; ignores
  ctrl/meta and `INPUT`/`TEXTAREA`
- `useSearch()` — `hooks/use-search.ts:7`; **unused**
- `useEducationalNotice()` — `components/content/legal-page-content.tsx:64`

### localStorage keys

| Key | Purpose |
|---|---|
| `boardnotes_token` | JWT |
| `boardnotes_locale` | `en` \| `ur` |
| `boardnotes_theme` | `light` \| `dark` |
| `boardnotes_last_path` | Continue-reading path |
| `boardnotes_text_scale` | A−/A+ text size |
| `boardnotes_flashcards:<chapterKey>` | Local flashcard progress |
| `boardnotes_offline_index` | Saved-offline index |
| `boardnotes_offline_<path>` | Saved chapter payload |
| `boardnotes_pwa_dismissed` | Install-prompt dismissal |
| Cookie `boardnotes_theme` | SSR-safe theme bootstrap |

### Deliberate eslint suppressions

`react-hooks/set-state-in-effect` is suppressed at `theme-context.tsx:25` and
`locale-context.tsx:30` — intentional, to apply theme/locale synchronously
pre-paint and avoid FOUC/hydration mismatch.

## 7. Styling

Tailwind CSS **v4**, CSS-first configuration (no `tailwind.config.js`).

| File:Line | Contents |
|---|---|
| `postcss.config.mjs:1-7` | Single plugin `@tailwindcss/postcss` |
| `src/app/globals.css:1` | `@import "tailwindcss";` |
| `:3-19` | `:root` design tokens — slate canvas, indigo→violet brand (`--accent: #4F46E5`, `--accent-2: #7C3AED`) |
| `:21-35` | `html.dark` overrides |
| `:41-53` | `@theme inline` maps tokens → Tailwind colour/font utilities |
| `:61-97` | `@layer base` (critical unlayered-CSS comment at `:55-60`) |
| `:99-247` | 17 `@keyframes` + `.animate-*` |
| `:249-258` | `.stagger-1` … `.stagger-8` |
| `:260-582` | Component classes: `.scrollbar-*`, `.snap-x-mandatory`, `.card-hover`, `.glow-border`, `.ripple`, `.hero-pattern`, `.hero-band`, `.gradient-border`, `.floating-shape`, `.reveal-section`, `.badge-pulse`, `.img-zoom`, `.glass`, `.glass-bar`, `.glass-bar-solid`, `.glass-card`, `.glass-field`, `.shadow-soft/-lift`, `.text-gradient`, `.focus-ring`, `.pressable`, `.border-gradient`, `.hero-gradient`, `.cta-gradient`, `.shine-on-hover` |
| `:587-592` | Theme colour transitions gated on `html.theme-ready` |
| `:596-605` | Global `prefers-reduced-motion` kill switch |
| `:607-622` | Print styles |

No CSS Modules, no styled-components, no Sass, no `clsx`/`tailwind-merge`.
Styling is long inline utility-class `className` strings plus shared token
strings in `components/admin/admin-ui.ts` and
`components/content/past-papers-list.tsx`.

### Broken font tokens

`globals.css:38,:51,:52,:81` reference `var(--font-geist-sans)` and
`var(--font-geist-mono)`, but there is **no `next/font` import anywhere in
`src/`**. Those custom properties are never defined, so `font-sans`/`font-mono`
resolve to nothing and fall back to `Arial, Helvetica, sans-serif`. The stock
`frontend/README.md:21` still claims Geist is used.

### Motion & icons

- `framer-motion` ^14 across ~30 client components; every motion wrapper falls
  back to a plain element when `useReducedMotion()` is true.
- `lucide-react` ^1.51 plus emoji and hand-rolled inline SVGs.

## 8. PWA

| File | Purpose |
|---|---|
| `public/sw.js` | Hand-written service worker (89 lines); versioned caches, purges stale entries on `activate` |
| `app/manifest.ts` | Web app manifest |
| `components/layout/service-worker-register.tsx:5` | Registration |
| `components/layout/pwa-install-prompt.tsx:14` | `beforeinstallprompt` capture |
| `components/layout/offline-banner.tsx:7` | Online/offline banner |
| `lib/offline-chapters.ts` | Offline chapter payload persistence |
| `components/content/save-offline-button.tsx:24` | Save a chapter offline |

## 9. SEO

| File | Purpose |
|---|---|
| `src/app/sitemap.ts` | 100+ absolute URLs, built from `NEXT_PUBLIC_SITE_URL` |
| `src/app/robots.ts` | `Sitemap:` directive |
| `src/app/manifest.ts` | PWA manifest |
| `src/app/layout.tsx` | Global metadata, icons point at `/icon.svg` |
| `lib/seo.ts` | Metadata helpers |
| Per-page `generateMetadata` | `[board]`, `[classSlug]`, `[subject]`, `[chapter]`, `[exercise]`, `books/[slug]`, `authors/[authorSlug]`, `categories/[slug]`, `apsacs`, `apsacs/[classSlug]`, `online-quizzes` |

No `opengraph-image.tsx`, `twitter-image.tsx`, `icon.tsx`, or `apple-icon.tsx`.

## 10. Build configuration

### `next.config.ts` (52 lines)

```ts
import type { NextConfig } from "next";

// Must match lib/api-client.ts so relative asset paths (book covers, uploads,
// demo PDFs) resolve against the API instead of 404ing on the Next origin.
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  async rewrites() {
    return [
      { source: "/book-covers/:path*", destination: `${API}/book-covers/:path*` },
      { source: "/uploads/:path*",      destination: `${API}/uploads/:path*` },
      { source: "/demo-pdfs/:path*",    destination: `${API}/demo-pdfs/:path*` },
    ];
  },
  async redirects() {
    return [
      { source: "/:board/books", destination: "/:board?view=books", permanent: false },
    ];
  },
  images: {
    // The optimizer refuses upstreams that resolve to private IPs. Locally the
    // API is on http://localhost:4000, so dev needs this; production stays strict.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      { protocol: "https", hostname: "board-production-6505.up.railway.app", port: "", pathname: "/**" },
      // No `port` key: Next normalises numeric-looking port values, which then
      // fail the strict string comparison in the remote-pattern matcher.
      { protocol: "http",  hostname: "localhost",   pathname: "/**" },
      { protocol: "http",  hostname: "127.0.0.1",   pathname: "/**" },
    ],
  },
};

export default nextConfig;
```

Not configured: `turbopack`, `reactCompiler`, `cacheComponents`, `typedRoutes`,
`experimental.*`, `eslint`, `output`, `basePath`, `trailingSlash`, `logging`,
`devIndicators`, `serverExternalPackages`, `agentRules`, `headers`.

⚠️ A production Railway hostname is hard-coded at `next.config.ts:32`.

### `eslint.config.mjs` (18 lines)

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

Flat config — mandatory in Next 16 because `next lint` was removed.

### `postcss.config.mjs` (7 lines)

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### `tsconfig.json` (34 lines)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

One path alias: `@/*` → `./src/*`. Used essentially everywhere — there are no
relative `../../` imports across `src/`. `target: "ES2017"` is low for Next 16.
No `paths` entry for `@boardnotes/shared`.

### Scripts

| Script | Command | Notes |
|---|---|---|
| `dev` | `next dev` | Turbopack; outputs to `.next/dev`; regenerates `AGENTS.md`/`CLAUDE.md` |
| `build` | `next build` | Turbopack; **no lint step** (removed in v16) |
| `start` | `next start` | |
| `lint` | `eslint .` | Reachable via root `npm run lint` |

No test script. No frontend `Dockerfile` — the monorepo root `Dockerfile` builds
the backend only.

## 11. Notable frontend findings

1. **Hero search is broken** — `components/portal/hero-search.tsx:133` fetches a
   relative `/api/search`, which hits the Next origin where no route handler
   exists. Autocomplete silently degrades.
2. **Caching is self-defeating** — `revalidate: 60` (`api-client.ts:38`) is
   neutralised by 23 `dynamic = "force-dynamic"` segments.
3. **No server-side auth boundary** — no `middleware.ts` / `proxy.ts`; guards are
   client-side only.
4. **Dead font tokens** — `--font-geist-*` are referenced but never defined.
5. **12 unused components/hooks** listed in §5.
6. **Next 16 deprecation drift** — `Image priority` at two sites; smooth-scroll
   attribute missing.
7. **`PageProps` shadowing** — `app/(public)/[board]/books/[classSlug]/[subject]/page.tsx:49`
   declares a local `PageProps` that shadows Next 16's generated global
   `PageProps<'/route'>` helper.
8. **Hard-coded production hostname** in `next.config.ts:32`.
9. **`shared/` not consumed** — the frontend uses a hand-copied duplicate at
   `src/lib/shared-types.ts` instead of `@boardnotes/shared`.
10. **`.env.local` exists on disk** — confirmed gitignored by `.gitignore:39`
    (`.env*`), so it will not be committed. It still contains local defaults
    (`NEXT_PUBLIC_API_URL=http://localhost:4000`, `NEXT_PUBLIC_SITE_URL=http://localhost:3000`).

Full detail and remediation: [`ISSUES-AND-RISKS.md`](./ISSUES-AND-RISKS.md).
