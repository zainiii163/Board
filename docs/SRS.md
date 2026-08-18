# BoardNotes  
## Software Requirements Specification  
### Client document — features, functionality, and quality of the system

| | |
|---|---|
| **Product** | BoardNotes (name can be changed to your brand) |
| **Document type** | Software Requirements Specification (SRS) |
| **Version** | 3.1 — Client edition |
| **Date** | 17 August 2026 |
| **Purpose** | Describe what the system will include so you can review and approve scope |

This document is written for **business and academic stakeholders**, not only developers.  
It answers: *What will students, teachers, and admins be able to do? What quality, security, and performance is included? What comes later?*

---

## 1. What this system is

BoardNotes is an **online board-study website** for notes, solved exercises, MCQs, and PDFs — the same *type of system* as well-known education sites such as MathCity and Study++, but with:

- **your own brand and design**
- **your own original / licensed notes** (we do not copy other websites’ content)
- **the same student journey**: Board → Class → Subject → Chapter → Exercise → Question

A student can open the site, choose **Federal Board → Class 9 → Mathematics → Real Numbers → Exercise 1.1**, read the solution **on screen**, and **view or download the PDF** — without creating an account.

---

## 2. Who the system is for

| User | What they get |
|---|---|
| **Student (guest)** | Browse, read, search, print, share, and download. No login required. |
| **Student (optional account)** | Bookmarks, resume last chapter, saved quiz scores. |
| **Teacher / contributor** | Upload notes and PDFs, write step-by-step solutions, get their name on the page. |
| **Editor** | Check quality, approve, publish, or unpublish. |
| **Admin** | Boards, classes, subjects, users, legal pages, reports. |

---

## 3. Functional features (what the system does)

These are the **capabilities included in the product**. They are grouped the way a student actually uses the site.

### 3.1 Browse by board, class, and subject

The whole website is built as a textbook tree. This is the core of the system.

| Feature | What it does |
|---|---|
| Board hubs | FBISE, Punjab, KPK, Sindh, and later Cambridge / Oxford — each on its own page |
| Class hubs | Class 5–12 (and later college), with Notes, Books, and Past papers as separate sections |
| Subject hubs | e.g. Class 9 Mathematics — chapter list, year badge (2026–2027), SLO / curriculum tags |
| Chapter pages | Summary, important terms, formulas, list of exercises |
| Exercise pages | Exercise 1.1, 1.2, Miscellaneous, etc. |
| Question pages | One question with full working; previous / next question |
| Breadcrumbs | Home / FBISE / 9 / Mathematics / Real Numbers / Exercise 1.1 |
| Session year | Content tagged for the academic session (e.g. 2026–2027) |
| English / Urdu | Language stored per subject; Urdu pages can display right-to-left |
| Latest notes | Home page and a “Newly added” page when new material is published |
| Coming soon | Chapters that are not published yet do not appear as broken links to the public |

**Example public links**

- `/fbise/9/mathematics`
- `/fbise/9/mathematics/real-numbers`
- `/fbise/9/mathematics/real-numbers/exercise-1-1`
- `/fbise/9/mathematics/real-numbers/exercise-1-1/q/3`

---

### 3.2 Solved notes, MCQs, and math on screen

| Feature | What it does |
|---|---|
| Chapter overview | Short summary, SLO list, definitions, formula strip |
| Numbered questions | Questions shown in textbook order |
| Question types | MCQ, short, long, proof, numerical, geometric construction |
| Step-by-step solutions | Clear working (given / since / therefore style) for board marking |
| Proper math display | Fractions, roots, trigonometry, matrices, sets — displayed as real math, not plain text |
| Diagrams | Figures attached to a question, with descriptions for accessibility |
| MCQs | Options A–E, correct answer, and short reason |
| Multiple teachers on one exercise | Same exercise can have more than one notes PDF / solution set (Author A and Author B) |
| Marks and difficulty | Optional marks (2, 5, 8) and difficulty level |
| Construction steps | Compass and ruler steps in order (Practical Geometry) |
| Glossary | Chapter-wise important terms and definitions |

---

### 3.3 PDF view and download

| Feature | What it does |
|---|---|
| View online | Open the PDF in the browser (no forced download) |
| Download | Save a clearly named file, e.g. `fbise-9-math-ch1-ex1-1.pdf` |
| File info | Size and author shown before download |
| Levels of PDF | One PDF per exercise, per chapter (full unit), or full book |
| Safe uploads | Only PDF and images; size limit; no executable files |
| Fast delivery | Files served from a content network so the site does not freeze in exam season |
| Optional page map | “Question 3 is on PDF pages 4–5” (later phase) |
| Chapter ZIP | Download all PDFs of a chapter in one pack (later phase) |

An **educational notice** is shown next to every download: material is for study support, not for sale of official textbooks.

---

### 3.4 Search, sharing, and finding content

