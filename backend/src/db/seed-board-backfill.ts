import { and, eq } from "drizzle-orm";

import { BOARD_DATA } from "../demo-data.js";
import { db } from "./index.js";
import * as schema from "./schema.js";

/** Backfill Class 9 Mathematics from BOARD_DATA when a board shell exists but has no chapters. */
export async function seedBoardMathematicsBackfill(boardSlug: string) {
  const boardDemo = BOARD_DATA[boardSlug];
  if (!boardDemo) return;

  const board = await db.query.boards.findFirst({ where: eq(schema.boards.slug, boardSlug) });
  if (!board) return;

  const klass = await db.query.classes.findFirst({
    where: and(eq(schema.classes.boardId, board.id), eq(schema.classes.slug, "9")),
  });
  if (!klass) return;

  const klassDemo = boardDemo.classes.find((c) => c.slug === "9");
  const mathDemo = klassDemo?.subjects.find((s) => s.slug === "mathematics");
  if (!mathDemo || mathDemo.chapters.length === 0) return;

  const existingSubject = await db.query.subjects.findFirst({
    where: and(eq(schema.subjects.classId, klass.id), eq(schema.subjects.slug, "mathematics")),
  });

  if (existingSubject) {
    const chapters = await db.query.chapters.findMany({
      where: eq(schema.chapters.subjectId, existingSubject.id),
    });
    if (chapters.length > 0) return;
  }

  console.log(`[db] Backfilling ${boardSlug} Class 9 Mathematics demo content…`);

  let subjectId = existingSubject?.id;
  if (!subjectId) {
    const [insertedSubject] = await db
      .insert(schema.subjects)
      .values({ classId: klass.id, slug: mathDemo.slug, title: mathDemo.title })
      .returning();
    subjectId = insertedSubject.id;
  }

  for (const chapter of mathDemo.chapters) {
    const [insertedChapter] = await db
      .insert(schema.chapters)
      .values({
        subjectId,
        slug: chapter.slug,
        title: chapter.title,
        summary: chapter.summary,
        summaryUr: chapter.summaryUr ?? null,
        formulas: chapter.formulas,
        formulasUr: chapter.formulasUr ?? [],
        definitions: chapter.definitions ?? [],
        videoUrl: chapter.videoUrl ?? null,
        status: "published",
      })
      .returning();

    for (const exercise of chapter.exercises) {
      const [insertedExercise] = await db
        .insert(schema.exercises)
        .values({
          chapterId: insertedChapter.id,
          slug: exercise.slug,
          title: exercise.title,
        })
        .returning();

      for (const question of exercise.questions) {
        const [insertedQuestion] = await db
          .insert(schema.questions)
          .values({
            exerciseId: insertedExercise.id,
            num: question.num,
            questionText: question.question,
            questionTextUr: question.questionUr ?? null,
            marks: question.marks,
            difficulty: question.difficulty,
            pdfName: question.pdfName ?? null,
            stepsUr: question.stepsUr ?? [],
          })
          .returning();

        for (let i = 0; i < question.steps.length; i++) {
          const step = question.steps[i];
          await db.insert(schema.solutionSteps).values({
            questionId: insertedQuestion.id,
            stepOrder: i,
            title: step.title,
            content: step.content,
          });
        }
      }
    }
  }
}

export async function seedRegionalBoardContent() {
  for (const boardSlug of ["punjab", "kpk", "sindh", "oxford", "cambridge"]) {
    await seedBoardMathematicsBackfill(boardSlug);
  }
}
