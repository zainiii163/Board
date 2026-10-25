import { and, eq } from "drizzle-orm";

import { db } from "./index.js";
import * as schema from "./schema.js";

type PaperSource = {
  classSlug: "9" | "10";
  subjectTitle: string;
  year: string;
  paperType: "model" | "paper-pattern" | "first-annual" | "second-annual" | "pba";
  syllabus: "new" | "old";
};

const CLASS_SOURCE_URL: Record<PaperSource["classSlug"], string> = {
  "9": "https://fbisepastpapers.com/class-9-fbise-past-papers/",
  "10": "https://fbisepastpapers.com/class-10-fbise-past-papers/",
};

// These lists reflect the handwritten client annotations, not the broader
// source-site archive. Exclusions are class-specific: Pakistan Studies is not
// shown for Class 9, while Islamiat is not shown for Class 10.
/** Exported for regression tests — Class 9 excludes Pakistan Studies. */
export const CLASS_9_SUBJECTS = ["Biology", "Chemistry", "Computer Science", "English", "Islamiat", "Mathematics", "Physics", "Tarjuma-tul-Quran", "Urdu"];
/** Exported for regression tests — Class 10 excludes Islamiat. */
export const CLASS_10_SUBJECTS = ["Biology", "Chemistry", "Computer Science", "English", "Mathematics", "Pakistan Studies", "Physics", "Urdu"];
export const CLASS_SOURCE_URLS = CLASS_SOURCE_URL;

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const SOURCE_ROWS: PaperSource[] = [
  ...CLASS_9_SUBJECTS.flatMap((subjectTitle) => [
    { classSlug: "9" as const, subjectTitle, year: "2027", paperType: "paper-pattern" as const, syllabus: "new" as const },
    { classSlug: "9" as const, subjectTitle, year: "2027", paperType: "model" as const, syllabus: "new" as const },
    { classSlug: "9" as const, subjectTitle, year: "2026", paperType: "second-annual" as const, syllabus: "new" as const },
    { classSlug: "9" as const, subjectTitle, year: "2026", paperType: "first-annual" as const, syllabus: "new" as const },
    { classSlug: "9" as const, subjectTitle, year: "2025", paperType: "second-annual" as const, syllabus: "new" as const },
    { classSlug: "9" as const, subjectTitle, year: "2025", paperType: "first-annual" as const, syllabus: "new" as const },
    { classSlug: "9" as const, subjectTitle, year: "2024", paperType: "model" as const, syllabus: "new" as const },
  ]),
  ...CLASS_10_SUBJECTS.flatMap((subjectTitle) => [
    { classSlug: "10" as const, subjectTitle, year: "2026", paperType: "second-annual" as const, syllabus: "new" as const },
    { classSlug: "10" as const, subjectTitle, year: "2026", paperType: "first-annual" as const, syllabus: "new" as const },
    { classSlug: "10" as const, subjectTitle, year: "2025", paperType: "model" as const, syllabus: "new" as const },
    ...(subjectTitle === "Chemistry" ? [{ classSlug: "10" as const, subjectTitle, year: "2026", paperType: "pba" as const, syllabus: "new" as const }] : []),
  ]),
];

/**
 * Register the supplied FBISE archive as an external source. The source owns
 * the files, so rows deliberately link to its class archive instead of claiming
 * an external PDF is hosted by BoardNotes.
 */
export async function seedFbisePastPaperSources() {
  for (const paper of SOURCE_ROWS) {
    const existing = await db.query.pastPapers.findFirst({
      where: and(
        eq(schema.pastPapers.boardSlug, "fbise"),
        eq(schema.pastPapers.classSlug, paper.classSlug),
        eq(schema.pastPapers.subjectSlug, slugify(paper.subjectTitle)),
        eq(schema.pastPapers.year, paper.year),
        eq(schema.pastPapers.paperType, paper.paperType),
        eq(schema.pastPapers.syllabus, paper.syllabus),
      ),
    });

    const sourceUrl = CLASS_SOURCE_URL[paper.classSlug];
    if (existing) {
      if (!existing.driveUrl) {
        await db.update(schema.pastPapers).set({ driveUrl: sourceUrl }).where(eq(schema.pastPapers.id, existing.id));
      }
      continue;
    }

    await db.insert(schema.pastPapers).values({
      boardSlug: "fbise",
      boardTitle: "Federal Board (FBISE)",
      classSlug: paper.classSlug,
      classTitle: `Class ${paper.classSlug}`,
      subjectSlug: slugify(paper.subjectTitle),
      subjectTitle: paper.subjectTitle,
      year: paper.year,
      sessionType: paper.paperType === "second-annual" ? "supply" : "annual",
      paperType: paper.paperType,
      isSolved: false,
      syllabus: paper.syllabus,
      pdfUrl: null,
      driveUrl: sourceUrl,
    });
  }
}

/** Inventory size for regression tests (Class 9×7 + Class 10×3 + Chemistry PBA). */
export const FBISE_SOURCE_ROW_COUNT = SOURCE_ROWS.length;
