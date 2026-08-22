import { and, eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { memoryStore } from "../../store/memory-store.js";
import { ApiError } from "../../utils/api-error.js";

export type BookmarkRecord = {
  id: number;
  title: string;
  path: string;
  createdAt: string;
};

function mapBookmark(row: {
  id: number;
  title: string;
  path: string;
  createdAt: Date | null;
}): BookmarkRecord {
  return {
    id: row.id,
    title: row.title,
    path: row.path,
    createdAt: (row.createdAt ?? new Date()).toISOString(),
  };
}

export async function listBookmarks(userId: number): Promise<BookmarkRecord[]> {
  if (useDb()) {
    const rows = await db.query.bookmarks.findMany({
      where: eq(schema.bookmarks.userId, userId),
      orderBy: (b, { desc }) => [desc(b.createdAt)],
    });
    return rows.map(mapBookmark);
  }
  return memoryStore.bookmarks.listForUser(userId);
}

export async function addBookmark(
  userId: number,
  input: { title: string; path: string },
): Promise<BookmarkRecord> {
  const title = input.title.trim();
  const path = input.path.trim();
  if (!title || !path) throw ApiError.badRequest("Title and path are required.");

  if (useDb()) {
    const existing = await db.query.bookmarks.findFirst({
      where: and(eq(schema.bookmarks.userId, userId), eq(schema.bookmarks.path, path)),
    });
    if (existing) return mapBookmark(existing);

    const [created] = await db
      .insert(schema.bookmarks)
      .values({ userId, title, path })
      .returning();
    return mapBookmark(created);
  }

  return memoryStore.bookmarks.create({ userId, title, path });
}

export async function removeBookmark(userId: number, id: number): Promise<boolean> {
  if (useDb()) {
    const deleted = await db
      .delete(schema.bookmarks)
      .where(and(eq(schema.bookmarks.id, id), eq(schema.bookmarks.userId, userId)))
      .returning();
    return deleted.length > 0;
  }
  return memoryStore.bookmarks.remove(userId, id);
}
