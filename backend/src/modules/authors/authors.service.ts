import { eq } from "drizzle-orm";

import { cmsStore } from "../../store/cms-store.js";
import { authorsStore, type AuthorRecord } from "../../store/authors-store.js";
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

function mapAuthorRow(row: typeof schema.authors.$inferSelect): AuthorRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    title: row.title,
    bio: row.bio,
    boards: row.boards,
    noteCount: row.noteCount,
  };
}

async function withNotes(author: AuthorRecord) {
  if (useDb()) {
    const chapters = await db.query.chapters.findMany({
      where: eq(schema.chapters.status, "published"),
      with: { subject: { with: { class: { with: { board: true } } } } },
      limit: 6,
    });
    const notes = chapters.map((c) => ({
      title: c.title,
      path: `/${c.subject.class.board.slug}/${c.subject.class.slug}/${c.subject.slug}/${c.slug}`,
      subject: c.subject.title,
    }));
    return { ...author, notes };
  }

  const notes = cmsStore
    .listChaptersAdmin()
    .filter((c) => c.status === "published")
    .slice(0, 6)
    .map((c) => ({
      title: c.title,
      path: `/${c.boardSlug}/${c.classSlug}/${c.subjectSlug}/${c.slug}`,
      subject: c.subjectTitle,
    }));

  return { ...author, notes };
}

export async function listAuthors() {
  if (useDb()) {
    const rows = await db.query.authors.findMany();
    return rows.map(mapAuthorRow);
  }
  return authorsStore.list();
}

export async function getAuthorBySlug(slug: string) {
  if (useDb()) {
    const row = await db.query.authors.findFirst({ where: eq(schema.authors.slug, slug) });
    if (!row) return null;
    return withNotes(mapAuthorRow(row));
  }
  const author = authorsStore.getBySlug(slug);
  if (!author) return null;
  return withNotes(author);
}

export async function createAuthor(input: {
  name: string;
  title: string;
  bio: string;
  boards: string[];
  slug?: string;
}) {
  if (!input.name.trim()) throw ApiError.badRequest("Name is required.");
  if (useDb()) {
    const slug = input.slug?.trim() || slugify(input.name);
    try {
      const [row] = await db
        .insert(schema.authors)
        .values({
          slug,
          name: input.name.trim(),
          title: input.title.trim(),
          bio: input.bio.trim(),
          boards: input.boards,
          noteCount: 0,
        })
        .returning();
      return mapAuthorRow(row);
    } catch {
      throw ApiError.badRequest("Could not create author. Check for duplicate slug.");
    }
  }
  const created = authorsStore.create(input);
  if (!created) throw ApiError.badRequest("Could not create author. Check for duplicate slug.");
  return created;
}

export async function updateAuthor(
  slug: string,
  input: Partial<{ name: string; title: string; bio: string; boards: string[]; noteCount: number }>,
) {
  if (useDb()) {
    const [row] = await db
      .update(schema.authors)
      .set(input)
      .where(eq(schema.authors.slug, slug))
      .returning();
    if (!row) throw ApiError.notFound("Author not found.");
    return mapAuthorRow(row);
  }
  const updated = authorsStore.update(slug, input);
  if (!updated) throw ApiError.notFound("Author not found.");
  return updated;
}

export async function deleteAuthor(slug: string) {
  if (useDb()) {
    const result = await db.delete(schema.authors).where(eq(schema.authors.slug, slug)).returning();
    if (result.length === 0) throw ApiError.notFound("Author not found.");
    return { deleted: true };
  }
  if (!authorsStore.delete(slug)) throw ApiError.notFound("Author not found.");
  return { deleted: true };
}
