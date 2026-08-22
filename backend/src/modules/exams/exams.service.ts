import { eq, gt, asc } from "drizzle-orm";

import { examsStore, type ExamRecord } from "../../store/exams-store.js";
import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { ApiError } from "../../utils/api-error.js";

function mapExamRow(row: typeof schema.examDates.$inferSelect): ExamRecord {
  return {
    id: row.id,
    boardSlug: row.boardSlug,
    boardTitle: row.boardTitle,
    classSlug: row.classSlug,
    classTitle: row.classTitle,
    title: row.title,
    examDate: row.examDate.toISOString(),
  };
}

export async function listExams() {
  if (useDb()) {
    const rows = await db.query.examDates.findMany({
      orderBy: [asc(schema.examDates.examDate)],
    });
    return rows.map(mapExamRow);
  }
  return examsStore.list();
}

export async function listUpcomingExams() {
  if (useDb()) {
    const rows = await db.query.examDates.findMany({
      where: gt(schema.examDates.examDate, new Date()),
      orderBy: [asc(schema.examDates.examDate)],
    });
    return rows.map(mapExamRow);
  }
  return examsStore.upcoming();
}

export async function getExamById(id: number): Promise<ExamRecord> {
  if (useDb()) {
    const row = await db.query.examDates.findFirst({ where: eq(schema.examDates.id, id) });
    if (!row) throw ApiError.notFound("Exam date not found.");
    return mapExamRow(row);
  }
  const exam = examsStore.getById(id);
  if (!exam) throw ApiError.notFound("Exam date not found.");
  return exam;
}

export async function createExam(input: Omit<ExamRecord, "id">): Promise<ExamRecord> {
  if (!input.title.trim()) throw ApiError.badRequest("Title is required.");
  if (!input.boardSlug.trim() || !input.classSlug.trim()) {
    throw ApiError.badRequest("Board and class are required.");
  }
  const examDate = new Date(input.examDate);
  if (Number.isNaN(examDate.getTime())) throw ApiError.badRequest("Invalid exam date.");

  if (useDb()) {
    const [row] = await db
      .insert(schema.examDates)
      .values({
        boardSlug: input.boardSlug.trim(),
        boardTitle: input.boardTitle.trim(),
        classSlug: input.classSlug.trim(),
        classTitle: input.classTitle.trim(),
        title: input.title.trim(),
        examDate,
      })
      .returning();
    return mapExamRow(row);
  }
  return examsStore.create({ ...input, examDate: examDate.toISOString() });
}

export async function updateExam(
  id: number,
  input: Partial<Omit<ExamRecord, "id">>,
): Promise<ExamRecord> {
  if (useDb()) {
    const patch: {
      boardSlug?: string;
      boardTitle?: string;
      classSlug?: string;
      classTitle?: string;
      title?: string;
      examDate?: Date;
    } = {};
    if (input.boardSlug !== undefined) patch.boardSlug = input.boardSlug;
    if (input.boardTitle !== undefined) patch.boardTitle = input.boardTitle;
    if (input.classSlug !== undefined) patch.classSlug = input.classSlug;
    if (input.classTitle !== undefined) patch.classTitle = input.classTitle;
    if (input.title !== undefined) patch.title = input.title;
    if (input.examDate !== undefined) {
      const examDate = new Date(input.examDate);
      if (Number.isNaN(examDate.getTime())) throw ApiError.badRequest("Invalid exam date.");
      patch.examDate = examDate;
    }
    const [row] = await db
      .update(schema.examDates)
      .set(patch)
      .where(eq(schema.examDates.id, id))
      .returning();
    if (!row) throw ApiError.notFound("Exam date not found.");
    return mapExamRow(row);
  }
  const updated = examsStore.update(id, input);
  if (!updated) throw ApiError.notFound("Exam date not found.");
  return updated;
}

export async function deleteExam(id: number) {
  if (useDb()) {
    const deleted = await db.delete(schema.examDates).where(eq(schema.examDates.id, id)).returning();
    if (deleted.length === 0) throw ApiError.notFound("Exam date not found.");
    return { deleted: true };
  }
  if (!examsStore.delete(id)) throw ApiError.notFound("Exam date not found.");
  return { deleted: true };
}
