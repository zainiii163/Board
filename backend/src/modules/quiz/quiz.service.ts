import { eq } from "drizzle-orm";

import { cmsStore } from "../../store/cms-store.js";
import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import * as mcqsService from "../mcqs/mcqs.service.js";
import { ApiError } from "../../utils/api-error.js";

export async function getChapterQuiz(
  boardSlug: string,
  classSlug: string,
  subjectSlug: string,
  chapterSlug: string,
) {
  const mcqs = await mcqsService.listMcqs(boardSlug, classSlug, subjectSlug, chapterSlug);
  return mcqs.map(({ id, question, options }) => ({ id, question, options }));
}

export async function submitQuizScore(
  userId: number,
  chapterKeyValue: string,
  answers: Record<number, string>,
) {
  const parts = chapterKeyValue.split("/");
  if (parts.length !== 4) throw ApiError.badRequest("Invalid chapter key.");
  const [boardSlug, classSlug, subjectSlug, chapterSlug] = parts;
  const mcqs = await mcqsService.listMcqs(boardSlug, classSlug, subjectSlug, chapterSlug);
  if (mcqs.length === 0) throw ApiError.notFound("No quiz for this chapter.");

  let score = 0;
  const results = mcqs.map((mcq) => {
    const selected = answers[mcq.id] ?? "";
    const correct = selected === mcq.correctLabel;
    if (correct) score += 1;
    return {
      id: mcq.id,
      correct,
      selected,
      correctLabel: mcq.correctLabel,
      reason: mcq.reason,
    };
  });

  if (useDb()) {
    const [row] = await db
      .insert(schema.quizScores)
      .values({
        userId,
        chapterKey: chapterKeyValue,
        score,
        total: mcqs.length,
      })
      .returning();
    return { score, total: mcqs.length, results, savedAt: row.createdAt.toISOString() };
  }

  const saved = cmsStore.saveQuizScore(userId, chapterKeyValue, score, mcqs.length);
  return { score, total: mcqs.length, results, savedAt: saved.createdAt };
}

export async function getUserQuizScores(userId: number) {
  if (useDb()) {
    const rows = await db.query.quizScores.findMany({
      where: eq(schema.quizScores.userId, userId),
      orderBy: (scores, { desc }) => [desc(scores.createdAt)],
    });
    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      chapterKey: row.chapterKey,
      score: row.score,
      total: row.total,
      createdAt: row.createdAt.toISOString(),
    }));
  }
  return cmsStore.getQuizScoresForUser(userId);
}

export async function getMcqAnswers(
  boardSlug: string,
  classSlug: string,
  subjectSlug: string,
  chapterSlug: string,
) {
  return mcqsService.listMcqs(boardSlug, classSlug, subjectSlug, chapterSlug);
}
