import { eq } from "drizzle-orm";

import { cmsStore, type CmsSubjectRecord } from "../../store/cms-store.js";
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

async function mapSubjectRow(row: {
  id: number;
  slug: string;
  title: string;
  classId: number;
  class?: { slug: string; title: string; board: { slug: string; title: string } };
}) {
  const klass =
    row.class ??
    (await db.query.classes.findFirst({
      where: eq(schema.classes.id, row.classId),
      with: { board: true },
    }));
  const chapters = await db.query.chapters.findMany({ where: eq(schema.chapters.subjectId, row.id) });
  return {
    id: row.id,
    boardSlug: klass!.board.slug,
    boardTitle: klass!.board.title,
    classSlug: klass!.slug,
    classTitle: klass!.title,
    slug: row.slug,
    title: row.title,
    chapterCount: chapters.length,
  };
}

export async function listSubjects(classId?: number): Promise<CmsSubjectRecord[]> {
  if (useDb()) {
    const rows = classId
      ? await db.query.subjects.findMany({
          where: eq(schema.subjects.classId, classId),
          with: { class: { with: { board: true } } },
        })
      : await db.query.subjects.findMany({ with: { class: { with: { board: true } } } });
    return Promise.all(rows.map(mapSubjectRow));
  }
  return cmsStore.listSubjectsAdmin(classId);
}

export async function getSubjectBySlug(slug: string) {
  if (useDb()) {
    const subject = await db.query.subjects.findFirst({
      where: eq(schema.subjects.slug, slug),
      with: {
        class: { with: { board: true } },
        chapters: true,
      },
    });
    if (!subject) throw ApiError.notFound("Subject not found.");
    const record = await mapSubjectRow(subject);
    return {
      ...record,
      chapters: subject.chapters.map((c) => ({
        slug: c.slug,
        title: c.title,
        summary: c.summary,
        summaryUr: c.summaryUr ?? undefined,
        formulas: c.formulas,
        formulasUr: c.formulasUr,
        status: c.status,
      })),
    };
  }
  const record = cmsStore.listSubjectsAdmin().find((s) => s.slug === slug);
  if (!record) throw ApiError.notFound("Subject not found.");
  const chapters = cmsStore
    .listChaptersAdmin()
    .filter(
      (c) =>
        c.boardSlug === record.boardSlug &&
        c.classSlug === record.classSlug &&
        c.subjectSlug === record.slug,
    )
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      summary: c.summary,
      summaryUr: c.summaryUr,
      formulas: c.formulas,
      formulasUr: c.formulasUr,
      status: c.status,
    }));
  return { ...record, chapters };
}

export async function createSubject(input: {
  boardSlug: string;
  classSlug: string;
  title: string;
  slug?: string;
}) {
  if (!input.title.trim()) throw ApiError.badRequest("Title is required.");
  if (useDb()) {
    const klass = await db.query.classes.findFirst({
      where: eq(schema.classes.slug, input.classSlug),
      with: { board: true },
    });
    if (!klass || klass.board.slug !== input.boardSlug) {
      throw ApiError.badRequest("Could not create subject. Check board/class or duplicate slug.");
    }
    const slug = input.slug?.trim() || slugify(input.title);
    try {
      const [row] = await db
        .insert(schema.subjects)
        .values({ classId: klass.id, slug, title: input.title.trim() })
        .returning();
      return mapSubjectRow({ ...row, class: klass });
    } catch {
      throw ApiError.badRequest("Could not create subject. Check board/class or duplicate slug.");
    }
  }
  const created = cmsStore.createSubject(input);
  if (!created) throw ApiError.badRequest("Could not create subject. Check board/class or duplicate slug.");
  return created;
}

export async function updateSubject(slug: string, input: Partial<{ title: string }>) {
  if (useDb()) {
    const [row] = await db
      .update(schema.subjects)
      .set(input)
      .where(eq(schema.subjects.slug, slug))
      .returning();
    if (!row) throw ApiError.notFound("Subject not found.");
    return mapSubjectRow(row);
  }
  const record = cmsStore.listSubjectsAdmin().find((s) => s.slug === slug);
  if (!record) throw ApiError.notFound("Subject not found.");
  const updated = cmsStore.updateSubject(record.id, input);
  if (!updated) throw ApiError.notFound("Subject not found.");
  return updated;
}

export async function deleteSubject(slug: string) {
  if (useDb()) {
    const subject = await db.query.subjects.findFirst({
      where: eq(schema.subjects.slug, slug),
      with: { chapters: true },
    });
    if (!subject) throw ApiError.notFound("Subject not found.");
    if (subject.chapters.length > 0) {
      throw ApiError.badRequest("Remove all chapters before deleting this subject.");
    }
    await db.delete(schema.subjects).where(eq(schema.subjects.id, subject.id));
    return { deleted: true };
  }
  const record = cmsStore.listSubjectsAdmin().find((s) => s.slug === slug);
  if (!record) throw ApiError.notFound("Subject not found.");
  if (!cmsStore.deleteSubject(record.id)) {
    throw ApiError.badRequest("Remove all chapters before deleting this subject.");
  }
  return { deleted: true };
}
