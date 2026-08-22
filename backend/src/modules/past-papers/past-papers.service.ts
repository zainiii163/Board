import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { resourcesStore, type PastPaperRecord } from "../../store/resources-store.js";
import { ApiError } from "../../utils/api-error.js";

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
    pdfUrl: row.pdfUrl,
  };
}

export async function listPastPapers(boardSlug?: string, year?: string): Promise<PastPaperRecord[]> {
  if (useDb()) {
    const rows = await db.select().from(schema.pastPapers);
    let mapped = rows.map(mapPastPaperRow);
    if (boardSlug) mapped = mapped.filter((p) => p.boardSlug === boardSlug);
    if (year) mapped = mapped.filter((p) => p.year === year);
    return mapped;
  }
  return resourcesStore.listPastPapers(boardSlug, year);
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
        sessionType: input.sessionType,
        pdfUrl: input.pdfUrl,
      })
      .returning();
    return mapPastPaperRow(row);
  }
  return resourcesStore.createPastPaper(input);
}

export async function updatePastPaper(
  id: number,
  input: Partial<Omit<PastPaperRecord, "id">>,
): Promise<PastPaperRecord> {
  if (useDb()) {
    const [row] = await db
      .update(schema.pastPapers)
      .set(input)
      .where(eq(schema.pastPapers.id, id))
      .returning();
    if (!row) throw ApiError.notFound("Past paper not found.");
    return mapPastPaperRow(row);
  }
  const updated = resourcesStore.updatePastPaper(id, input);
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
