import type { ContentStatus } from "@boardnotes/shared";

import { eq } from "drizzle-orm";



import { cmsStore, type CmsChapterRecord } from "../../store/cms-store.js";

import { mapChapterRow } from "../../db/content-mappers.js";

import { db } from "../../db/index.js";

import { useDb } from "../../db/mode.js";

import { resolveChapterId, resolveSubjectId } from "../../db/resolve-content.js";

import * as schema from "../../db/schema.js";

import { ApiError } from "../../utils/api-error.js";

import { addAuditLog } from "../audit/audit.service.js";
import { notifyClassroomOfPublishedChapter } from "../notifications/classroom-updates.service.js";

async function maybeNotifyPublished(previousStatus: ContentStatus | undefined, chapter: CmsChapterRecord) {
  if (previousStatus === "published" || chapter.status !== "published") return;
  try {
    await notifyClassroomOfPublishedChapter({
      title: chapter.title,
      boardSlug: chapter.boardSlug,
      classSlug: chapter.classSlug,
      subjectSlug: chapter.subjectSlug,
      slug: chapter.slug,
    });
  } catch (error) {
    console.error("[notify] Failed to send classroom email updates", error);
  }
}



function slugify(value: string) {

  return value

    .toLowerCase()

    .trim()

    .replace(/[^a-z0-9]+/g, "-")

    .replace(/^-|-$/g, "");

}



export async function listChapters(status?: ContentStatus): Promise<CmsChapterRecord[]> {

  if (useDb()) {

    const rows = await db.query.chapters.findMany({

      with: {

        subject: { with: { class: { with: { board: true } } } },

        exercises: true,

      },

    });

    return rows

      .filter((r) => !status || r.status === status)

      .map(mapChapterRow);

  }

  return cmsStore.listChaptersAdmin(status);

}



export async function createChapter(

  input: {

    boardSlug: string;

    classSlug: string;

    subjectSlug: string;

    title: string;

    summary: string;

    summaryUr?: string;

    formulas?: string[];

    formulasUr?: string[];

    definitions?: { term: string; definition: string; termUr?: string; definitionUr?: string }[];

    videoUrl?: string;

    status?: ContentStatus;

  },

  userId?: number,

) {

  if (useDb()) {

    const subjectId = await resolveSubjectId(input.boardSlug, input.classSlug, input.subjectSlug);

    if (!subjectId) throw ApiError.badRequest("Could not create chapter. Check board/class/subject.");



    const slug = slugify(input.title);

    const [row] = await db

      .insert(schema.chapters)

      .values({

        subjectId,

        slug,

        title: input.title,

        summary: input.summary,

        summaryUr: input.summaryUr ?? null,

        formulas: input.formulas ?? [],

        formulasUr: input.formulasUr ?? [],

        definitions: input.definitions ?? [],

        videoUrl: input.videoUrl?.trim() || null,

        status: input.status ?? "draft",

      })

      .returning();



    const full = await resolveChapterId(row.id);

    if (!full) throw ApiError.badRequest("Chapter created but could not be loaded.");

    const created = mapChapterRow(full);

    if (userId) await addAuditLog({ userId, action: "create_chapter", target: created.title });

    return created;

  }



  const created = cmsStore.createChapter(input);

  if (!created) throw ApiError.badRequest("Could not create chapter. Check board/class/subject.");

  if (userId) await addAuditLog({ userId, action: "create_chapter", target: created.title });

  return created;

}



export async function updateChapter(

  id: number,

  input: Partial<{

    title: string;

    summary: string;

    summaryUr: string;

    formulas: string[];

    formulasUr: string[];

    definitions: { term: string; definition: string; termUr?: string; definitionUr?: string }[];

    videoUrl: string;

    status: ContentStatus;

  }>,

  userId?: number,

) {
  const before = (await listChapters()).find((c) => c.id === id);

  if (useDb()) {

    const patch = { ...input } as Record<string, unknown>;
    if (typeof patch.videoUrl === "string") {
      patch.videoUrl = patch.videoUrl.trim() || null;
    }

    const [row] = await db

      .update(schema.chapters)

      .set(patch)

      .where(eq(schema.chapters.id, id))

      .returning();

    if (!row) throw ApiError.notFound("Chapter not found.");

    const full = await resolveChapterId(id);

    if (!full) throw ApiError.notFound("Chapter not found.");

    const updated = mapChapterRow(full);

    if (userId) await addAuditLog({ userId, action: "update_chapter", target: updated.title });
    await maybeNotifyPublished(before?.status, updated);

    return updated;

  }



  const updated = cmsStore.updateChapter(id, input);

  if (!updated) throw ApiError.notFound("Chapter not found.");

  if (userId) await addAuditLog({ userId, action: "update_chapter", target: updated.title });
  await maybeNotifyPublished(before?.status, updated);

  return updated;

}



export async function deleteChapter(id: number, userId?: number) {

  if (useDb()) {

    const full = await resolveChapterId(id);

    const [deleted] = await db.delete(schema.chapters).where(eq(schema.chapters.id, id)).returning();

    if (!deleted) throw ApiError.notFound("Chapter not found.");

    if (userId && full) await addAuditLog({ userId, action: "delete_chapter", target: full.title });

    return { deleted: true };

  }



  const chapter = cmsStore.listChaptersAdmin().find((c) => c.id === id);

  const deleted = cmsStore.deleteChapter(id);

  if (!deleted) throw ApiError.notFound("Chapter not found.");

  if (userId && chapter) await addAuditLog({ userId, action: "delete_chapter", target: chapter.title });

  return { deleted: true };

}



export async function publishChapter(id: number, userId?: number) {
  if (userId) {
    const chapters = await listChapters();
    const current = chapters.find((c) => c.id === id);
    if (current) await addAuditLog({ userId, action: "publish_chapter", target: current.title });
  }
  return updateChapter(id, { status: "published" }, userId);
}



export async function unpublishChapter(id: number, userId?: number) {

  return updateChapter(id, { status: "draft" }, userId);

}



export async function submitForReview(id: number, userId?: number) {
  const chapters = await listChapters();
  const current = chapters.find((c) => c.id === id);
  if (!current) throw ApiError.notFound("Chapter not found.");
  if (current.status === "in_review") throw ApiError.badRequest("Chapter is already in review.");
  if (current.status === "published") throw ApiError.badRequest("Published chapters cannot be submitted for review.");
  return updateChapter(id, { status: "in_review" }, userId);
}

export async function rejectChapter(id: number, userId?: number) {
  const chapters = await listChapters();
  const current = chapters.find((c) => c.id === id);
  if (!current) throw ApiError.notFound("Chapter not found.");
  if (current.status !== "in_review") throw ApiError.badRequest("Only chapters in review can be sent back.");
  if (userId) await addAuditLog({ userId, action: "reject_chapter", target: current.title });
  return updateChapter(id, { status: "draft" }, userId);
}

