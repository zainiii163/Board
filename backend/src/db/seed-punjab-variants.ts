import { and, eq, sql } from "drizzle-orm";

import { db } from "./index.js";
import * as schema from "./schema.js";

/**
 * Lahore Board and D.G. Khan Board are Punjab Board examination authorities —
 * they share the Punjab scheme of studies and textbooks but issue their own
 * papers. They are registered here rather than in BOARD_DATA because
 * `seedBoardContent` only runs against an empty database, so editing BOARD_DATA
 * would never create the boards on an existing (production) database.
 *
 * Everything here is idempotent: it runs on every boot and skips whatever
 * already exists, so re-seeding is safe and it will not fight with the admin
 * CMS (class titles and subjects are only ever inserted, never updated).
 */

export const REGIONAL_PUNJAB_BOARDS: { slug: string; title: string }[] = [
  { slug: "lahore", title: "Lahore Board" },
  { slug: "d-g-khan", title: "D.G. Khan Board" },
];

/** Classes 5–12; 11 and 12 are shown as 1st/2nd Year in the UI. */
const REGIONAL_CLASS_TITLES: { slug: string; title: string }[] = [
  { slug: "5", title: "Class 5" },
  { slug: "6", title: "Class 6" },
  { slug: "7", title: "Class 7" },
  { slug: "8", title: "Class 8" },
  { slug: "9", title: "Class 9" },
  { slug: "10", title: "Class 10" },
  { slug: "11", title: "1st Year" },
  { slug: "12", title: "2nd Year" },
];

/**
 * Creates the board and its class shells if missing.
 *
 * Subjects and chapters are deliberately NOT created here —
 * `seedSubjectsAndMCQs` walks every board in the database on boot and fills in
 * the standard subject set, so doing it here too would race with it.
 */
export async function seedPunjabVariantBoards(): Promise<void> {
  for (const board of REGIONAL_PUNJAB_BOARDS) {
    const existing = await db.query.boards.findFirst({ where: eq(schema.boards.slug, board.slug) });
    let boardId = existing?.id;

    if (!existing) {
      console.log(`[db] Registering ${board.title} (${board.slug})…`);
      const [inserted] = await db.insert(schema.boards).values(board).returning();
      boardId = inserted.id;
    }

    if (!boardId) continue;

    for (const klass of REGIONAL_CLASS_TITLES) {
      // `classes` has no unique constraint, so the duplicate check is explicit.
      const present = await db.query.classes.findFirst({
        where: and(eq(schema.classes.boardId, boardId), eq(schema.classes.slug, klass.slug)),
      });
      if (present) continue;
      await db.insert(schema.classes).values({ boardId, slug: klass.slug, title: klass.title });
    }
  }
}

/**
 * Minimal past-paper rows so the Past Papers board selector is not empty for the
 * Punjab variant boards. Idempotent on the full tuple, because
 * `past_papers` has no unique constraint of its own.
 */
const REGIONAL_PAST_PAPERS: {
  boardSlug: string;
  boardTitle: string;
  subjectTitle: string;
  classSlug: string;
  classTitle: string;
  year: string;
  paperType: "model" | "first-annual" | "second-annual" | "pba";
  isSolved: boolean;
}[] = [
  { boardSlug: "lahore", boardTitle: "Lahore Board", subjectTitle: "Mathematics", classSlug: "9", classTitle: "Class 9", year: "2026", paperType: "model", isSolved: true },
  { boardSlug: "lahore", boardTitle: "Lahore Board", subjectTitle: "Physics", classSlug: "9", classTitle: "Class 9", year: "2026", paperType: "first-annual", isSolved: false },
  { boardSlug: "lahore", boardTitle: "Lahore Board", subjectTitle: "English", classSlug: "9", classTitle: "Class 9", year: "2025", paperType: "first-annual", isSolved: true },
  { boardSlug: "lahore", boardTitle: "Lahore Board", subjectTitle: "Computer Science", classSlug: "9", classTitle: "Class 9", year: "2026", paperType: "pba", isSolved: false },
  { boardSlug: "d-g-khan", boardTitle: "D.G. Khan Board", subjectTitle: "Mathematics", classSlug: "9", classTitle: "Class 9", year: "2026", paperType: "model", isSolved: false },
  { boardSlug: "d-g-khan", boardTitle: "D.G. Khan Board", subjectTitle: "Physics", classSlug: "9", classTitle: "Class 9", year: "2026", paperType: "first-annual", isSolved: true },
  { boardSlug: "d-g-khan", boardTitle: "D.G. Khan Board", subjectTitle: "Biology", classSlug: "9", classTitle: "Class 9", year: "2025", paperType: "first-annual", isSolved: false },
];

function subjectSlugFor(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function seedPunjabVariantPastPapers(): Promise<void> {
  for (const paper of REGIONAL_PAST_PAPERS) {
    const duplicate = await db
      .select({ id: schema.pastPapers.id })
      .from(schema.pastPapers)
      .where(
        sql`${schema.pastPapers.boardSlug} = ${paper.boardSlug}
         AND ${schema.pastPapers.subjectTitle} = ${paper.subjectTitle}
         AND ${schema.pastPapers.classSlug} = ${paper.classSlug}
         AND ${schema.pastPapers.year} = ${paper.year}
         AND ${schema.pastPapers.paperType} = ${paper.paperType}`,
      )
      .limit(1);
    if (duplicate.length > 0) continue;

    await db.insert(schema.pastPapers).values({
      boardSlug: paper.boardSlug,
      boardTitle: paper.boardTitle,
      classSlug: paper.classSlug,
      classTitle: paper.classTitle,
      subjectSlug: subjectSlugFor(paper.subjectTitle),
      subjectTitle: paper.subjectTitle,
      year: paper.year,
      sessionType: paper.paperType === "second-annual" ? "supply" : "annual",
      paperType: paper.paperType,
      isSolved: paper.isSolved,
      syllabus: "new",
      pdfUrl: null,
      driveUrl: null,
    });
  }
}