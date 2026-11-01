import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import {
  buildFbiseSourceCatalog,
  CLASS_9_SUBJECTS,
  CLASS_10_SUBJECTS,
  pastPaperSourceKey,
} from "../../db/seed-fbise-past-paper-sources.js";
import {
  resourcesStore,
  sortPastPapers,
  type PastPaperRecord,
  type PastPaperType,
} from "../../store/resources-store.js";
import { ApiError } from "../../utils/api-error.js";

const CLASS_9_ALLOWED = new Set(CLASS_9_SUBJECTS.map((title) => title.toLowerCase()));
const CLASS_10_ALLOWED = new Set(CLASS_10_SUBJECTS.map((title) => title.toLowerCase()));

/** Prefer DB/CMS rows; fill any missing FBISE annotated sessions from the source catalog. */
function withFbiseSourceInventory(rows: PastPaperRecord[]): PastPaperRecord[] {
  const byKey = new Map(rows.map((paper) => [pastPaperSourceKey(paper), paper]));
  let syntheticId = -1;
  for (const source of buildFbiseSourceCatalog()) {
    const key = pastPaperSourceKey(source);
    if (byKey.has(key)) continue;
    byKey.set(key, { id: syntheticId--, ...source });
  }
  return sortPastPapers([...byKey.values()]);
}

/**
 * Client 113/125.pdf: keep archival DB rows, but hide crossed-out subjects and
 * old-syllabus entries from the public FBISE Class 9/10 experience unless an
 * explicit syllabus filter requests them.
 */
function applyFbiseClientPolicy(rows: PastPaperRecord[], syllabus?: string): PastPaperRecord[] {
  return rows.filter((paper) => {
    if (paper.boardSlug !== "fbise") return true;
    if (paper.classSlug === "9") {
      if (!CLASS_9_ALLOWED.has(paper.subjectTitle.toLowerCase())) return false;
    }
    if (paper.classSlug === "10") {
      if (!CLASS_10_ALLOWED.has(paper.subjectTitle.toLowerCase())) return false;
    }
    if (syllabus !== "old" && syllabus !== "all" && paper.syllabus === "old") {
      if (paper.classSlug === "9" || paper.classSlug === "10") return false;
    }
    return true;
  });
}

const PAPER_TYPES: PastPaperType[] = ["model", "paper-pattern", "first-annual", "second-annual", "pba"];

function normalizePaperType(value: unknown): PastPaperType {
  return PAPER_TYPES.includes(value as PastPaperType) ? (value as PastPaperType) : "first-annual";
}

function normalizeSyllabus(value: unknown): "new" | "old" {
  return value === "old" ? "old" : "new";
}

function normalizeSolved(value: unknown): boolean {
  return value === true || value === "true" || value === "solved" || value === 1;
}

function mapPastPaperRow(row: typeof schema.pastPapers.$inferSelect): PastPaperRecord {
  return {
    id: row.id,
    boardSlug: row.boardSlug,
    boardTitle: row.boardTitle,
    classSlug: row.classSlug,
    classTitle: row.classTitle,
    subjectSlug: row.subjectSlug,
    subjectTitle: row.subjectTitle,
    year: row.year,
    sessionType: row.sessionType,
    paperType: row.paperType ?? "first-annual",
    isSolved: row.isSolved ?? false,
    syllabus: row.syllabus ?? "new",
    pdfUrl: row.pdfUrl,
    driveUrl: row.driveUrl ?? null,
  };
}

export async function listPastPapers(
  boardSlug?: string,
  year?: string,
  paperType?: string,
  classSlug?: string,
  syllabus?: string,
  solved?: string,
): Promise<PastPaperRecord[]> {
  let mapped: PastPaperRecord[];
  if (useDb()) {
    const rows = await db.select().from(schema.pastPapers);
    mapped = withFbiseSourceInventory(rows.map(mapPastPaperRow));
  } else {
    mapped = withFbiseSourceInventory(
      resourcesStore.listPastPapers(undefined, undefined, undefined, undefined, undefined, undefined),
    );
  }

  if (boardSlug) mapped = mapped.filter((p) => p.boardSlug === boardSlug);
  if (year) mapped = mapped.filter((p) => p.year === year);
  if (paperType) mapped = mapped.filter((p) => p.paperType === paperType);
  if (classSlug) mapped = mapped.filter((p) => p.classSlug === classSlug);
  if (syllabus === "new" || syllabus === "old") mapped = mapped.filter((p) => p.syllabus === syllabus);
  if (solved === "solved") mapped = mapped.filter((p) => p.isSolved);
  if (solved === "unsolved") mapped = mapped.filter((p) => !p.isSolved);
  mapped = applyFbiseClientPolicy(mapped, syllabus);
  return sortPastPapers(mapped);
}

