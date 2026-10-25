import { BOARD_DATA, PAST_PAPERS } from "../demo-data.js";

export type BookRecord = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  classSlug: string;
  classTitle: string;
  subjectSlug: string | null;
  subjectTitle: string | null;
  title: string;
  priceLabel: string;
  coverUrl: string | null;
  pdfUrl: string | null;
  driveUrl: string | null;
  notesPath: string | null;
};

export type PastPaperType = "model" | "paper-pattern" | "first-annual" | "second-annual" | "pba";

/** Display order inside a year: 2nd Annual → Model Paper → 1st Annual, PBA last. */
const PAPER_TYPE_RANK: Record<PastPaperType, number> = {
  "second-annual": 0,
  "paper-pattern": 1,
  model: 2,
  "first-annual": 3,
  pba: 4,
};

/** Newest year first, then the paper-type order above, then subject name. */
export function sortPastPapers<
  T extends { id: number; year: string; paperType: PastPaperType; subjectTitle: string },
>(rows: T[]): T[] {
  return [...rows].sort((a, b) => {
    const yearDiff = (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0);
    if (yearDiff !== 0) return yearDiff;
    const rank = PAPER_TYPE_RANK[a.paperType] - PAPER_TYPE_RANK[b.paperType];
    if (rank !== 0) return rank;
    const bySubject = a.subjectTitle.localeCompare(b.subjectTitle);
    if (bySubject !== 0) return bySubject;
    return a.id - b.id;
  });
}

export type PastPaperRecord = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  classSlug: string;
  classTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  year: string;
  sessionType: "annual" | "supply";
  paperType: PastPaperType;
  isSolved: boolean;
  syllabus: "new" | "old";
  pdfUrl: string | null;
  driveUrl: string | null;
};

const boardMeta: Record<string, { slug: string; title: string }> = {
  FBISE: { slug: "fbise", title: "Federal Board (FBISE)" },
  Punjab: { slug: "punjab", title: "Punjab Board" },
  // Punjab Board examination authorities — same scheme of studies, own papers.
  Lahore: { slug: "lahore", title: "Lahore Board" },
  "Lahore Board": { slug: "lahore", title: "Lahore Board" },
  "D.G. Khan": { slug: "d-g-khan", title: "D.G. Khan Board" },
  "D.G. Khan Board": { slug: "d-g-khan", title: "D.G. Khan Board" },
  DGKhan: { slug: "d-g-khan", title: "D.G. Khan Board" },
  KPK: { slug: "kpk", title: "KPK Board" },
  Sindh: { slug: "sindh", title: "Sindh Board" },
};

