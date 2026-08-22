import { eq } from "drizzle-orm";

import { cmsStore, type CmsMcq } from "../../store/cms-store.js";
import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { ApiError } from "../../utils/api-error.js";

function chapterKey(board: string, classSlug: string, subject: string, chapter: string) {
  return `${board}/${classSlug}/${subject}/${chapter}`;
}

function mapMcqRow(row: typeof schema.mcqs.$inferSelect): CmsMcq {
  return {
    id: row.id,
    chapterKey: row.chapterKey,
    question: row.question,
    options: row.options,
    correctLabel: row.correctLabel,
    reason: row.reason,
  };
}

export async function listMcqs(
  board?: string,
  classSlug?: string,
  subject?: string,
  chapter?: string,
): Promise<CmsMcq[]> {
  if (useDb()) {
    if (board && classSlug && subject && chapter) {
      const key = chapterKey(board, classSlug, subject, chapter);
      const rows = await db.query.mcqs.findMany({ where: eq(schema.mcqs.chapterKey, key) });
      return rows.map(mapMcqRow);
    }
    const rows = await db.query.mcqs.findMany();
    return rows.map(mapMcqRow);
  }
  if (board && classSlug && subject && chapter) {
    return cmsStore.getMcqsForChapter(board, classSlug, subject, chapter);
  }
  return cmsStore.listMcqs();
}

export async function getMcq(id: number): Promise<CmsMcq> {
  if (useDb()) {
    const row = await db.query.mcqs.findFirst({ where: eq(schema.mcqs.id, id) });
    if (!row) throw ApiError.notFound("MCQ not found.");
    return mapMcqRow(row);
  }
  const mcq = cmsStore.getMcq(id);
  if (!mcq) throw ApiError.notFound("MCQ not found.");
  return mcq;
}

export async function createMcq(input: {
  boardSlug: string;
  classSlug: string;
  subjectSlug: string;
  chapterSlug: string;
  question: string;
  options: { label: string; text: string }[];
  correctLabel: string;
  reason: string;
}): Promise<CmsMcq> {
  const { boardSlug, classSlug, subjectSlug, chapterSlug, ...rest } = input;
  if (!rest.question.trim()) throw ApiError.badRequest("Question is required.");
  if (!rest.options?.length) throw ApiError.badRequest("At least one option is required.");
  if (!rest.correctLabel.trim()) throw ApiError.badRequest("Correct answer label is required.");

  const key = chapterKey(boardSlug, classSlug, subjectSlug, chapterSlug);
  if (useDb()) {
    const [row] = await db
      .insert(schema.mcqs)
      .values({
        chapterKey: key,
        question: rest.question.trim(),
        options: rest.options,
        correctLabel: rest.correctLabel.trim(),
        reason: rest.reason.trim(),
      })
      .returning();
    return mapMcqRow(row);
  }
  return cmsStore.createMcq({ chapterKey: key, ...rest });
}

export async function updateMcq(
  id: number,
  input: Partial<{
    question: string;
    options: { label: string; text: string }[];
    correctLabel: string;
    reason: string;
  }>,
): Promise<CmsMcq> {
  if (useDb()) {
    const [row] = await db
      .update(schema.mcqs)
      .set(input)
      .where(eq(schema.mcqs.id, id))
      .returning();
    if (!row) throw ApiError.notFound("MCQ not found.");
    return mapMcqRow(row);
  }
  const updated = cmsStore.updateMcq(id, input);
  if (!updated) throw ApiError.notFound("MCQ not found.");
  return updated;
}

export async function deleteMcq(id: number) {
  if (useDb()) {
    const result = await db.delete(schema.mcqs).where(eq(schema.mcqs.id, id)).returning();
    if (result.length === 0) throw ApiError.notFound("MCQ not found.");
    return { deleted: true };
  }
  if (!cmsStore.deleteMcq(id)) throw ApiError.notFound("MCQ not found.");
  return { deleted: true };
}
