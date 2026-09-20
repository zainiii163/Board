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
      "Pakistan Studies": "/book-covers/fbise-5-5th-class-social-studies.jpg",
      Islamiat: "/book-covers/fbise-5-class-5-islamiat-federal-board.webp",
    },
    6: {
      Mathematics: "/book-covers/fbise-6-math-6-nbf.webp",
      "Computer Science": "/book-covers/fbise-6-class-6-computer-science-book.webp",
      Arabic: "/book-covers/fbise-6-arabic-book-6th-class.jpg",
    },
    7: {
      Mathematics: "/book-covers/fbise-7-general-science-7-nbf.webp",
      English: "/book-covers/fbise-7-english-7-nbf.webp",
      "Computer Science": "/book-covers/fbise-7-computer-science-7.jpg",
      Urdu: "/book-covers/fbise-7-urdu-7-nbf.webp",
      Islamiat: "/book-covers/fbise-7-class-7-islamiat-federal-board.jpg",
      "General Science": "/book-covers/fbise-7-general-science-7-nbf.webp",
      Geography: "/book-covers/fbise-7-geography-7-nbf.webp",
      History: "/book-covers/fbise-7-class-7-history-federal-board.jpg",
    },
    8: {
      Mathematics: "/book-covers/fbise-8-math-8-nbf.webp",
      English: "/book-covers/fbise-8-english-8-nbf-fg-saleemi-book-depot-in-39471868674351.webp",
      "Computer Science": "/book-covers/fbise-8-computer-8-nbf.webp",
      Urdu: "/book-covers/fbise-8-urdu-8-nbf.jpg",
      Islamiat: "/book-covers/fbise-8-islamiyat-class-8.webp",
      "General Science": "/book-covers/fbise-8-general-science-8.jpg",
      Geography: "/book-covers/fbise-8-geography-8-nbf.webp",
      History: "/book-covers/fbise-8-nbf-history-8.jpg",
    },
    9: {
      Physics: "/book-covers/fbise-9-class-9-physics-nbf.jpg",
      Chemistry: "/book-covers/fbise-9-chemistry-9-with-experimentation-skills-nbf.webp",
      Mathematics: "/book-covers/fbise-9-9th-class-mathematics-nbf.jpg",
      Biology: "/book-covers/fbise-9-9th-class-biology-nbf.jpg",
      English: "/book-covers/fbise-9-english-9-nbf.webp",
      "Computer Science": "/book-covers/fbise-9-hamdardchemistryguide9.webp",
      Urdu: "/book-covers/fbise-9-nbf-urdu-9.webp",
      "Pakistan Studies": "/book-covers/fbise-9-class-9-pakistan-studies-urdu-.jpg",
      Islamiat: "/book-covers/fbise-9-islamiat-lazmi-class-9-nbf.webp",
    },
    10: {
      Physics: "/book-covers/fbise-10-10th-class-physics-nbf.jpg",
      Chemistry: "/book-covers/fbise-10-chemistry-10-nbf.webp",
      Mathematics: "/book-covers/fbise-10---------------------.jpg",
      Biology: "/book-covers/fbise-10-biology-10-nbf.webp",
      English: "/book-covers/fbise-10-class-10-english-book-pdf-federal-board.webp",
      "Computer Science": "/book-covers/fbise-10-nbf-computer-science-10.jpg",
      Urdu: "/book-covers/fbise-10-nbf-urdu-10.webp",
      "Pakistan Studies": "/book-covers/fbise-10-pakistan-studies-grade-10-nbf.webp",
      Islamiat: "/book-covers/fbise-10-islamiat-10-nbf.webp",
    },
    11: {
      Physics: "/book-covers/fbise-11-physics-class-11-nbf.webp",
      Chemistry: "/book-covers/fbise-11-textbook-of-chemistry-grade-11-federal-board.webp",
      Mathematics: "/book-covers/fbise-11-math-11-nbf.webp",
      Biology: "/book-covers/fbise-11-biology-11-national-book-foundation--federal-board.webp",
      English: "/book-covers/fbise-11-english-11-nbf-fg.webp",
      "Computer Science": "/book-covers/fbise-11-computer-science-11-nbf.webp",
      Urdu: "/book-covers/fbise-11-nbf-urdu-11.webp",
      Islamiat: "/book-covers/fbise-11-islamiat-11-nbf.webp",
    },
    12: {
      Physics: "/book-covers/fbise-12-physics-national-book-foundation-12--federal-board.webp",
      Chemistry: "/book-covers/fbise-12-textbook-chemistry-grade-12th-federal-board.webp",
      Mathematics: "/book-covers/fbise-12-mathematics-book-for-class-12.webp",
      Biology: "/book-covers/fbise-12-biology-grade-12-edition-2025.webp",
      English: "/book-covers/fbise-12-english-for-grade-12-nbf-fg-saleemi-book-depot-in-42354394857775.webp",
      "Computer Science": "/book-covers/fbise-12-computer-science-for-grade-12-nbf-fg-saleemi-book-depot-i.webp",
      Urdu: "/book-covers/fbise-12-nbf-urdu-12.webp",
      "Pakistan Studies": "/book-covers/fbise-12-nbf-pak-studies-12.png",
    },
  },
  "Punjab Board": {
    9: {
      Physics: "/book-covers/punjab-9-ptb-physics-class-9th-2025.webp",
      Chemistry: "/book-covers/punjab-9-ptb-chemistry-class-9th-2025.webp",
      Mathematics: "/book-covers/punjab-9-class-9-mathematics.webp",
      Biology: "/book-covers/punjab-9-class-9-biology-pctb.webp",
      English: "/book-covers/punjab-9-pctb-english-9th-class-2025_800x.webp",
      "Computer Science": "/book-covers/punjab-9-ptb-computer-science-entrepreneurship-class-9th-2025.webp",
      Urdu: "/book-covers/punjab-9-pctb-urdu-9th-class-2025.webp",
      Islamiat: "/book-covers/punjab-9-class-9-islamiat.webp",
      "General Science": "/book-covers/punjab-9-class-9-general-science.webp",
    },
    10: {
      Biology: "/book-covers/punjab-10-10-biology.jpg",
      Chemistry: "/book-covers/punjab-10-10th-class-chemistry.jpg",
    },
  },
  Oxford: {
    9: { Mathematics: "/book-covers/oxford-think--New-Syllabus-Mathematics-1-8th-edition.webp" },
    10: { Mathematics: "/book-covers/oxford-think--New-Syllabus-Mathematics-2-8th-edition.webp" },
    11: { Mathematics: "/book-covers/oxford-think--New-Syllabus-Mathematics-3-8th-edition.webp" },
    12: { Mathematics: "/book-covers/oxford-think--New-Syllabus-Mathematics-4-8th-edition.webp" },
  },
  APSACS: {
    8: { Islamiat: "/book-covers/apsacs-apsacs--islamiat-textbook-class-8.webp" },
  },
};

const BOARD_SLUGS: Record<string, { slug: string; title: string }> = {
  FBISE: { slug: "fbise", title: "Federal Board (FBISE)" },
  "Punjab Board": { slug: "punjab", title: "Punjab Board" },
  Oxford: { slug: "oxford", title: "Oxford" },
  APSACS: { slug: "apsacs", title: "APSACS" },
};

const CLASS_TITLES: Record<number, string> = {
  5: "Class 5", 6: "Class 6", 7: "Class 7", 8: "Class 8",
  9: "Class 9", 10: "Class 10", 11: "Class 11", 12: "Class 12",
};

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
        const title = `${classTitle} ${subject} Textbook (${boardName})`;

        await db.insert(schema.books).values({
          boardSlug: board.slug,
          boardTitle: board.title,
          classSlug,
          classTitle,
          subjectSlug,
          subjectTitle: subject,
          title,
          coverUrl: coverPath,
        });
        count++;
      }
    }
  }

  console.log(`[db] Seeded ${count} books with real covers.`);
}