| Feature | What it does |
|---|---|
| Site search | Search by chapter name, exercise number, topic (e.g. “logarithms 2.1 fbise”) |
| Filters | Board, class, subject, type (chapter / exercise / PDF) |
| Share | Copy link, WhatsApp, Facebook, Telegram — always the exact page |
| Print | Clean print layout (hides menus; keeps solutions and diagrams) |
| Related items | Other subjects, book PDF, matching past paper |
| Author page | All published notes by that teacher |
| FAQ on subject pages | Common questions (syllabus year, how to download, SLO, etc.) |
| Keyboard search | Press `/` to jump to search |

Pages are built so **Google can index every chapter and exercise** (this is how students actually find the site).

---

### 3.5 Books, past papers, and formula sheets

| Feature | What it does |
|---|---|
| Books section | Textbook / book PDFs or official publisher links, per class and subject |
| Past papers | Board, class, year, subject, annual / supply |
| Model papers | Practice papers in the same structure |
| Formula sheets | Quick formulas on the chapter page; later a full formulas section |

---

### 3.6 Teacher and admin system (CMS)

| Feature | What it does |
|---|---|
| Roles | Admin, Editor, Contributor (teacher) |
| Create structure | Add boards, classes, subjects, chapters, exercises |
| Write notes | Math editor with live preview |
| Upload PDFs and images | Attach files to an exercise or chapter |
| Workflow | Draft → Send for review → Published → Archived |
| Preview | Editor can preview before the public sees it |
| Publish / unpublish | Hide a chapter without deleting it |
| Audit log | Who published or changed what, and when |
| Reorder | Drag/set chapter and exercise order |
| Report a mistake | Student form: “this question is wrong” → ticket for editors |
| Copyright takedown | Form and process to unpublish if a rights complaint is valid |

Teachers **cannot** publish directly. An editor approves first.

---

### 3.7 Extra student features (included in the plan)

These do **not** change the board → exercise structure. They sit on top of it.

| Feature | What it does | When |
|---|---|---|
| Bookmarks | Save a chapter, exercise, or question | Phase 2 |
| Continue reading | Home page shows “Resume where you left” | Phase 2 |
| Practice quiz | Timed MCQs from a chapter; score and explanations | Phase 2 |
| Progress | How much of a subject is done | Phase 2 |
| Install on phone (PWA) | Add to home screen; limited offline reading | Phase 2 |
| Dark mode | Light / dark; does not change content | Phase 2 |
| Urdu interface | Menu language English / Urdu | Phase 2 |
| Larger text | A− / A+ on solution pages | Phase 2 |
| Ask a doubt / comments | On a question, with moderation | Phase 3 |
| Video lesson | Optional YouTube on a chapter | Phase 3 |
| Flashcards | From chapter definitions | Phase 3 |
| Exam countdown | Next board exam date | Phase 3 |
| Teacher classroom | Class code, assign exercise, see scores | Phase 3 |
| Email updates | “New notes in my class” | Phase 3 |
| Mobile apps | iOS / Android after the website is proven | Phase 4 |

Public notes stay **free**. Ads, if ever used, will not sit inside the solution steps.

---

### 3.8 Legal and trust pages

Included in the first public version:

- About  
- Contact  
- Privacy policy  
- Terms of use  
- Educational notice  
- Copyright / takedown  

Reading notes does **not** require personal data. Accounts (optional) store only what is needed (e.g. email).

---

## 4. Non-functional requirements (quality of the system)

These are **not extra buttons**. They are how well the system must work.

### 4.1 Speed and exam-season load

| Item | Target |
|---|---|
| Chapter page load | Under 2.5 seconds on a normal 4G phone |
| Search | Results in under 0.4 seconds |
| PDF start | File begins loading quickly from a CDN (not from a slow app server) |
| Peak usage | Designed for exam months: tens of thousands of readers at once |
| Catalog size | Can grow to hundreds of chapters and thousands of PDFs |

When many students open the same chapter, they should get a **cached page**, not a crashed server.

### 4.2 Availability and backup

| Item | Target |
|---|---|
| Uptime | 99.5% of the month for public reading |
| If admin tools fail | Students can still **read** already published pages |
| Database backup | Daily; restore within one business day |
| Replaced PDFs | Previous file kept for 30 days |

### 4.3 Security

| Item | What is included |
|---|---|
| Public site | Read-only; no one can change notes without login |
| Admin area | Password protected; roles (teacher vs editor vs admin) |
| Drafts | Hidden from Google and from guests |
| Uploads | Only allowed file types; size cap |
| Login protection | Limit on failed attempts |
| Data | Passwords stored hashed; secrets not in the public site |
| Reports / login | Rate-limited to reduce abuse |

### 4.4 Mobile, accessibility, and language

| Item | What is included |
|---|---|
| Devices | Works on Chrome, Edge, Firefox, Safari, Android, iPhone |
| Screens | From a 360px phone to desktop |
| Accessibility | Keyboard use, image descriptions, readable contrast (WCAG 2.2 AA target) |
| Zoom | Math remains readable at 200% zoom |
| Urdu | Layout ready for right-to-left even if English ships first |

### 4.5 Search engines (how students find you)

