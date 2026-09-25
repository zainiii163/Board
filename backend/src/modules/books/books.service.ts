import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import * as schema from "../../db/schema.js";
import { useDb } from "../../db/mode.js";
import { resourcesStore, type BookRecord } from "../../store/resources-store.js";
import { ApiError } from "../../utils/api-error.js";
import { savePdfUpload } from "../pdfs/pdfs.service.js";

function mapBookRow(row: typeof schema.books.$inferSelect): BookRecord {
  return {
    id: row.id,
    boardSlug: row.boardSlug,
    boardTitle: row.boardTitle,
    classSlug: row.classSlug,
    classTitle: row.classTitle,
    subjectSlug: row.subjectSlug,
    subjectTitle: row.subjectTitle,
    title: row.title,
    priceLabel: row.priceLabel,
    coverUrl: row.coverUrl,
    pdfUrl: row.pdfUrl,
    notesPath: row.notesPath,
  };
}

export type BookFilters = {
  boardSlug?: string;
  classSlug?: string;
  subjectSlug?: string;
};

export async function listBooks(filters: BookFilters = {}): Promise<BookRecord[]> {
  if (useDb()) {
    const rows = await db.select().from(schema.books);
    return rows.map(mapBookRow).filter((b) => {
      if (filters.boardSlug && b.boardSlug !== filters.boardSlug) return false;
      if (filters.classSlug && b.classSlug !== filters.classSlug) return false;
      if (filters.subjectSlug && (b.subjectSlug ?? "") !== filters.subjectSlug) return false;
      return true;
    });
  }
  return resourcesStore.listBooks(filters);
}

export async function getBook(id: number): Promise<BookRecord> {
  if (useDb()) {
    const [row] = await db.select().from(schema.books).where(eq(schema.books.id, id)).limit(1);
    if (!row) throw ApiError.notFound("Book not found.");
    return mapBookRow(row);
  }
  const book = resourcesStore.getBook(id);
  if (!book) throw ApiError.notFound("Book not found.");
  return book;
}

export async function createBook(input: Omit<BookRecord, "id">): Promise<BookRecord> {
  if (!input.title.trim()) throw ApiError.badRequest("Title is required.");
  if (!input.boardSlug.trim() || !input.classSlug.trim()) {
    throw ApiError.badRequest("Board and class are required.");
  }

  if (useDb()) {
    const [row] = await db
      .insert(schema.books)
      .values({
        boardSlug: input.boardSlug,
        boardTitle: input.boardTitle,
        classSlug: input.classSlug,
        classTitle: input.classTitle,
        subjectSlug: input.subjectSlug,
        subjectTitle: input.subjectTitle,
        title: input.title,
        priceLabel: input.priceLabel,
        coverUrl: input.coverUrl,
        pdfUrl: input.pdfUrl,
        notesPath: input.notesPath,
      })
      .returning();
    return mapBookRow(row);
  }
  return resourcesStore.createBook(input);
}

export async function updateBook(
  id: number,
  input: Partial<Omit<BookRecord, "id">>,
): Promise<BookRecord> {
  if (useDb()) {
    const [row] = await db
      .update(schema.books)
      .set(input)
      .where(eq(schema.books.id, id))
      .returning();
    if (!row) throw ApiError.notFound("Book not found.");
    return mapBookRow(row);
  }
  const updated = resourcesStore.updateBook(id, input);
  if (!updated) throw ApiError.notFound("Book not found.");
  return updated;
}

export async function deleteBook(id: number) {
  if (useDb()) {
    const deleted = await db.delete(schema.books).where(eq(schema.books.id, id)).returning();
    if (deleted.length === 0) throw ApiError.notFound("Book not found.");
    return { deleted: true };
  }
  if (!resourcesStore.deleteBook(id)) throw ApiError.notFound("Book not found.");
  return { deleted: true };
}

/** Store an uploaded PDF and link it to the book (easy per-class book attach). */
export async function attachBookPdf(id: number, filename: string, buffer: Buffer): Promise<BookRecord> {
  await getBook(id);
  const saved = await savePdfUpload(filename, buffer);
  return updateBook(id, { pdfUrl: saved.url });
}
