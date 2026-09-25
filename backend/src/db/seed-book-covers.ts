import { sql } from "drizzle-orm";
import { db } from "./index.js";
import * as schema from "./schema.js";

const BOOK_COVERS: Record<string, Record<number, Record<string, string>>> = {
  FBISE: {
    5: {
      Mathematics: "/book-covers/fbise-5-5-mathematics.webp",
      English: "/book-covers/fbise-5-5-english.jpg",
      Urdu: "/book-covers/fbise-5-5-urdu.webp",
      "General Science": "/book-covers/fbise-5-5-general-science.webp",
      "Pakistan Studies": "/book-covers/fbise-5-5th-Class-Social-Studies.jpg",
      Islamiat: "/book-covers/fbise-5-Class-5-Islamiat-Federal-Board.webp",
    },
    6: {
      Mathematics: "/book-covers/fbise-6-MATH-6-NBF.webp",
      "Computer Science": "/book-covers/fbise-6-Class-6-Computer-Science-Book.webp",
      Arabic: "/book-covers/fbise-6-Arabic-Book--6th-class.jpg",
    },
    7: {
      Mathematics: "/book-covers/fbise-7-GENERAL-SCIENCE-7-NBF.webp",
      English: "/book-covers/fbise-7-ENGLISH-7-NBF.webp",
      "Computer Science": "/book-covers/fbise-7-Computer-Science-7.jpg",
      Urdu: "/book-covers/fbise-7-URDU-7-NBF.webp",
      Islamiat: "/book-covers/fbise-7-Class-7-Islamiat-Federal-Board.jpg",
      "General Science": "/book-covers/fbise-7-Class-7-General-Science-Federal-Board.jpg",
      Geography: "/book-covers/fbise-7-GEOGRAPHY-7-NBF.webp",
      History: "/book-covers/fbise-7-Class-7-History-Federal-Board.jpg",
    },
    8: {
      Mathematics: "/book-covers/fbise-8-Math-8-NBF.webp",
      English: "/book-covers/fbise-8-English-8-NBF-FG-Saleemi-Book-Depot-in-39471868674351.webp",
      "Computer Science": "/book-covers/fbise-8-Computer-8-NBF.webp",
      Urdu: "/book-covers/fbise-8-Urdu-8-NBF.jpg",
      Islamiat: "/book-covers/fbise-8-ISLAMIYAT-Class-8.webp",
      "General Science": "/book-covers/fbise-8-General-Science-8.jpg",
      Geography: "/book-covers/fbise-8-Geography-8-NBF.webp",
      History: "/book-covers/fbise-8-nbf-history-8.jpg",
    },
    9: {
      Physics: "/book-covers/fbise-9-Class-9-Physics-NBF.jpg",
      Chemistry: "/book-covers/fbise-9-Chemistry-9-With-Experimentation-Skills-NBF.webp",
      Mathematics: "/book-covers/fbise-9-9th-Class-Mathematics-NBF.jpg",
      Biology: "/book-covers/fbise-9-9th-Class-Biology-NBF.jpg",
      English: "/book-covers/fbise-9-English-9-NBF.webp",
      "Computer Science": "/book-covers/fbise-9-HamdardChemistryGuide9.webp",
      Urdu: "/book-covers/fbise-9-NBF-URDU-9.webp",
      "Pakistan Studies": "/book-covers/fbise-9-Class-9-Pakistan-Studies--Urdu-.jpg",
      Islamiat: "/book-covers/fbise-9-Islamiat-Lazmi-Class-9-NBF.webp",
    },
    10: {
      Physics: "/book-covers/fbise-10-10th-Class-Physics--NBF.jpg",
      Chemistry: "/book-covers/fbise-10-Chemistry-10-NBF.webp",
      Mathematics: "/book-covers/fbise-10---------------------.jpg",
      Biology: "/book-covers/fbise-10-Biology-10-NBF.webp",
      English: "/book-covers/fbise-10-class-10-english-book-pdf-federal-board.webp",
      "Computer Science": "/book-covers/fbise-10-NBF-COMPUTER-SCIENCE-10.jpg",
      Urdu: "/book-covers/fbise-10-NBF-URDU-10.webp",
      "Pakistan Studies": "/book-covers/fbise-10-Pakistan-Studies-Grade-10-NBF.webp",
      Islamiat: "/book-covers/fbise-10-Islamiat-10-NBF.webp",
    },
    11: {
      Physics: "/book-covers/fbise-11-Physics-Class-11-NBF.webp",
      Chemistry: "/book-covers/fbise-11-Textbook-of-Chemistry-Grade-11-Federal-board.webp",
      Mathematics: "/book-covers/fbise-11-Math-11-NBF.webp",
      Biology: "/book-covers/fbise-11-Biology-11-NATIONAL-BOOK-FOUNDATION--Federal-Board.webp",
      English: "/book-covers/fbise-11-English-11-NBF-FG.webp",
      "Computer Science": "/book-covers/fbise-11-Computer-Science-11-NBF.webp",
      Urdu: "/book-covers/fbise-11-NBF-URDU-11.webp",
      Islamiat: "/book-covers/fbise-11-Islamiat-11-NBF.webp",
    },
    12: {
      Physics: "/book-covers/fbise-12-Physics-National-Book-Foundation-12--Federal-board.webp",
      Chemistry: "/book-covers/fbise-12-TextBook-Chemistry-Grade-12th-Federal-board.webp",
      Mathematics: "/book-covers/fbise-12-Mathematics-Book-For-Class-12.webp",
      Biology: "/book-covers/fbise-12-Biology-Grade-12-Edition-2025.webp",
      English: "/book-covers/fbise-12-English-For-Grade-12-NBF-FG-Saleemi-Book-Depot-in-42354394857775.webp",
      "Computer Science": "/book-covers/fbise-12-Computer-Science-For-Grade-12-NBF-FG-Saleemi-Book-Depot-in-42627272999215.webp",
      Urdu: "/book-covers/fbise-12-NBF-URDU-12.webp",
      "Pakistan Studies": "/book-covers/fbise-12-NBF-Pak-Studies-12.png",
    },
  },
  "Punjab Board": {
    9: {
      Physics: "/book-covers/punjab-9-PTB-Physics-Class-9th-2025.webp",
      Chemistry: "/book-covers/punjab-9-PTB-Chemistry-Class-9th-2025.webp",
      Mathematics: "/book-covers/punjab-9-Class-9-Mathematics.webp",
      Biology: "/book-covers/punjab-9-Class-9-Biology-PCTB.webp",
      English: "/book-covers/punjab-9-PCTB-English-9th-Class-2025-800x.webp",
      "Computer Science": "/book-covers/punjab-9-PTB-Computer-Science-Entrepreneurship-Class-9th-2025.webp",
      Urdu: "/book-covers/punjab-9-PCTB-Urdu-9th-Class-2025.webp",
      Islamiat: "/book-covers/punjab-9-Class-9-Islamiat.webp",
      "General Science": "/book-covers/punjab-9-Class-9-General-Science.webp",
    },
    10: {
      Biology: "/book-covers/punjab-10-10-biology.jpg",
      Chemistry: "/book-covers/punjab-10-10th-Class-Chemistry.jpg",
    },
  },
  Oxford: {
    9: { Mathematics: "/book-covers/oxford-think--New-Syllabus-Mathematics-1-8th-edition.webp" },
    10: { Mathematics: "/book-covers/oxford-think--New-Syllabus-Mathematics-2-8th-edition.webp" },
    11: { Mathematics: "/book-covers/oxford-think--New-Syllabus-Mathematics-3-8th-edition.webp" },
    12: { Mathematics: "/book-covers/oxford-think--New-Syllabus-Mathematics-4-8th-edition.webp" },
  },
  APSACS: {
    8: { Islamiat: "/book-covers/apsacs-APSACS--Islamiat-Textbook-Class-8.webp" },
  },
};