| Item | What is included |
|---|---|
| Every chapter and exercise | Its own Google-friendly page |
| Sitemap | Auto-updated when you publish |
| Sharing preview | Title and description show correctly on WhatsApp |
| Unpublished work | Not listed on Google |

Without this, the site would exist but **students would not find it**.

### 4.6 Privacy

- Guest reading: no account required  
- Optional account: email and learning progress only  
- Student data is not sold  
- Cookie notice only if extra analytics cookies are used  

---

## 5. What is not included

To keep cost and time clear, the following are **out of this system** (unless you later sign them as a new project):

| Not included | Why |
|---|---|
| Copying notes from other websites | Copyright; we publish original or licensed material only |
| Selling official government textbooks | Not allowed; we may **link** to official sources |
| Live video classes / Zoom teaching | Different product |
| Paid homework or tutoring marketplace | Different product |
| Payment wall on public notes | Public notes stay free in this project |
| Native iPhone/Android apps | Phase 4, after the website is live |

---

## 6. Delivery — what you get in each phase

You can approve the full vision and still launch in steps.

| Phase | You receive | Typical meaning |
|---|---|---|
| **Phase 1 — Public website (MVP)** | Full browse tree, solved notes on screen, PDFs view/download, search, share, print, teacher upload + editor approve, Google pages, legal pages, “report a mistake” | Students can use it like a notes site |
| **Phase 2 — Learning extras** | Accounts, bookmarks, quizzes, progress, dark mode, phone install, Urdu menus | Students return and practise |
| **Phase 3 — More resources** | Past papers, formula hub, comments, ZIP packs, classroom for teachers | Deeper exam prep |
| **Phase 4 — Grow** | More boards, optional apps, optional teacher tools | Scale the same logic, not a new kind of site |

**First launch goal:** a guest goes from the home page to **Exercise 1.1, Question 3**, reads the steps, and downloads the PDF in **under 15 seconds**, with **no login**.

---

## 7. Language and technology stack

This is the stack we will use. One language on the whole product, so it is faster to build and easier to maintain.

### 7.1 Languages

| Language | Where it is used |
|---|---|
| **TypeScript** (main language) | Website pages, admin panel, APIs, business logic |
| **SQL** | Database (boards, chapters, questions, users) |
| **HTML / CSS** | Page structure and design (via Next.js + Tailwind) |
| **Markdown + LaTeX** | How teachers write notes and math (not a programming language) |

**TypeScript** is JavaScript with types. It is the standard for modern websites that must rank on Google and stay reliable as the catalog grows.



### 7.2 Chosen stack

| Layer | Choice | Simple reason |
|---|---|---|
| Website + admin | **Next.js** (React) | Every chapter/exercise is a real page Google can index |
| Language | **TypeScript** | Fewer bugs; one language for front and back |
| Design | **Tailwind CSS** | Your look can change without rebuilding the logic |
| Math on screen | **KaTeX** | Fractions, roots, formulas display like a textbook |
| Database | **PostgreSQL** | Board → class → chapter → question is a structured tree |
| File storage | **Cloudflare R2** (or similar) | PDFs stay fast in exam season |
| Search | PostgreSQL search first; **Meilisearch** later if needed | “exercise 1.1 logarithms” works |
| Login | **Better Auth** (email / Google) | Teachers and later students |
| Hosting | **Vercel** or a VPS, with **Cloudflare** in front | CDN for pages and PDFs |

### 7.3 How the pieces fit

```
Student phone/laptop
        ↓
Cloudflare (fast copy of pages + PDFs)
        ↓
Next.js website  (TypeScript)
        ↓
PostgreSQL database     +     PDF storage (R2)
```

Teachers use the same Next.js app (admin area) to upload notes. Students never see that area.

---

## 8. Content you will need to provide

The software is the shelf. The notes are the books.

| You / your teachers provide | The system provides |
|---|---|
| Original solved exercises, MCQs, PDFs | Pages, upload, math display, download, search |
| Chapter titles as per the official syllabus | The folder structure (board / class / subject) |
| Author names and permission to publish | Author credit on each notes set |

The first demonstration subject in the plan is **FBISE Class 9 Mathematics** (chapters such as Real Numbers, Logarithms, Sets, … Basic Statistics), because that matches a full real syllabus. Other subjects and boards use the **same features**.

---

## 9. Summary for approval

Please confirm that the system should include:

1. **Functionality** — board/class/subject/chapter/exercise website; read online; PDF view and download; MCQs and long questions; search; share/print; teacher + editor publishing.  
2. **Extras (phased)** — quizzes, bookmarks, past papers, Urdu, dark mode, classroom, later apps.  
3. **Non-functional** — fast on mobile, exam-season traffic, secure admin, Google-visible pages, backups, privacy, accessibility.  
4. **Not included** — copying other sites’ notes, selling official books, live classes, paywall on public notes.  
5. **Stack** — TypeScript + Next.js + PostgreSQL + Cloudflare (PDF/CDN), as in Section 7.

If this matches your expectation, this SRS can be treated as the **agreed scope** for development.

---

**End of client SRS v3.1**
