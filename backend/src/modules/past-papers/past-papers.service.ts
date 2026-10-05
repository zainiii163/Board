import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import {
  resourcesStore,
  sortPastPapers,
  type PastPaperRecord,
  type PastPaperType,
} from "../../store/resources-store.js";
import { ApiError } from "../../utils/api-error.js";

const PAPER_TYPES: PastPaperType[] = ["model", "first-annual", "second-annual", "pba"];

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
  if (useDb()) {
    const rows = await db.select().from(schema.pastPapers);
    let mapped = rows.map(mapPastPaperRow);
    if (boardSlug) mapped = mapped.filter((p) => p.boardSlug === boardSlug);
    if (year) mapped = mapped.filter((p) => p.year === year);
    if (paperType) mapped = mapped.filter((p) => p.paperType === paperType);
    if (classSlug) mapped = mapped.filter((p) => p.classSlug === classSlug);
    if (syllabus === "new" || syllabus === "old") mapped = mapped.filter((p) => p.syllabus === syllabus);
    if (solved === "solved") mapped = mapped.filter((p) => p.isSolved);
    if (solved === "unsolved") mapped = mapped.filter((p) => !p.isSolved);
    return sortPastPapers(mapped);
  }
  return resourcesStore.listPastPapers(boardSlug, year, paperType, classSlug, syllabus, solved);
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
