import { eq } from "drizzle-orm";

import { cmsStore, type CmsClassRecord } from "../../store/cms-store.js";
import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { ApiError } from "../../utils/api-error.js";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function mapClassRow(row: {
  id: number;
  slug: string;
  title: string;
  boardId: number;
  board?: { slug: string; title: string };
}) {
  const board =
    row.board ??
    (await db.query.boards.findFirst({ where: eq(schema.boards.id, row.boardId) }));
  const subjectCount = await db.query.subjects.findMany({ where: eq(schema.subjects.classId, row.id) });
  return {
    id: row.id,
    boardSlug: board!.slug,
    boardTitle: board!.title,
    slug: row.slug,
    title: row.title,
    subjectCount: subjectCount.length,
  };
}

export async function listClasses(): Promise<CmsClassRecord[]> {
  if (useDb()) {
    const rows = await db.query.classes.findMany({ with: { board: true } });
    return Promise.all(rows.map(mapClassRow));
  }
  return cmsStore.listClassesAdmin();
}

export async function getClassBySlug(slug: string) {
  if (useDb()) {
    const klass = await db.query.classes.findFirst({
      where: eq(schema.classes.slug, slug),
      with: { board: true, subjects: true },
    });
    if (!klass) throw ApiError.notFound("Class not found.");
    const record = await mapClassRow(klass);
    return {
      ...record,
      subjects: klass.subjects.map((s) => ({
        slug: s.slug,
        title: s.title,
        chapterCount: 0,
      })),
    };
  }
  const record = cmsStore.listClassesAdmin().find((c) => c.slug === slug);
  if (!record) throw ApiError.notFound("Class not found.");
  const subjects = cmsStore.listSubjectsAdmin(record.id);
  return {
    ...record,
    subjects: subjects.map((s) => ({
      slug: s.slug,
      title: s.title,
      chapterCount: s.chapterCount,
    })),
  };
}

export async function createClass(input: { boardSlug: string; title: string; slug?: string }) {
  if (!input.title.trim()) throw ApiError.badRequest("Title is required.");
  if (useDb()) {
    const board = await db.query.boards.findFirst({ where: eq(schema.boards.slug, input.boardSlug) });
    if (!board) throw ApiError.badRequest("Could not create class. Check board slug or duplicate slug.");
    const slug = input.slug?.trim() || slugify(input.title);
    try {
      const [row] = await db
        .insert(schema.classes)
        .values({ boardId: board.id, slug, title: input.title.trim() })
        .returning();
      return mapClassRow({ ...row, board });
    } catch {
      throw ApiError.badRequest("Could not create class. Check board slug or duplicate slug.");
    }
  }
  const created = cmsStore.createClass(input);
  if (!created) throw ApiError.badRequest("Could not create class. Check board slug or duplicate slug.");
  return created;
}

export async function updateClass(slug: string, input: Partial<{ title: string }>) {
  if (useDb()) {
    const [row] = await db
      .update(schema.classes)
      .set(input)
      .where(eq(schema.classes.slug, slug))
      .returning();
    if (!row) throw ApiError.notFound("Class not found.");
    return mapClassRow(row);
  }
  const record = cmsStore.listClassesAdmin().find((c) => c.slug === slug);
  if (!record) throw ApiError.notFound("Class not found.");
  const updated = cmsStore.updateClass(record.id, input);
  if (!updated) throw ApiError.notFound("Class not found.");
  return updated;
}

export async function deleteClass(slug: string) {
  if (useDb()) {
    const klass = await db.query.classes.findFirst({
      where: eq(schema.classes.slug, slug),
      with: { subjects: true },
    });
    if (!klass) throw ApiError.notFound("Class not found.");
    if (klass.subjects.length > 0) {
      throw ApiError.badRequest("Remove all subjects before deleting this class.");
    }
    await db.delete(schema.classes).where(eq(schema.classes.id, klass.id));
    return { deleted: true };
  }
  const record = cmsStore.listClassesAdmin().find((c) => c.slug === slug);
  if (!record) throw ApiError.notFound("Class not found.");
  if (!cmsStore.deleteClass(record.id)) {
    throw ApiError.badRequest("Remove all subjects before deleting this class.");
  }
  return { deleted: true };
}
