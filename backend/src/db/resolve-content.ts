import { and, eq } from "drizzle-orm";

import { db } from "./index.js";
import * as schema from "./schema.js";

export async function resolveSubjectId(boardSlug: string, classSlug: string, subjectSlug: string) {
  const subject = await db.query.subjects.findFirst({
    where: eq(schema.subjects.slug, subjectSlug),
    with: { class: { with: { board: true } } },
  });
  if (!subject) return null;
  if (subject.class.slug !== classSlug || subject.class.board.slug !== boardSlug) return null;
  return subject.id;
}

export async function resolveChapterId(chapterId: number) {
  return db.query.chapters.findFirst({
    where: eq(schema.chapters.id, chapterId),
    with: {
      subject: { with: { class: { with: { board: true } } } },
      exercises: true,
    },
  });
}

export async function resolveExerciseId(exerciseId: number) {
  return db.query.exercises.findFirst({
    where: eq(schema.exercises.id, exerciseId),
    with: { chapter: true },
  });
}

export async function findQuestionById(questionId: number) {
  return db.query.questions.findFirst({
    where: eq(schema.questions.id, questionId),
    with: { steps: { orderBy: (steps, { asc }) => [asc(steps.stepOrder)] } },
  });
}

export async function findExerciseBySlug(
  boardSlug: string,
  classSlug: string,
  subjectSlug: string,
  chapterSlug: string,
  exerciseSlug: string,
) {
  const exercise = await db.query.exercises.findFirst({
    where: eq(schema.exercises.slug, exerciseSlug),
    with: {
      chapter: {
        with: {
          subject: { with: { class: { with: { board: true } } } },
        },
      },
    },
  });
  if (!exercise) return null;
  const { chapter } = exercise;
  if (
    chapter.slug !== chapterSlug ||
    chapter.subject.slug !== subjectSlug ||
    chapter.subject.class.slug !== classSlug ||
    chapter.subject.class.board.slug !== boardSlug
  ) {
    return null;
  }
  return exercise;
}
