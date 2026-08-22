import { eq } from "drizzle-orm";

import { cmsStore, type CmsBoardRecord } from "../../store/cms-store.js";
import { getBoardCatalogSummaries, getBoardList } from "../../demo-data.js";
import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { ApiError } from "../../utils/api-error.js";

export type BoardCatalogSummary = {
  slug: string;
  title: string;
  classCount: number;
  chapterCount: number;
  ready: boolean;
};

export async function listBoards(): Promise<CmsBoardRecord[]> {
  if (useDb()) {
    const boards = await db.query.boards.findMany({ with: { classes: true } });
    return boards.map((b) => ({
      id: b.id,
      slug: b.slug,
      title: b.title,
      classCount: b.classes.length,
    }));
  }
  return cmsStore.listBoardsAdmin();
}

export function listBoardSummaries() {
  return getBoardList();
}

export async function listBoardCatalog(): Promise<BoardCatalogSummary[]> {
  if (useDb()) {
    try {
      const boards = await db.query.boards.findMany({
        with: {
          classes: {
            with: {
              subjects: {
                with: { chapters: true },
              },
            },
          },
        },
      });
      return boards.map((board) => {
        let chapterCount = 0;
        for (const klass of board.classes) {
          for (const subject of klass.subjects) {
            chapterCount += subject.chapters.filter((ch) => ch.status === "published").length;
          }
        }
        return {
          slug: board.slug,
          title: board.title,
          classCount: board.classes.length,
          chapterCount,
          ready: chapterCount > 0,
        };
      });
    } catch (e) {
      console.error("DB board catalog failed", e);
    }
  }
  return getBoardCatalogSummaries();
}

export async function createBoard(input: { slug: string; title: string }) {
  if (!input.title.trim() || !input.slug.trim()) {
    throw ApiError.badRequest("Slug and title are required.");
  }
  if (useDb()) {
    try {
      const [row] = await db
        .insert(schema.boards)
        .values({ slug: input.slug.trim(), title: input.title.trim() })
        .returning();
      return { id: row.id, slug: row.slug, title: row.title, classCount: 0 };
    } catch {
      throw ApiError.badRequest("Could not create board. Check for duplicate slug.");
    }
  }
  const created = cmsStore.createBoard(input);
  if (!created) throw ApiError.badRequest("Could not create board. Check for duplicate slug.");
  return created;
}

export async function updateBoard(slug: string, input: Partial<{ title: string }>) {
  if (useDb()) {
    const [row] = await db
      .update(schema.boards)
      .set(input)
      .where(eq(schema.boards.slug, slug))
      .returning();
    if (!row) throw ApiError.notFound("Board not found.");
    const classes = await db.query.classes.findMany({ where: eq(schema.classes.boardId, row.id) });
    return { id: row.id, slug: row.slug, title: row.title, classCount: classes.length };
  }
  const updated = cmsStore.updateBoard(slug, input);
  if (!updated) throw ApiError.notFound("Board not found.");
  return updated;
}

export async function deleteBoard(slug: string) {
  if (useDb()) {
    const board = await db.query.boards.findFirst({
      where: eq(schema.boards.slug, slug),
      with: { classes: true },
    });
    if (!board) throw ApiError.notFound("Board not found.");
    if (board.classes.length > 0) {
      throw ApiError.badRequest("Board not found or still has classes.");
    }
    await db.delete(schema.boards).where(eq(schema.boards.id, board.id));
    return { deleted: true };
  }
  if (!cmsStore.deleteBoard(slug)) {
    throw ApiError.badRequest("Board not found or still has classes.");
  }
  return { deleted: true };
}
