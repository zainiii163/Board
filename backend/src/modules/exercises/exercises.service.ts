import { eq } from "drizzle-orm";

import { cmsStore, type CmsExerciseRecord } from "../../store/cms-store.js";
import { mapExerciseRow } from "../../db/content-mappers.js";
import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import { resolveChapterId } from "../../db/resolve-content.js";
import * as schema from "../../db/schema.js";
import { setMutableBoardData } from "../../demo-data.js";
import { ApiError } from "../../utils/api-error.js";
import { addAuditLog } from "../audit/audit.service.js";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function listExercises(chapterId: number): Promise<CmsExerciseRecord[]> {
  if (useDb()) {
    const rows = await db.query.exercises.findMany({
      where: eq(schema.exercises.chapterId, chapterId),
      with: { questions: { columns: { id: true } } },
    });
    return rows.map((row) => mapExerciseRow(row, row.questions.length));
  }
  return cmsStore.listExercises(chapterId);
}

export async function createExercise(chapterId: number, title: string, userId?: number) {
  if (useDb()) {
    const chapter = await resolveChapterId(chapterId);
    if (!chapter) throw ApiError.badRequest("Could not create exercise. Chapter not found.");

    const slug = slugify(title);
    const [row] = await db
      .insert(schema.exercises)
      .values({ chapterId, slug, title })
      .returning();

    const created = mapExerciseRow(row, 0);
    if (userId) await addAuditLog({ userId, action: "create_exercise", target: title });
    return created;
  }

  const created = cmsStore.createExercise(chapterId, title);
  if (!created) throw ApiError.badRequest("Could not create exercise.");
  setMutableBoardData(cmsStore.getBoardData());
  if (userId) await addAuditLog({ userId, action: "create_exercise", target: title });
  return created;
}

export async function deleteExercise(exerciseId: number, userId?: number) {
  if (useDb()) {
    const [deleted] = await db
      .delete(schema.exercises)
      .where(eq(schema.exercises.id, exerciseId))
      .returning();
    if (!deleted) throw ApiError.notFound("Exercise not found.");
    if (userId) await addAuditLog({ userId, action: "delete_exercise", target: String(exerciseId) });
    return { deleted: true };
  }

  const deleted = cmsStore.deleteExercise(exerciseId);
  if (!deleted) throw ApiError.notFound("Exercise not found.");
  setMutableBoardData(cmsStore.getBoardData());
  if (userId) await addAuditLog({ userId, action: "delete_exercise", target: String(exerciseId) });
  return { deleted: true };
}
