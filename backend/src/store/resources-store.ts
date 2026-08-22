import { BOOKS, PAST_PAPERS } from "../demo-data.js";

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
  pdfUrl: string | null;
  notesPath: string | null;
};

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
  pdfUrl: string | null;
};

const boardMeta: Record<string, { slug: string; title: string }> = {
  FBISE: { slug: "fbise", title: "Federal Board (FBISE)" },
  Punjab: { slug: "punjab", title: "Punjab Board" },
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

function parseClassName(className: string) {
  const match = className.match(/\d+/);
  return match?.[0] ?? slugify(className);
}

let bookIdCounter = 1;
let pastPaperIdCounter = 1;

const books: BookRecord[] = BOOKS.map((book) => {
  const board = boardMeta[book.board] ?? { slug: slugify(book.board), title: book.board };
  const classSlug = parseClassName(book.className);
  return {
    id: bookIdCounter++,
    boardSlug: board.slug,
    boardTitle: board.title,
    classSlug,
    classTitle: book.className,
    subjectSlug: book.title.toLowerCase().includes("math") ? "mathematics" : null,
    subjectTitle: book.title.toLowerCase().includes("math") ? "Mathematics" : null,
    title: book.title,
    priceLabel: book.price,
    pdfUrl: null,
    notesPath: book.title.toLowerCase().includes("math") ? `/${board.slug}/${classSlug}/mathematics` : null,
  };
});

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
    sessionType: "annual" as const,
    pdfUrl: null,
  };
});

export const resourcesStore = {
  listBooks: (boardSlug?: string) =>
    boardSlug ? books.filter((b) => b.boardSlug === boardSlug) : [...books],

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

  listPastPapers: (boardSlug?: string, year?: string) => {
    let rows = [...pastPapers];
    if (boardSlug) rows = rows.filter((p) => p.boardSlug === boardSlug);
    if (year) rows = rows.filter((p) => p.year === year);
    return rows;
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
