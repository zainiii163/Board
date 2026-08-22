import { db } from "./index.js";
import * as schema from "./schema.js";
import { BOARD_DATA } from "../demo-data.js";

/** Insert full demo hierarchy into PostgreSQL (idempotent only when DB is empty). */
export async function seedBoardContent() {
  for (const board of Object.values(BOARD_DATA)) {
    const [insertedBoard] = await db
      .insert(schema.boards)
      .values({ slug: board.slug, title: board.title })
      .returning();

    for (const klass of board.classes) {
      const [insertedClass] = await db
        .insert(schema.classes)
        .values({ boardId: insertedBoard.id, slug: klass.slug, title: klass.title })
        .returning();

      for (const subject of klass.subjects) {
        const [insertedSubject] = await db
          .insert(schema.subjects)
          .values({ classId: insertedClass.id, slug: subject.slug, title: subject.title })
          .returning();

        for (const chapter of subject.chapters) {
          const [insertedChapter] = await db
            .insert(schema.chapters)
            .values({
              subjectId: insertedSubject.id,
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
    }
  }
}