const BOARD_SLUGS: Record<string, { slug: string; title: string; nameField: string }> = {
  FBISE: { slug: "fbise", title: "Federal Board (FBISE)", nameField: "National Book Foundation (NBF) - Federal Board" },
  "Punjab Board": { slug: "punjab", title: "Punjab Board", nameField: "Punjab Board" },
  Oxford: { slug: "oxford", title: "Oxford", nameField: "Oxford" },
  APSACS: { slug: "apsacs", title: "APSACS", nameField: "APSACS" },
};

const CLASS_TITLES: Record<number, string> = {
  5: "Class 5", 6: "Class 6", 7: "Class 7", 8: "Class 8",
  9: "Class 9", 10: "Class 10", 11: "Class 11", 12: "Class 12",
};

// Demo PDFs so every seeded book has a working Download/Read button.
// Replace with real textbook PDFs via POST /api/books/:id/pdf.
const SAMPLE_BOOK_PDFS = [
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

const SUBJECT_PDF_HINTS: { match: RegExp; file: string }[] = [
  { match: /math/i, file: "/demo-pdfs/textbook-math-9.pdf" },
  { match: /physics/i, file: "/demo-pdfs/textbook-physics-9.pdf" },
  { match: /chemistry/i, file: "/demo-pdfs/textbook-chemistry-9.pdf" },
  { match: /biolog/i, file: "/demo-pdfs/9th-biology-notes.pdf" },
  { match: /english/i, file: "/demo-pdfs/9th-english-notes.pdf" },
  { match: /urdu/i, file: "/demo-pdfs/9th-urdu-notes.pdf" },
];

function samplePdfFor(subject: string, index: number): string {
  const hint = SUBJECT_PDF_HINTS.find((h) => h.match.test(subject));
  return hint?.file ?? SAMPLE_BOOK_PDFS[index % SAMPLE_BOOK_PDFS.length];
}

export async function seedBookCovers() {
  // Ensure cover_url column exists on books table
  try {
    await db.execute(sql`ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "cover_url" text`);
  } catch {
    // Column may already exist
  }

  const existing = await db.select({ id: schema.books.id }).from(schema.books).limit(1);
  if (existing.length > 0) {
    console.log("[db] Books already seeded — skipping cover seed.");
    await backfillBookPdfs();
    return;
  }

  console.log("[db] Seeding books with real covers…");
  let count = 0;

  for (const [boardName, classes] of Object.entries(BOOK_COVERS)) {
    const board = BOARD_SLUGS[boardName];
    if (!board) continue;

    for (const [classNumStr, subjects] of Object.entries(classes)) {
      const classNum = Number(classNumStr);
      const classTitle = CLASS_TITLES[classNum];
      const classSlug = String(classNum);

      for (const [subject, coverPath] of Object.entries(subjects)) {
        const subjectSlug = subject.toLowerCase().replace(/\s+/g, "-");
        const title = `Class ${classNum} - ${subject} - ${board.nameField}`;

        await db.insert(schema.books).values({
          boardSlug: board.slug,
          boardTitle: board.title,
          classSlug,
          classTitle,
          subjectSlug,
          subjectTitle: subject,
          title,
          coverUrl: coverPath,
          pdfUrl: samplePdfFor(subject, count),
          notesPath: `/${board.slug}/${classSlug}/${subjectSlug}`,
        });
        count++;
      }
    }
  }

  console.log(`[db] Seeded ${count} books with real covers.`);
}

/** Books without a PDF get a demo PDF so Download/Read buttons always work. */
async function backfillBookPdfs() {
  const rows = await db
    .select({ id: schema.books.id, subjectTitle: schema.books.subjectTitle })
    .from(schema.books)
    .where(sql`pdf_url IS NULL`);
  if (rows.length === 0) return;

  let index = 0;
  for (const row of rows) {
    await db
      .update(schema.books)
      .set({ pdfUrl: samplePdfFor(row.subjectTitle ?? "", index) })
      .where(sql`id = ${row.id}`);
    index++;
  }
  console.log(`[db] Backfilled demo PDFs on ${rows.length} books.`);
}
