import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { memoryStore } from "../../store/memory-store.js";
import { ApiError } from "../../utils/api-error.js";
import { notifyAdmin } from "../../utils/mail.js";

export type ReportRecord = {
  id: number;
  pageUrl: string;
  boardSlug: string | null;
  questionRef: string | null;
  message: string;
  status: "open" | "resolved";
  createdAt: string;
};

function mapReport(row: {
  id: number;
  pageUrl: string;
  boardSlug: string | null;
  questionRef: string | null;
  message: string;
  status: "open" | "resolved";
  createdAt: Date | null;
}): ReportRecord {
  return {
    id: row.id,
    pageUrl: row.pageUrl,
    boardSlug: row.boardSlug,
    questionRef: row.questionRef,
    message: row.message,
    status: row.status,
    createdAt: (row.createdAt ?? new Date()).toISOString(),
  };
}

function notifyReport(input: {
  pageUrl: string;
  boardSlug?: string;
  questionRef?: string;
  message: string;
}) {
  void notifyAdmin({
    subject: `[BoardNotes] Mistake report — ${input.questionRef ?? input.pageUrl}`,
    text: `Page: ${input.pageUrl}\nBoard: ${input.boardSlug ?? "—"}\nRef: ${input.questionRef ?? "—"}\n\n${input.message}`,
  }).catch((err) => console.error("Report notify failed", err));
}

export async function listReports(): Promise<ReportRecord[]> {
  if (useDb()) {
    const rows = await db.query.reports.findMany({
      orderBy: (r, { desc }) => [desc(r.createdAt)],
    });
    return rows.map(mapReport);
  }
  return memoryStore.reports.list();
}

export async function createReport(input: {
  pageUrl: string;
  boardSlug?: string;
  questionRef?: string;
  message: string;
}): Promise<ReportRecord> {
  const message = input.message.trim();
  const pageUrl = input.pageUrl.trim();

  if (!pageUrl) throw ApiError.badRequest("Page URL is required.");
  if (message.length < 10) throw ApiError.badRequest("Please describe the issue in at least 10 characters.");

  if (useDb()) {
    const [created] = await db
      .insert(schema.reports)
      .values({
        pageUrl,
        boardSlug: input.boardSlug ?? null,
        questionRef: input.questionRef ?? null,
        message,
      })
      .returning();
    const record = mapReport(created);
    notifyReport({ pageUrl, boardSlug: input.boardSlug, questionRef: input.questionRef, message });
    return record;
  }

  const record = memoryStore.reports.create({
    pageUrl,
    boardSlug: input.boardSlug ?? null,
    questionRef: input.questionRef ?? null,
    message,
  });
  notifyReport({ pageUrl, boardSlug: input.boardSlug, questionRef: input.questionRef, message });
  return record;
}

export async function resolveReport(id: number): Promise<ReportRecord | null> {
  if (useDb()) {
    const [updated] = await db
      .update(schema.reports)
      .set({ status: "resolved" })
      .where(eq(schema.reports.id, id))
      .returning();
    return updated ? mapReport(updated) : null;
  }
  return memoryStore.reports.resolve(id);
}
