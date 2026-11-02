import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { and, eq } from "drizzle-orm";

import { db } from "./index.js";
import * as schema from "./schema.js";

type PaperSource = {
  classSlug: "9" | "10" | "11" | "12";
  subjectTitle: string;
  year: string;
  paperType: "model" | "paper-pattern" | "first-annual" | "second-annual" | "pba";
  syllabus: "new" | "old";
};

const CLASS_SOURCE_URL: Record<PaperSource["classSlug"], string> = {
  "9": "https://fbisepastpapers.com/class-9-fbise-past-papers/",
  "10": "https://fbisepastpapers.com/class-10-fbise-past-papers/",
  "11": "https://fbisepastpapers.com/class-11-fbise-past-papers/",
  "12": "https://fbisepastpapers.com/class-12-fbise-past-papers/",
};

type DeepLinkRow = {
  classSlug: string;
  subjectTitle: string;
  year: string;
  paperType: string;
  syllabus: string;
  driveUrl: string;
};

/** Scraped per-paper pages from the FBISE archive (not hosted BoardNotes PDFs). */
const DEEP_LINKS: DeepLinkRow[] = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "fbise-paper-deep-links.json"), "utf8"),
) as DeepLinkRow[];

const DEEP_LINK_BY_KEY = new Map(
  DEEP_LINKS.map((row) => [
    [row.classSlug, row.subjectTitle, row.year, row.paperType, row.syllabus].join("|"),
    row.driveUrl,
  ]),
);

function resolveDriveUrl(paper: PaperSource): string {
  const key = [paper.classSlug, paper.subjectTitle, paper.year, paper.paperType, paper.syllabus].join("|");
  return DEEP_LINK_BY_KEY.get(key) ?? CLASS_SOURCE_URL[paper.classSlug];
}

// These lists reflect the handwritten client annotations, not the broader
// source-site archive. Exclusions are class-specific: Pakistan Studies is not
// shown for Class 9, while Islamiat is not shown for Class 10.
/** Exported for regression tests — Class 9 excludes Pakistan Studies. */
export const CLASS_9_SUBJECTS = ["Biology", "Chemistry", "Computer Science", "English", "Islamiat", "Mathematics", "Physics", "Tarjuma-tul-Quran", "Urdu"];
/** Exported for regression tests — Class 10 excludes Islamiat. */
export const CLASS_10_SUBJECTS = ["Biology", "Chemistry", "Computer Science", "English", "Mathematics", "Pakistan Studies", "Physics", "Urdu"];
/**
 * Class 11–12 subjects from the same FBISE archive IA as Class 9/10
 * (fbisepastpapers.com class pages referenced by client 111.pdf). New syllabus
 * only — no invented pdfUrl.
 */
export const CLASS_11_SUBJECTS = ["Biology", "Chemistry", "Computer Science", "English", "Islamiat", "Mathematics", "Physics", "Urdu"];
export const CLASS_12_SUBJECTS = ["Biology", "Chemistry", "Computer Science", "English", "Mathematics", "Pakistan Studies", "Physics", "Urdu"];
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
  // Class 11 new syllabus sessions from class-11 archive page.
  ...CLASS_11_SUBJECTS.flatMap((subjectTitle) => [
    { classSlug: "11" as const, subjectTitle, year: "2026", paperType: "first-annual" as const, syllabus: "new" as const },
    { classSlug: "11" as const, subjectTitle, year: "2025", paperType: "second-annual" as const, syllabus: "new" as const },
    { classSlug: "11" as const, subjectTitle, year: "2025", paperType: "first-annual" as const, syllabus: "new" as const },
  ]),
  // Class 12 annual sessions from class-12 archive page (no 2nd-annual listed).
  ...CLASS_12_SUBJECTS.flatMap((subjectTitle) => [
    { classSlug: "12" as const, subjectTitle, year: "2026", paperType: "first-annual" as const, syllabus: "new" as const },
    { classSlug: "12" as const, subjectTitle, year: "2025", paperType: "first-annual" as const, syllabus: "new" as const },
    { classSlug: "12" as const, subjectTitle, year: "2024", paperType: "first-annual" as const, syllabus: "new" as const },
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

    const sourceUrl = resolveDriveUrl(paper);
    if (existing) {
      // Prefer per-paper deep links over class-archive URLs; never invent pdfUrl.
      const shouldUpgrade =
        !existing.driveUrl ||
        (existing.driveUrl === CLASS_SOURCE_URL[paper.classSlug] && sourceUrl !== existing.driveUrl);
      if (shouldUpgrade) {
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

/** Inventory size for regression tests (9+10 annotated + 11+12 archive IA). */
export const FBISE_SOURCE_ROW_COUNT = SOURCE_ROWS.length;

export type FbiseSourceCatalogRow = {
  boardSlug: "fbise";
  boardTitle: "Federal Board (FBISE)";
  classSlug: "9" | "10" | "11" | "12";
  classTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  year: string;
  sessionType: "annual" | "supply";
  paperType: PaperSource["paperType"];
  isSolved: false;
  syllabus: "new" | "old";
  pdfUrl: null;
  driveUrl: string;
};

/** In-memory FBISE archive rows for API responses when DB seed has not run. */
export function buildFbiseSourceCatalog(): FbiseSourceCatalogRow[] {
  return SOURCE_ROWS.map((paper) => ({
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
    driveUrl: resolveDriveUrl(paper),
  }));
}

/** Count of catalog rows that resolve to a per-paper page (not class archive). */
export function countFbiseDeepLinkedRows(): number {
  return buildFbiseSourceCatalog().filter(
    (row) => row.driveUrl !== CLASS_SOURCE_URL[row.classSlug],
  ).length;
}

export function pastPaperSourceKey(paper: {
  boardSlug: string;
  classSlug: string;
  subjectSlug: string;
  year: string;
  paperType: string;
  syllabus: string;
}) {
  return [
    paper.boardSlug,
    paper.classSlug,
    paper.subjectSlug,
    paper.year,
    paper.paperType,
    paper.syllabus,
  ].join("|");
}
