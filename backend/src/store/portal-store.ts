// Taleem360-style resource portal store (in-memory demo catalog).
// Categories + resources live here so the portal works even without PostgreSQL.

export type CategoryStatus = "published" | "hidden";

export type PortalCategory = {
  id: number;
  slug: string;
  name: string;
  nameUr: string;
  parentId: number | null;
  icon: string;
  gradient: string;
  imageUrl: string | null;
  order: number;
  status: CategoryStatus;
};

export type PortalResource = {
  id: number;
  slug: string;
  title: string;
  categoryId: number;
  board: string | null;
  classLabel: string | null;
  subject: string;
  author: string;
  description: string;
  fileUrl: string | null;
  coverUrl: string | null;
  sizeLabel: string;
  pages: number;
  downloads: number;
  addedAt: string;
  status: "published" | "pending" | "rejected";
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Deterministic pseudo-random generator so the demo catalog is stable across restarts.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(2026);

const pick = <T,>(list: readonly T[]): T => list[Math.floor(rng() * list.length)];
const intBetween = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;

// ── Categories ────────────────────────────────────────────────────────────

const CATEGORY_DEFS = [
  { slug: "textbooks", name: "Text Books", nameUr: "درسی کتب", icon: "📘", gradient: "from-sky-500 to-indigo-600" },
  { slug: "notes", name: "Notes", nameUr: "نوٹس", icon: "📝", gradient: "from-emerald-500 to-teal-600" },
  { slug: "online-quizzes", name: "Online Quizzes", nameUr: "آن لائن کوئز", icon: "❓", gradient: "from-sky-400 to-blue-600" },
  { slug: "pairing-schemes", name: "Pairing Schemes", nameUr: "پیئرنگ سکیمیں", icon: "🔗", gradient: "from-cyan-500 to-sky-600" },
  { slug: "results-news", name: "Result & Board News", nameUr: "نتائج اور بورڈ نیوز", icon: "📰", gradient: "from-red-500 to-orange-600" },
  { slug: "model-papers", name: "Model & Past Papers", nameUr: "ماڈل و پرانے پیپرز", icon: "📄", gradient: "from-rose-500 to-pink-600" },
  { slug: "guess-papers", name: "Guess Paper & Important Topic", nameUr: "گیس پیپر اہم موضوعات", icon: "🎯", gradient: "from-fuchsia-500 to-purple-600" },
  { slug: "test", name: "Test", nameUr: "ٹیسٹ", icon: "🗂️", gradient: "from-violet-500 to-indigo-600" },
  { slug: "tuition", name: "Tuition", nameUr: "ٹیوشن", icon: "🏫", gradient: "from-amber-500 to-orange-600" },
  { slug: "whiteboard", name: "Whiteboard", nameUr: "وائٹ بورڈ", icon: "🖊️", gradient: "from-amber-400 to-yellow-600" },
  { slug: "test-generator", name: "Test Generator", nameUr: "ٹیسٹ جنریٹر", icon: "⚡", gradient: "from-violet-400 to-purple-600" },
] as const;

const CHILD_DEFS: Record<string, { slug: string; name: string; nameUr: string; icon: string; gradient: string }[]> = {
  textbooks: [
    { slug: "federal-text-books", name: "Federal Board", nameUr: "وفاقی بورڈ", icon: "🏛️", gradient: "from-indigo-500 to-violet-700" },
    { slug: "punjab-text-books", name: "Punjab Board", nameUr: "پنجاب بورڈ", icon: "🏛️", gradient: "from-emerald-500 to-green-700" },
    { slug: "sindh-text-books", name: "Sindh Board", nameUr: "سندھ بورڈ", icon: "🏛️", gradient: "from-teal-500 to-cyan-700" },
    { slug: "balochistan-text-books", name: "Balochistan Board", nameUr: "بلوچستان بورڈ", icon: "🏛️", gradient: "from-purple-500 to-fuchsia-700" },
    { slug: "kpk-text-books", name: "KPK Board", nameUr: "KPK بورڈ", icon: "🏛️", gradient: "from-blue-500 to-sky-700" },
    { slug: "oxford-text-books", name: "Oxford", nameUr: "آکسفورڈ", icon: "🌍", gradient: "from-slate-500 to-slate-700" },
    { slug: "cambridge-text-books", name: "Cambridge", nameUr: "کیمبریج", icon: "🌍", gradient: "from-slate-600 to-slate-800" },
  ],
  notes: [
    { slug: "federal-board-notes", name: "Federal Board", nameUr: "وفاقی بورڈ", icon: "📝", gradient: "from-indigo-500 to-violet-700" },
    { slug: "punjab-board-notes", name: "Punjab Board", nameUr: "پنجاب بورڈ", icon: "📝", gradient: "from-emerald-500 to-teal-600" },
    { slug: "sindh-board-notes", name: "Sindh Board", nameUr: "سندھ بورڈ", icon: "📝", gradient: "from-teal-500 to-cyan-600" },
    { slug: "balochistan-board-notes", name: "Balochistan Board", nameUr: "بلوچستان بورڈ", icon: "📝", gradient: "from-purple-500 to-fuchsia-600" },
    { slug: "kpk-board-notes", name: "KPK Board", nameUr: "KPK بورڈ", icon: "📝", gradient: "from-blue-500 to-sky-600" },
    { slug: "cambridge-intl-notes", name: "Cambridge International", nameUr: "کیمبریج انٹرنیشنل", icon: "🌍", gradient: "from-slate-500 to-slate-700" },
    { slug: "oxford-notes", name: "Oxford", nameUr: "آکسفورڈ", icon: "🌍", gradient: "from-slate-400 to-slate-600" },
    { slug: "pearson-edexcel-notes", name: "Pearson Edexcel", nameUr: "پیئرسن ایڈیکسل", icon: "🌍", gradient: "from-rose-400 to-red-600" },
    { slug: "aqa-notes", name: "AQA (UK)", nameUr: "AQA (یو کے)", icon: "🌍", gradient: "from-orange-400 to-amber-600" },
    { slug: "city-guilds-notes", name: "City & Guilds", nameUr: "سٹی اینڈ گلڈز", icon: "🌍", gradient: "from-yellow-400 to-orange-600" },
    { slug: "ib-notes", name: "International Baccalaureate (IB)", nameUr: "انٹرنیشنل بیکلوریٹ", icon: "🌍", gradient: "from-teal-400 to-emerald-600" },
  ],
  "online-quizzes": [],
  "pairing-schemes": [
    { slug: "9th-class-pairing-schemes", name: "9th", nameUr: "9ویں", icon: "🔗", gradient: "from-cyan-400 to-sky-600" },
    { slug: "10th-class-pairing-schemes", name: "10th", nameUr: "10ویں", icon: "🔗", gradient: "from-sky-400 to-blue-600" },
    { slug: "1st-year-pairing-schemes", name: "1st Year", nameUr: "پہلے سال", icon: "🔗", gradient: "from-blue-400 to-indigo-600" },
    { slug: "2nd-year-pairing-schemes", name: "2nd Year", nameUr: "دوسرے سال", icon: "🔗", gradient: "from-indigo-400 to-violet-600" },
  ],
  "results-news": [
    { slug: "top-position-holders", name: "Top Position Holders", nameUr: "ٹاپ پوزیشن ہولڈرز", icon: "🏆", gradient: "from-yellow-400 to-orange-600" },
    { slug: "result-gazettes", name: "Result Gazette", nameUr: "نتائج گزٹ", icon: "📋", gradient: "from-red-400 to-rose-600" },
    { slug: "scholarship-holders", name: "Scholarship Holders", nameUr: "اسکالرشپ ہولڈرز", icon: "🎓", gradient: "from-amber-400 to-yellow-600" },
    { slug: "date-sheets", name: "Date Sheets", nameUr: "ڈیٹ شیٹس", icon: "📅", gradient: "from-orange-400 to-amber-600" },
    { slug: "admission-exam-schedules", name: "Admission & Exams Schedules", nameUr: " داخلے اور امتحانات کا شیڈول", icon: "🗓️", gradient: "from-emerald-400 to-teal-600" },
    { slug: "board-news-info", name: "News & Supplementary Information", nameUr: "خبریں و مکمل معلومات", icon: "📢", gradient: "from-sky-400 to-blue-600" },
  ],
  "model-papers": [
    { slug: "9th-class-model-papers", name: "9th", nameUr: "9ویں", icon: "📄", gradient: "from-rose-400 to-pink-600" },
    { slug: "10th-class-model-papers", name: "10th", nameUr: "10ویں", icon: "📄", gradient: "from-pink-400 to-rose-600" },
    { slug: "1st-year-model-papers", name: "1st Year", nameUr: "پہلے سال", icon: "📄", gradient: "from-fuchsia-400 to-purple-600" },
    { slug: "2nd-year-model-papers", name: "2nd Year", nameUr: "دوسرے سال", icon: "📄", gradient: "from-purple-400 to-violet-600" },
  ],
  "guess-papers": [
    { slug: "9th-class-guess-papers", name: "9th", nameUr: "9ویں", icon: "🎯", gradient: "from-fuchsia-400 to-purple-600" },
    { slug: "10th-class-guess-papers", name: "10th", nameUr: "10ویں", icon: "🎯", gradient: "from-pink-400 to-rose-600" },
    { slug: "1st-year-guess-papers", name: "1st Year", nameUr: "پہلے سال", icon: "🎯", gradient: "from-violet-400 to-indigo-600" },
    { slug: "2nd-year-guess-papers", name: "2nd Year", nameUr: "دوسرے سال", icon: "🎯", gradient: "from-indigo-400 to-blue-600" },
  ],
  "test": [
    { slug: "9th-class-tests", name: "9th", nameUr: "9ویں", icon: "🗂️", gradient: "from-violet-400 to-purple-600" },
    { slug: "10th-class-tests", name: "10th", nameUr: "10ویں", icon: "🗂️", gradient: "from-indigo-400 to-blue-600" },
    { slug: "1st-year-tests", name: "1st Year", nameUr: "پہلے سال", icon: "🗂️", gradient: "from-blue-400 to-sky-600" },
    { slug: "2nd-year-tests", name: "2nd Year", nameUr: "دوسرے سال", icon: "🗂️", gradient: "from-sky-400 to-cyan-600" },
  ],
  "tuition": [
    { slug: "online-academy-classes", name: "Online Academy Classes", nameUr: "آن لائن اکیڈمی کلاسز", icon: "💻", gradient: "from-blue-400 to-indigo-600" },
    { slug: "find-tutor", name: "Find a Tutor", nameUr: "ٹیوشن ڈھونڈیں", icon: "🔍", gradient: "from-emerald-400 to-teal-600" },
    { slug: "tuition-request", name: "Tuition Request", nameUr: "ٹیوشن درخواست", icon: "📩", gradient: "from-amber-400 to-orange-600" },
    { slug: "become-tutor", name: "Become a Tutor", nameUr: "ٹیوشن بنیں", icon: "👨‍🏫", gradient: "from-purple-400 to-violet-600" },
  ],
  "whiteboard": [],
  "test-generator": [],
};

const gradients = [
  "from-sky-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-fuchsia-500 to-purple-600",
  "from-cyan-500 to-sky-600",
  "from-lime-500 to-green-600",
  "from-violet-500 to-indigo-600",
  "from-slate-600 to-slate-800",
];

const SUBJECT_COVERS: Record<string, string> = {
  Physics: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=500&fit=crop",
  Chemistry: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=500&fit=crop",
  Mathematics: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=500&fit=crop",
  Biology: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=500&fit=crop",
  English: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=500&fit=crop",
  "Computer Science": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=500&fit=crop",
  Urdu: "https://images.unsplash.com/photo-1562408590-e32931084e23?w=400&h=500&fit=crop",
  "Pakistan Studies": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=500&fit=crop",
  General: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=500&fit=crop",
};

const CATEGORY_COVERS: Record<string, string> = {
  textbooks: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop",
  notes: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop",
  "pairing-schemes": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
  "results-news": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
  "model-papers": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop",
  "guess-papers": "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&h=400&fit=crop",
  test: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=400&fit=crop",
  tuition: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop",
};

const categories: PortalCategory[] = [];
let categoryId = 1;

function addCategory(slug: string, name: string, nameUr: string, parentId: number | null, icon: string, gradient: string, order: number, imageUrl?: string | null) {
  categories.push({ id: categoryId++, slug, name, nameUr, parentId, icon, gradient, imageUrl: imageUrl ?? null, order, status: "published" });
}

CATEGORY_DEFS.forEach((def, index) => {
  const childList = CHILD_DEFS[def.slug] ?? [];
  if (childList.length === 0) {
    addCategory(def.slug, def.name, def.nameUr, null, def.icon, def.gradient, index, CATEGORY_COVERS[def.slug] ?? null);
    return;
  }
  addCategory(def.slug, def.name, def.nameUr, null, def.icon, def.gradient, index, CATEGORY_COVERS[def.slug] ?? null);
  const parentId = categories.find((c) => c.slug === def.slug)!.id;
  childList.forEach((child, childIndex) => {
    addCategory(child.slug, child.name, child.nameUr, parentId, child.icon, child.gradient ?? pick(gradients), childIndex);
  });
});

// ── Resources ─────────────────────────────────────────────────────────────

const AUTHORS = [
  "BoardNotes Editorial",
  "Smart Study Group",
  "Lahore Board Academy",
  "Dr. Ahmad Khan",
  "Prof. Saima Malik",
  "Elite Education Hub",
  "City College Notes",
  "Academic Publishing",
];

const BOARD_TAGS = ["Punjab Board", "FBISE", "Sindh Board", "KPK Board", null];

const SUBJECTS = [
  "Physics",
  "Chemistry",
  "Mathematics",
  "Biology",
  "English",
  "Computer Science",
  "Urdu",
  "Pakistan Studies",
];

const SAMPLE_PDFS = [
  "/demo-pdfs/9th-physics-notes.pdf",
  "/demo-pdfs/9th-chemistry-notes.pdf",
  "/demo-pdfs/9th-maths-notes.pdf",
  "/demo-pdfs/9th-biology-notes.pdf",
  "/demo-pdfs/9th-english-notes.pdf",
  "/demo-pdfs/9th-urdu-notes.pdf",
  "/demo-pdfs/10th-physics-notes.pdf",
  "/demo-pdfs/10th-chemistry-notes.pdf",
  "/demo-pdfs/10th-maths-notes.pdf",
  "/demo-pdfs/10th-biology-notes.pdf",
  "/demo-pdfs/10th-english-notes.pdf",
  "/demo-pdfs/11th-physics-notes.pdf",
  "/demo-pdfs/11th-chemistry-notes.pdf",
  "/demo-pdfs/11th-maths-notes.pdf",
  "/demo-pdfs/12th-physics-notes.pdf",
  "/demo-pdfs/textbook-math-9.pdf",
  "/demo-pdfs/textbook-physics-9.pdf",
  "/demo-pdfs/textbook-chemistry-9.pdf",
  "/demo-pdfs/past-paper-math-9-2025.pdf",
  "/demo-pdfs/past-paper-english-10-2024.pdf",
  "/demo-pdfs/past-paper-biology-9-2026.pdf",
  "/demo-pdfs/guess-paper-9-science.pdf",
  "/demo-pdfs/pairing-scheme-9.pdf",
  "/demo-pdfs/mdcat-biology-practice.pdf",
  "/demo-pdfs/ecat-maths-practice.pdf",
] as const;

const resources: PortalResource[] = [];
let resourceId = 1;
let fileIndex = 0;

function makeSlugs(title: string, subject: string) {
  const base = slugify(`${subject} ${title}`);
  if (resources.some((r) => r.slug === base)) return `${base}-${intBetween(1, 99)}`;
  return base;
}

function pushResource(input: {
  title: string;
  categorySlug: string;
  subject: string;
  board?: string | null;
  description: string;
  sizeLabel: string;
  pages: number;
  coverUrl?: string | null;
}) {
  const category = categories.find((c) => c.slug === input.categorySlug) ?? categories[0];
  const dayOffset = intBetween(1, 75);
  const added = new Date(Date.now() - dayOffset * 86400000 - intBetween(0, 20) * 3600000).toISOString();
  const fileUrl = null;
  const baseSlug = slugify(`${input.subject} ${input.title}`);
  resources.push({
    id: resourceId++,
    slug: resources.some((r) => r.slug === baseSlug) ? `${baseSlug}-${intBetween(1, 99)}` : baseSlug,
    title: input.title,
    categoryId: category.id,
    board: input.board ?? pick(BOARD_TAGS),
    classLabel: category.name.match(/\d+/) ? `Class ${category.name.match(/\d+/)![0]}` : null,
    subject: input.subject,
    author: pick(AUTHORS),
    description: input.description,
    fileUrl,
    coverUrl: input.coverUrl ?? null,
    sizeLabel: input.sizeLabel,
    pages: input.pages,
    downloads: intBetween(340, 9800),
    addedAt: added,
    status: "published",
  });
}

// ── Board Textbooks ──────────────────────────────────────────────────────
const ORDINALS: Record<number, string> = { 9: "9th", 10: "10th", 11: "1st Year", 12: "2nd Year" };

const BOARD_TEXTBOOK: Record<string, string> = {
  "federal-text-books": "Federal Board",
  "punjab-text-books": "Punjab Board",
  "sindh-text-books": "Sindh Board",
  "balochistan-text-books": "Balochistan Board",
  "kpk-text-books": "KPK Board",
  "oxford-text-books": "Oxford",
  "cambridge-text-books": "Cambridge",
};

for (const [leafSlug, board] of Object.entries(BOARD_TEXTBOOK)) {
  for (const subject of ["Mathematics", "Physics", "Chemistry", "Biology", "English"]) {
    for (const cls of [9, 10, 11, 12]) {
      pushResource({
        title: `${board === "Cambridge" ? "IGCSE" : board === "Oxford" ? "O-Level" : ""} Textbook ${subject} ${ORDINALS[cls]} (${board}) PDF`,
        categorySlug: leafSlug,
        subject,
        board,
        description: `Official ${board} ${ORDINALS[cls]} ${subject} textbook in PDF format for reading online and download.`,
        sizeLabel: `${intBetween(8, 42)} MB`,
        pages: intBetween(180, 320),
        coverUrl: SUBJECT_COVERS[subject] ?? SUBJECT_COVERS.General,
      });
    }
  }
}

// ── Board Notes ──────────────────────────────────────────────────────────
const BOARD_NOTES: Record<string, string> = {
  "federal-board-notes": "Federal Board",
  "punjab-board-notes": "Punjab Board",
  "sindh-board-notes": "Sindh Board",
  "balochistan-board-notes": "Balochistan Board",
  "kpk-board-notes": "KPK Board",
  "cambridge-intl-notes": "Cambridge International",
  "oxford-notes": "Oxford",
  "pearson-edexcel-notes": "Pearson Edexcel",
  "aqa-notes": "AQA",
  "city-guilds-notes": "City & Guilds",
  "ib-notes": "IB",
};

const ALL_SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology", "English", "Computer Science", "Urdu", "Pakistan Studies"];

const NOTE_DESCRIPTIONS: Record<string, string> = {
  Physics: "Complete chapter-wise notes with key concepts, solved numericals, and short questions for board exam preparation.",
  Chemistry: "Chapter-wise chemistry notes covering reactions, definitions, and solved short & long questions.",
  Mathematics: "Step-by-step notes with formulas, proofs, and worked examples aligned to the board syllabus.",
  Biology: "Concise biology notes with diagrams, definitions, and important board questions.",
  English: "Grammar, comprehension, and textbook exercises compiled for board preparation.",
  "Computer Science": "Chapter-wise notes with solved exercises, short questions, and exam tips.",
  Urdu: "امتحان کے مطابق اردو نوٹس جن میں تمام ابواب کے حل شدہ سوالات شامل ہیں۔",
  "Pakistan Studies": "Notes covering key topics, historical facts, and board questions.",
};

for (const [leafSlug, board] of Object.entries(BOARD_NOTES)) {
  for (const subject of ALL_SUBJECTS) {
    for (const cls of [9, 10, 11, 12]) {
      pushResource({
        title: `${ORDINALS[cls]} ${subject} Notes (${board}) PDF`,
        categorySlug: leafSlug,
        subject,
        board,
        description: NOTE_DESCRIPTIONS[subject] ?? NOTE_DESCRIPTIONS.Physics,
        sizeLabel: `${intBetween(1, 6)} MB`,
        pages: intBetween(6, 32),
        coverUrl: SUBJECT_COVERS[subject] ?? SUBJECT_COVERS.General,
      });
    }
  }
}

// ── Pairing Schemes ──────────────────────────────────────────────────────
const PAIRING_MAP: Record<string, number> = {
  "9th-class-pairing-schemes": 9,
  "10th-class-pairing-schemes": 10,
  "1st-year-pairing-schemes": 11,
  "2nd-year-pairing-schemes": 12,
};

for (const [slug, cls] of Object.entries(PAIRING_MAP)) {
  for (const subject of ["Physics", "Chemistry", "Mathematics", "Biology", "English"]) {
    pushResource({
      title: `${ORDINALS[cls]} ${subject} Pairing Scheme 2026 PDF`,
      categorySlug: slug,
      subject,
      board: pick(BOARD_TAGS),
      description: `Official ${ORDINALS[cls]} ${subject} pairing scheme for the annual board exams 2026 with section-wise marks distribution.`,
      sizeLabel: `${intBetween(1, 4)} MB`,
      pages: intBetween(4, 14),
      coverUrl: SUBJECT_COVERS[subject] ?? SUBJECT_COVERS.General,
    });
  }
}

// ── Model & Past Papers ──────────────────────────────────────────────────
const MODEL_MAP: Record<string, number> = {
  "9th-class-model-papers": 9,
  "10th-class-model-papers": 10,
  "1st-year-model-papers": 11,
  "2nd-year-model-papers": 12,
};

for (const [slug, cls] of Object.entries(MODEL_MAP)) {
  for (const subject of ["Physics", "Chemistry", "Mathematics", "Biology", "English"]) {
    pushResource({
      title: `${ORDINALS[cls]} ${subject} Model Paper 2026 (Solved) PDF`,
      categorySlug: slug,
      subject,
      board: pick(BOARD_TAGS),
      description: `Official model paper for ${ORDINALS[cls]} ${subject} board exam 2026 with detailed solutions.`,
      sizeLabel: `${intBetween(2, 8)} MB`,
      pages: intBetween(12, 30),
      coverUrl: SUBJECT_COVERS[subject] ?? SUBJECT_COVERS.General,
    });
    pushResource({
      title: `${ORDINALS[cls]} ${subject} Past Paper 2025 (Annual) PDF`,
      categorySlug: slug,
      subject,
      board: pick(BOARD_TAGS),
      description: `${ORDINALS[cls]} ${subject} past paper from the 2025 annual board examination with answer key.`,
      sizeLabel: `${intBetween(2, 8)} MB`,
      pages: intBetween(10, 28),
      coverUrl: SUBJECT_COVERS[subject] ?? SUBJECT_COVERS.General,
    });
  }
}

// ── Guess Papers & Important Topics ──────────────────────────────────────
const GUESS_MAP: Record<string, number> = {
  "9th-class-guess-papers": 9,
  "10th-class-guess-papers": 10,
  "1st-year-guess-papers": 11,
  "2nd-year-guess-papers": 12,
};

for (const [slug, cls] of Object.entries(GUESS_MAP)) {
  for (const subject of ["Physics", "Chemistry", "Mathematics", "Biology", "English", "Urdu"]) {
    pushResource({
      title: `${ORDINALS[cls]} ${subject} Guess Paper 2026 PDF`,
      categorySlug: slug,
      subject,
      board: pick(BOARD_TAGS),
      description: `Most important ${subject} questions predicted for the ${ORDINALS[cls]} board exam 2026, with marking scheme.`,
      sizeLabel: `${intBetween(1, 6)} MB`,
      pages: intBetween(8, 24),
      coverUrl: SUBJECT_COVERS[subject] ?? SUBJECT_COVERS.General,
    });
    pushResource({
      title: `${ORDINALS[cls]} ${subject} Important Topics 2026 PDF`,
      categorySlug: slug,
      subject,
      board: pick(BOARD_TAGS),
      description: `Key ${subject} topics and chapter summaries for ${ORDINALS[cls]} exam preparation 2026.`,
      sizeLabel: `${intBetween(1, 4)} MB`,
      pages: intBetween(6, 18),
      coverUrl: SUBJECT_COVERS[subject] ?? SUBJECT_COVERS.General,
    });
  }
}

// ── Test Papers (by class) ──────────────────────────────────────────────
const TEST_MAP: Record<string, number> = {
  "9th-class-tests": 9,
  "10th-class-tests": 10,
  "1st-year-tests": 11,
  "2nd-year-tests": 12,
};

for (const [slug, cls] of Object.entries(TEST_MAP)) {
  for (const subject of ["Physics", "Chemistry", "Mathematics", "Biology", "English", "Computer Science"]) {
    pushResource({
      title: `${ORDINALS[cls]} ${subject} Chapterwise Test Papers PDF`,
      categorySlug: slug,
      subject,
      board: pick(BOARD_TAGS),
      description: `Chapterwise test papers for ${subject} — print-ready with mark allocation for ${ORDINALS[cls]} class.`,
      sizeLabel: `${intBetween(3, 12)} MB`,
      pages: intBetween(15, 45),
      coverUrl: SUBJECT_COVERS[subject] ?? SUBJECT_COVERS.General,
    });
    pushResource({
      title: `${ORDINALS[cls]} ${subject} Full & Half Book Test PDF`,
      categorySlug: slug,
      subject,
      board: pick(BOARD_TAGS),
      description: `Full book and half book test papers for ${subject} ${ORDINALS[cls]} with objective and subjective sections.`,
      sizeLabel: `${intBetween(2, 9)} MB`,
      pages: intBetween(10, 38),
      coverUrl: SUBJECT_COVERS[subject] ?? SUBJECT_COVERS.General,
    });
  }
}

// ── Tuition ──────────────────────────────────────────────────────────────
const TUITION_RESOURCES = [
  { cat: "online-academy-classes", title: "Live Online Physics Classes (9th-12th)", subject: "Physics", description: "Join live interactive physics sessions with expert tutors for classes 9th through 12th." },
  { cat: "online-academy-classes", title: "Live Online Chemistry Classes (9th-12th)", subject: "Chemistry", description: "Interactive online chemistry classes covering board syllabus with doubt-clearing sessions." },
  { cat: "online-academy-classes", title: "Live Online Mathematics Classes (9th-12th)", subject: "Mathematics", description: "Step-by-step online maths classes with practice problems and exam strategies." },
  { cat: "online-academy-classes", title: "Live Online Biology Classes (9th-12th)", subject: "Biology", description: "Comprehensive online biology classes with diagrams, notes, and board prep tips." },
  { cat: "find-tutor", title: "Find a Physics Tutor Near You", subject: "Physics", description: "Browse verified physics tutors in your city for in-home or online tuition." },
  { cat: "find-tutor", title: "Find a Chemistry Tutor Near You", subject: "Chemistry", description: "Connect with experienced chemistry tutors for personalized learning." },
  { cat: "find-tutor", title: "Find a Mathematics Tutor Near You", subject: "Mathematics", description: "Search for qualified maths tutors available for home and online tuition." },
  { cat: "tuition-request", title: "Request Tuition — Physics", subject: "Physics", description: "Submit a tuition request for physics and get matched with the best available tutor." },
  { cat: "tuition-request", title: "Request Tuition — Chemistry", subject: "Chemistry", description: "Submit a tuition request for chemistry and we will connect you with expert tutors." },
  { cat: "become-tutor", title: "Become a Physics Tutor", subject: "Physics", description: "Apply to become a verified physics tutor on BoardNotes and start teaching." },
  { cat: "become-tutor", title: "Become a Chemistry Tutor", subject: "Chemistry", description: "Register as a chemistry tutor and reach thousands of students across Pakistan." },
  { cat: "become-tutor", title: "Become a Mathematics Tutor", subject: "Mathematics", description: "Sign up as a maths tutor and help students ace their board exams." },
];
for (const entry of TUITION_RESOURCES) {
  pushResource({
    title: entry.title,
    categorySlug: entry.cat,
    subject: entry.subject,
    board: null,
    description: entry.description,
    sizeLabel: `${intBetween(1, 4)} MB`,
    pages: intBetween(2, 10),
    coverUrl: SUBJECT_COVERS[entry.subject] ?? CATEGORY_COVERS.tuition,
  });
}

// ── Results & Board News ────────────────────────────────────────────────
const NEWS_RESOURCES = [
  { cat: "top-position-holders", title: "Punjab Board Top Position Holders 2025", subject: "General", description: "List of top position holders across all Punjab boards for 2025 annual exams." },
  { cat: "top-position-holders", title: "FBISE Top Position Holders 2025", subject: "General", description: "Federal Board top position holders for 2025 annual examinations." },
  { cat: "top-position-holders", title: "Sindh Board Top Position Holders 2025", subject: "General", description: "Sindh Board top position holders across all classes for 2025." },
  { cat: "result-gazettes", title: "9th Class Result Gazette 2025 (All Boards) PDF", subject: "General", description: "Complete result gazette for 9th class annual exams 2025 covering all Punjab boards." },
  { cat: "result-gazettes", title: "10th Class Result Gazette 2025 (All Boards) PDF", subject: "General", description: "Complete result gazette for 10th class annual exams 2025 covering all Punjab boards." },
  { cat: "result-gazettes", title: "1st Year Result Gazette 2025 PDF", subject: "General", description: "Intermediate Part 1 result gazette for 2025 annual examinations." },
  { cat: "result-gazettes", title: "2nd Year Result Gazette 2025 PDF", subject: "General", description: "Intermediate Part 2 result gazette for 2025 annual examinations." },
  { cat: "scholarship-holders", title: "Punjab Board Scholarship Holders 2025", subject: "General", description: "Scholarship holders across Punjab boards for 2025 annual exams." },
  { cat: "scholarship-holders", title: "FBISE Scholarship Holders 2025", subject: "General", description: "Federal Board scholarship recipients for 2025." },
  { cat: "date-sheets", title: "9th Class Date Sheet 2026 (Punjab Boards)", subject: "General", description: "Annual examination date sheet for 9th class 2026 across Punjab boards." },
  { cat: "date-sheets", title: "10th Class Date Sheet 2026 (Punjab Boards)", subject: "General", description: "Annual examination date sheet for 10th class 2026 across Punjab boards." },
  { cat: "date-sheets", title: "1st Year Date Sheet 2026 (All Boards)", subject: "General", description: "Intermediate Part 1 annual exam date sheet 2026." },
  { cat: "date-sheets", title: "2nd Year Date Sheet 2026 (All Boards)", subject: "General", description: "Intermediate Part 2 annual exam date sheet 2026." },
  { cat: "admission-exam-schedules", title: "9th Class Admission Schedule 2026 (All Boards)", subject: "General", description: "Complete admission schedule for 9th class across all boards for 2026." },
  { cat: "admission-exam-schedules", title: "10th Class Exam Schedule 2026 (All Boards)", subject: "General", description: "Annual examination schedule for 10th class 2026." },
  { cat: "admission-exam-schedules", title: "Intermediate Admission & Exam Schedule 2026", subject: "General", description: "Admission and exam schedule for intermediate classes across all boards." },
  { cat: "board-news-info", title: "BISE Notifications 2026 — Latest Updates", subject: "General", description: "Latest official notifications from BISE across Pakistan for 2026." },
  { cat: "board-news-info", title: "Supplementary Exam Information 2026", subject: "General", description: "Information about supplementary exams, rechecking, and improvement papers." },
  { cat: "board-news-info", title: "New Education Policies & Updates 2026", subject: "General", description: "Updates on curriculum changes, new policies, and examination reforms." },
];
for (const news of NEWS_RESOURCES) {
  pushResource({
    title: news.title,
    categorySlug: news.cat,
    subject: news.subject,
    board: null,
    description: news.description,
    sizeLabel: `${intBetween(1, 8)} MB`,
    pages: intBetween(4, 20),
    coverUrl: CATEGORY_COVERS[news.cat] ?? CATEGORY_COVERS["results-news"],
  });
}

// ── Store helpers ─────────────────────────────────────────────────────────

function categoryChildren(categoryId: number): PortalCategory[] {
  return categories
    .filter((c) => c.parentId === categoryId && c.status === "published")
    .sort((a, b) => a.order - b.order);
}

function collectLeafIds(categoryId: number): number[] {
  const leaves: number[] = [];
  const visit = (id: number) => {
    const kids = categoryChildren(id);
    if (kids.length === 0) {
      leaves.push(id);
      return;
    }
    for (const kid of kids) visit(kid.id);
  };
  visit(categoryId);
  return leaves.length > 0 ? leaves : [categoryId];
}

function buildTrail(categoryId: number): PortalCategory[] {
  const trail: PortalCategory[] = [];
  let current = categories.find((c) => c.id === categoryId) ?? null;
  while (current) {
    trail.unshift(current);
    current = current.parentId ? categories.find((c) => c.id === current!.parentId) ?? null : null;
  }
  return trail;
}

export const portalStore = {
  listCategories: () => [...categories].sort((a, b) => a.order - b.order),

  getTopCategories: () => categories.filter((c) => c.parentId === null && c.status === "published").sort((a, b) => a.order - b.order),

  getCategoryBySlug: (slug: string) => categories.find((c) => c.slug === slug && c.status === "published") ?? null,

  getCategory: (id: number) => categories.find((c) => c.id === id) ?? null,

  getChildren: (categoryId: number) => categoryChildren(categoryId),

  getTrail: (categoryId: number) => buildTrail(categoryId),

  listResources: (options: { categorySlug?: string; q?: string; sort?: "latest" | "popular" | "a-z" }) => {
    let rows = [...resources];
    const categorySlug = options.categorySlug?.trim();
    if (categorySlug) {
      const category = categories.find((c) => c.slug === categorySlug);
      if (category) {
        const ids = new Set(collectLeafIds(category.id));
        rows = rows.filter((r) => ids.has(r.categoryId));
      }
    }
    const q = options.q?.trim().toLowerCase();
    if (q) {
      rows = rows.filter((r) =>
        [r.title, r.subject, r.author, r.description, r.board ?? "", r.classLabel ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    rows = rows.filter((r) => r.status === "published");
    const sort = options.sort ?? "latest";
    rows.sort((a, b) => {
      if (sort === "popular") return b.downloads - a.downloads;
      if (sort === "a-z") return a.title.localeCompare(b.title);
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });
    return rows;
  },

  getLatest: (limit = 8) =>
    [...resources]
      .filter((r) => r.status === "published")
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      .slice(0, limit),

  getTrending: (limit = 4) =>
    [...resources]
      .filter((r) => r.status === "published")
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limit),

  getResourceBySlug: (slug: string) => resources.find((r) => r.slug === slug && r.status === "published") ?? null,

  getResourceById: (id: number) => resources.find((r) => r.id === id) ?? null,

  getRelated: (resource: PortalResource, limit = 4) => {
    const sameCat = resources.filter(
      (r) => r.id !== resource.id && r.status === "published" && r.categoryId === resource.categoryId,
    );
    const sameSubject = resources.filter(
      (r) => r.id !== resource.id && r.status === "published" && r.subject === resource.subject,
    );
    const pool = sameCat.length >= limit ? sameCat : [...sameCat, ...sameSubject];
    const seen = new Set<number>();
    const out: PortalResource[] = [];
    for (const item of pool) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      out.push(item);
      if (out.length >= limit) break;
    }
    return out;
  },

  createResource: (input: Omit<PortalResource, "id" | "slug" | "downloads" | "addedAt">) => {
    const entry: PortalResource = {
      ...input,
      id: resourceId++,
      slug: makeSlugs(input.title, input.subject),
      downloads: 0,
      addedAt: new Date().toISOString(),
    };
    resources.unshift(entry);
    return entry;
  },

  updateResource: (id: number, input: Partial<Omit<PortalResource, "id">>) => {
    const index = resources.findIndex((r) => r.id === id);
    if (index < 0) return null;
    resources[index] = { ...resources[index], ...input };
    return resources[index];
  },

  deleteResource: (id: number) => {
    const index = resources.findIndex((r) => r.id === id);
    if (index < 0) return false;
    resources.splice(index, 1);
    return true;
  },

  incrementDownloads: (id: number) => {
    const resource = resources.find((r) => r.id === id);
    if (!resource) return 0;
    resource.downloads += 1;
    return resource.downloads;
  },

  stats: () => ({
    books: resources.filter((r) => r.status === "published").length,
    categories: categories.filter((c) => c.status === "published").length,
  }),
};