export async function getPastPaper(id: number): Promise<PastPaperRecord> {
  if (useDb()) {
    const [row] = await db.select().from(schema.pastPapers).where(eq(schema.pastPapers.id, id)).limit(1);
    if (!row) throw ApiError.notFound("Past paper not found.");
    return mapPastPaperRow(row);
  }
  const paper = resourcesStore.getPastPaper(id);
  if (!paper) throw ApiError.notFound("Past paper not found.");
  return paper;
}

export async function createPastPaper(input: Omit<PastPaperRecord, "id">): Promise<PastPaperRecord> {
  if (!input.subjectSlug.trim() || !input.subjectTitle.trim()) {
    throw ApiError.badRequest("Subject is required.");
  }
  if (!input.year.trim()) throw ApiError.badRequest("Year is required.");

  if (useDb()) {
    const [row] = await db
      .insert(schema.pastPapers)
      .values({
        boardSlug: input.boardSlug,
        boardTitle: input.boardTitle,
        classSlug: input.classSlug,
        classTitle: input.classTitle,
        subjectSlug: input.subjectSlug,
        subjectTitle: input.subjectTitle,
        year: input.year,
        sessionType: input.sessionType ?? "annual",
        paperType: normalizePaperType(input.paperType),
        isSolved: normalizeSolved(input.isSolved),
        syllabus: normalizeSyllabus(input.syllabus),
        pdfUrl: input.pdfUrl,
        driveUrl: input.driveUrl ?? null,
      })
      .returning();
    return mapPastPaperRow(row);
  }
  return resourcesStore.createPastPaper({
    ...input,
    paperType: normalizePaperType(input.paperType),
    isSolved: normalizeSolved(input.isSolved),
    syllabus: normalizeSyllabus(input.syllabus),
  });
}

export async function updatePastPaper(
  id: number,
  input: Partial<Omit<PastPaperRecord, "id">>,
): Promise<PastPaperRecord> {
  if (useDb()) {
    const patch: Partial<Omit<PastPaperRecord, "id">> = { ...input };
    if ("paperType" in patch) patch.paperType = normalizePaperType(patch.paperType);
    if ("syllabus" in patch) patch.syllabus = normalizeSyllabus(patch.syllabus);
    if ("isSolved" in patch) patch.isSolved = normalizeSolved(patch.isSolved);
    if ("driveUrl" in patch) patch.driveUrl = patch.driveUrl ?? null;
    const [row] = await db
      .update(schema.pastPapers)
      .set(patch)
      .where(eq(schema.pastPapers.id, id))
      .returning();
    if (!row) throw ApiError.notFound("Past paper not found.");
    return mapPastPaperRow(row);
  }
  const patch: Partial<Omit<PastPaperRecord, "id">> = { ...input };
  if ("paperType" in patch) patch.paperType = normalizePaperType(patch.paperType);
  if ("syllabus" in patch) patch.syllabus = normalizeSyllabus(patch.syllabus);
  if ("isSolved" in patch) patch.isSolved = normalizeSolved(patch.isSolved);
  if ("driveUrl" in patch) patch.driveUrl = patch.driveUrl ?? null;
  const updated = resourcesStore.updatePastPaper(id, patch);
  if (!updated) throw ApiError.notFound("Past paper not found.");
  return updated;
}

export async function deletePastPaper(id: number) {
  if (useDb()) {
    const deleted = await db.delete(schema.pastPapers).where(eq(schema.pastPapers.id, id)).returning();
    if (deleted.length === 0) throw ApiError.notFound("Past paper not found.");
    return { deleted: true };
  }
  if (!resourcesStore.deletePastPaper(id)) throw ApiError.notFound("Past paper not found.");
  return { deleted: true };
}
