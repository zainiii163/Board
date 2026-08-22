import { eq, and } from "drizzle-orm";



import { cmsStore, type CmsQuestionRecord } from "../../store/cms-store.js";

import { mapQuestionRow } from "../../db/content-mappers.js";

import { db } from "../../db/index.js";

import { useDb } from "../../db/mode.js";

import { findQuestionById, resolveExerciseId } from "../../db/resolve-content.js";

import * as schema from "../../db/schema.js";

import { setMutableBoardData } from "../../demo-data.js";

import { ApiError } from "../../utils/api-error.js";

import { addAuditLog } from "../audit/audit.service.js";



export async function listQuestions(exerciseId: number): Promise<CmsQuestionRecord[]> {

  if (useDb()) {

    const rows = await db.query.questions.findMany({

      where: eq(schema.questions.exerciseId, exerciseId),

      with: { steps: { orderBy: (steps, { asc }) => [asc(steps.stepOrder)] } },

    });

    return rows.map((row) =>

      mapQuestionRow(

        row,

        row.steps.map((s) => ({ title: s.title, content: s.content })),

      ),

    );

  }

  return cmsStore.listQuestions(exerciseId);

}



async function replaceSolutionSteps(questionId: number, steps: { title: string; content: string }[]) {

  await db.delete(schema.solutionSteps).where(eq(schema.solutionSteps.questionId, questionId));

  for (let i = 0; i < steps.length; i++) {

    await db.insert(schema.solutionSteps).values({

      questionId,

      stepOrder: i,

      title: steps[i].title,

      content: steps[i].content,

    });

  }

}



export async function createQuestion(

  exerciseId: number,

  input: Omit<CmsQuestionRecord, "id" | "exerciseId">,

  userId?: number,

) {

  if (useDb()) {

    const exercise = await resolveExerciseId(exerciseId);

    if (!exercise) throw ApiError.badRequest("Could not create question. Exercise not found.");



    const duplicate = await db.query.questions.findFirst({
      where: and(eq(schema.questions.exerciseId, exerciseId), eq(schema.questions.num, input.num)),
    });
    if (duplicate) {
      throw ApiError.badRequest("Could not create question. Number may already exist.");
    }



    const [row] = await db

      .insert(schema.questions)

      .values({

        exerciseId,

        num: input.num,

        questionText: input.questionText,

        questionTextUr: input.questionTextUr ?? null,

        marks: input.marks,

        difficulty: input.difficulty,

        pdfName: input.pdfName,

        stepsUr: input.stepsUr ?? [],

      })

      .returning();



    await replaceSolutionSteps(row.id, input.steps);

    const full = await findQuestionById(row.id);

    if (!full) throw ApiError.badRequest("Question created but could not be loaded.");

    const created = mapQuestionRow(

      full,

      full.steps.map((s) => ({ title: s.title, content: s.content })),

    );

    if (userId) await addAuditLog({ userId, action: "create_question", target: `Q${input.num}` });

    return created;

  }



  const created = cmsStore.createQuestion(exerciseId, input);

  if (!created) throw ApiError.badRequest("Could not create question. Number may already exist.");

  setMutableBoardData(cmsStore.getBoardData());

  if (userId) await addAuditLog({ userId, action: "create_question", target: `Q${input.num}` });

  return created;

}



export async function updateQuestion(

  questionId: number,

  input: Partial<Omit<CmsQuestionRecord, "id" | "exerciseId">>,

  userId?: number,

) {

  if (useDb()) {

    const { steps, ...fields } = input;

    if (Object.keys(fields).length > 0) {

      const [row] = await db

        .update(schema.questions)

        .set(fields)

        .where(eq(schema.questions.id, questionId))

        .returning();

      if (!row) throw ApiError.notFound("Question not found.");

    }

    if (steps) await replaceSolutionSteps(questionId, steps);



    const full = await findQuestionById(questionId);

    if (!full) throw ApiError.notFound("Question not found.");

    const updated = mapQuestionRow(

      full,

      full.steps.map((s) => ({ title: s.title, content: s.content })),

    );

    if (userId) await addAuditLog({ userId, action: "update_question", target: `Q${updated.num}` });

    return updated;

  }



  const updated = cmsStore.updateQuestion(questionId, input);

  if (!updated) throw ApiError.notFound("Question not found.");

  setMutableBoardData(cmsStore.getBoardData());

  if (userId) await addAuditLog({ userId, action: "update_question", target: `Q${updated.num}` });

  return updated;

}



export async function deleteQuestion(questionId: number, userId?: number) {

  if (useDb()) {

    const [deleted] = await db

      .delete(schema.questions)

      .where(eq(schema.questions.id, questionId))

      .returning();

    if (!deleted) throw ApiError.notFound("Question not found.");

    if (userId) await addAuditLog({ userId, action: "delete_question", target: String(questionId) });

    return { deleted: true };

  }



  const deleted = cmsStore.deleteQuestion(questionId);

  if (!deleted) throw ApiError.notFound("Question not found.");

  setMutableBoardData(cmsStore.getBoardData());

  if (userId) await addAuditLog({ userId, action: "delete_question", target: String(questionId) });

  return { deleted: true };

}

