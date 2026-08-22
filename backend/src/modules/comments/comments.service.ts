import { eq, and, desc } from "drizzle-orm";

import { commentsStore, type CommentRecord, type CommentStatus } from "../../store/comments-store.js";
import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { ApiError } from "../../utils/api-error.js";

function mapCommentRow(row: typeof schema.questionComments.$inferSelect): CommentRecord {
  return {
    id: row.id,
    userId: row.userId,
    userName: row.userName,
    pagePath: row.pagePath,
    questionRef: row.questionRef,
    body: row.body,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listCommentsForPage(pagePath: string) {
  if (useDb()) {
    const rows = await db.query.questionComments.findMany({
      where: and(
        eq(schema.questionComments.pagePath, pagePath),
        eq(schema.questionComments.status, "approved"),
      ),
      orderBy: [desc(schema.questionComments.createdAt)],
    });
    return rows.map(mapCommentRow);
  }
  return commentsStore.listByPath(pagePath, "approved");
}

export async function listCommentsForModeration(status?: CommentStatus) {
  if (useDb()) {
    const rows = status
      ? await db.query.questionComments.findMany({
          where: eq(schema.questionComments.status, status),
          orderBy: [desc(schema.questionComments.createdAt)],
        })
      : await db.query.questionComments.findMany({
          orderBy: [desc(schema.questionComments.createdAt)],
        });
    return rows.map(mapCommentRow);
  }
  return commentsStore.listModeration(status ?? "pending");
}

export async function createComment(input: {
  userId: number;
  userName: string;
  pagePath: string;
  questionRef: string;
  body: string;
}) {
  const body = input.body.trim();
  if (!body) throw ApiError.badRequest("Comment cannot be empty.");
  if (body.length > 2000) throw ApiError.badRequest("Comment is too long.");
  if (useDb()) {
    const [row] = await db
      .insert(schema.questionComments)
      .values({
        userId: input.userId,
        userName: input.userName,
        pagePath: input.pagePath,
        questionRef: input.questionRef,
        body,
        status: "pending",
      })
      .returning();
    return mapCommentRow(row);
  }
  return commentsStore.create(input);
}

export async function approveComment(id: number) {
  if (useDb()) {
    const [row] = await db
      .update(schema.questionComments)
      .set({ status: "approved" })
      .where(eq(schema.questionComments.id, id))
      .returning();
    if (!row) throw ApiError.notFound("Comment not found.");
    return mapCommentRow(row);
  }
  const updated = commentsStore.setStatus(id, "approved");
  if (!updated) throw ApiError.notFound("Comment not found.");
  return updated;
}

export async function rejectComment(id: number) {
  if (useDb()) {
    const [row] = await db
      .update(schema.questionComments)
      .set({ status: "rejected" })
      .where(eq(schema.questionComments.id, id))
      .returning();
    if (!row) throw ApiError.notFound("Comment not found.");
    return mapCommentRow(row);
  }
  const updated = commentsStore.setStatus(id, "rejected");
  if (!updated) throw ApiError.notFound("Comment not found.");
  return updated;
}

export async function deleteComment(id: number) {
  if (useDb()) {
    const result = await db
      .delete(schema.questionComments)
      .where(eq(schema.questionComments.id, id))
      .returning();
    if (result.length === 0) throw ApiError.notFound("Comment not found.");
    return { deleted: true };
  }
  if (!commentsStore.delete(id)) throw ApiError.notFound("Comment not found.");
  return { deleted: true };
}