const subjectMeta: Record<string, { slug: string; title: string }> = {
  Mathematics: { slug: "mathematics", title: "Mathematics" },
  Physics: { slug: "physics", title: "Physics" },
  Chemistry: { slug: "chemistry", title: "Chemistry" },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

let bookIdCounter = 1;
let pastPaperIdCounter = 1;

const MEMORY_BOOK_PDFS = [
  "/demo-pdfs/textbook-math-9.pdf",
  "/demo-pdfs/textbook-physics-9.pdf",
  "/demo-pdfs/textbook-chemistry-9.pdf",
  "/demo-pdfs/9th-biology-notes.pdf",
  "/demo-pdfs/9th-english-notes.pdf",
  "/demo-pdfs/9th-urdu-notes.pdf",
  "/demo-pdfs/10th-biology-notes.pdf",
  "/demo-pdfs/10th-chemistry-notes.pdf",
  "/demo-pdfs/10th-english-notes.pdf",
  "/demo-pdfs/10th-maths-notes.pdf",
  "/demo-pdfs/10th-physics-notes.pdf",
  "/demo-pdfs/11th-chemistry-notes.pdf",
  "/demo-pdfs/11th-maths-notes.pdf",
  "/demo-pdfs/11th-physics-notes.pdf",
  "/demo-pdfs/12th-physics-notes.pdf",
];

function demoPdfForSubject(subjectTitle: string, index: number): string {
  const subject = subjectTitle.toLowerCase();
  if (subject.includes("math")) return "/demo-pdfs/textbook-math-9.pdf";
  if (subject.includes("physics")) return "/demo-pdfs/textbook-physics-9.pdf";
  if (subject.includes("chemistry")) return "/demo-pdfs/textbook-chemistry-9.pdf";
  if (subject.includes("biolog")) return "/demo-pdfs/9th-biology-notes.pdf";
  if (subject.includes("english")) return "/demo-pdfs/9th-english-notes.pdf";
  if (subject.includes("urdu")) return "/demo-pdfs/9th-urdu-notes.pdf";
  return MEMORY_BOOK_PDFS[index % MEMORY_BOOK_PDFS.length];
}

const PRIMARY_SUBJECTS = [
  ["mathematics", "Mathematics"],
  ["english", "English"],
  ["urdu", "Urdu"],
  ["general-science", "General Science"],
  ["pakistan-studies", "Pakistan Studies"],
  ["islamiat", "Islamiat"],
  ["computer-science", "Computer Science"],
] as const;

const SECONDARY_SUBJECTS = [
  ["mathematics", "Mathematics"],
  ["physics", "Physics"],
  ["chemistry", "Chemistry"],
  ["biology", "Biology"],
  ["english", "English"],
  ["urdu", "Urdu"],
  ["computer-science", "Computer Science"],
  ["pakistan-studies", "Pakistan Studies"],
  ["islamiat", "Islamiat"],
] as const;

function catalogSubjects(classSlug: string, existing: { slug: string; title: string }[]) {
  const defaults = Number(classSlug.replace(/^class-/, "")) <= 8 ? PRIMARY_SUBJECTS : SECONDARY_SUBJECTS;
  const bySlug = new Map(existing.map((subject) => [subject.slug, subject]));
  for (const [slug, title] of defaults) bySlug.set(slug, bySlug.get(slug) ?? { slug, title });
  return [...bySlug.values()];
}

/**
 * The application runs without PostgreSQL during local development. Build that
 * fallback catalog directly from the board hierarchy so a book can never leak
 * into another board/class/subject, and every subject card has a readable PDF.
 */
const books: BookRecord[] = Object.values(BOARD_DATA).flatMap((board) =>
  board.classes.flatMap((klass) =>
    catalogSubjects(klass.slug, klass.subjects).map((subject, index) => {
      const catalogIndex = bookIdCounter - 1;
      return {
        id: bookIdCounter++,
        boardSlug: board.slug,
        boardTitle: board.title,
        classSlug: klass.slug,
        classTitle: klass.title,
        subjectSlug: subject.slug,
        subjectTitle: subject.title,
        title: `${klass.title} ${subject.title} Textbook — ${board.title}`,
        priceLabel: "Free PDF",
        coverUrl: null,
        pdfUrl: demoPdfForSubject(subject.title, catalogIndex + index),
        driveUrl: null,
        notesPath: `/${board.slug}/${klass.slug}/${subject.slug}`,
      };
    }),
  ),
);

const pastPapers: PastPaperRecord[] = PAST_PAPERS.map((paper) => {
  const board = boardMeta[paper.board] ?? { slug: slugify(paper.board), title: paper.board };
  const subject = subjectMeta[paper.subject] ?? { slug: slugify(paper.subject), title: paper.subject };
  return {
    id: pastPaperIdCounter++,
    boardSlug: board.slug,
    boardTitle: board.title,
    classSlug: "9",
    classTitle: "Class 9",
    subjectSlug: subject.slug,
    subjectTitle: subject.title,
    year: paper.year,
    sessionType: paper.paperType === "second-annual" ? ("supply" as const) : ("annual" as const),
    paperType: paper.paperType ?? "first-annual",
    isSolved: false,
    syllabus: "new",
    pdfUrl: null,
    driveUrl: null,
  };
});

export const resourcesStore = {
  listBooks: (filters: { boardSlug?: string; classSlug?: string; subjectSlug?: string } = {}) =>
    books.filter((b) => {
      if (filters.boardSlug && b.boardSlug !== filters.boardSlug) return false;
      if (filters.classSlug && b.classSlug !== filters.classSlug) return false;
      if (filters.subjectSlug && (b.subjectSlug ?? "") !== filters.subjectSlug) return false;
      return true;
    }),

  getBook: (id: number) => books.find((b) => b.id === id) ?? null,

  createBook: (input: Omit<BookRecord, "id">) => {
    const entry: BookRecord = { ...input, id: bookIdCounter++ };
    books.push(entry);
    return entry;
  },

  updateBook: (id: number, input: Partial<Omit<BookRecord, "id">>) => {
    const index = books.findIndex((b) => b.id === id);
    if (index < 0) return null;
    books[index] = { ...books[index], ...input };
    return books[index];
  },

  deleteBook: (id: number) => {
    const index = books.findIndex((b) => b.id === id);
    if (index < 0) return false;
    books.splice(index, 1);
    return true;
  },

  listPastPapers: (
    boardSlug?: string,
    year?: string,
    paperType?: string,
    classSlug?: string,
    syllabus?: string,
    solved?: string,
  ) => {
    let rows = [...pastPapers];
    if (boardSlug) rows = rows.filter((p) => p.boardSlug === boardSlug);
    if (year) rows = rows.filter((p) => p.year === year);
    if (paperType) rows = rows.filter((p) => p.paperType === paperType);
    if (classSlug) rows = rows.filter((p) => p.classSlug === classSlug);
    if (syllabus === "new" || syllabus === "old") rows = rows.filter((p) => p.syllabus === syllabus);
    if (solved === "solved") rows = rows.filter((p) => p.isSolved);
    if (solved === "unsolved") rows = rows.filter((p) => !p.isSolved);
    return sortPastPapers(rows);
  },

  getPastPaper: (id: number) => pastPapers.find((p) => p.id === id) ?? null,

  createPastPaper: (input: Omit<PastPaperRecord, "id">) => {
    const entry: PastPaperRecord = { ...input, id: pastPaperIdCounter++ };
    pastPapers.push(entry);
    return entry;
  },

  updatePastPaper: (id: number, input: Partial<Omit<PastPaperRecord, "id">>) => {
    const index = pastPapers.findIndex((p) => p.id === id);
    if (index < 0) return null;
    pastPapers[index] = { ...pastPapers[index], ...input };
    return pastPapers[index];
  },

  deletePastPaper: (id: number) => {
    const index = pastPapers.findIndex((p) => p.id === id);
    if (index < 0) return false;
    pastPapers.splice(index, 1);
    return true;
  },
};
