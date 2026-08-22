import { eq, and } from "drizzle-orm";

import { cmsStore } from "../../store/cms-store.js";
import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { getAuthorBySlug as getAuthor, listAuthors } from "../authors/authors.service.js";
import { ApiError } from "../../utils/api-error.js";

export type ProgressEntry = {
  subjectKey: string;
  subjectLabel: string;
  visitedChapters: string[];
  totalChapters: number;
  percent: number;
  lastPath: string;
  lastLabel: string;
  updatedAt: string;
};

type MemoryProgress = {
  userId: number;
  subjectKey: string;
  subjectLabel: string;
  visitedChapters: Set<string>;
  totalChapters: number;
  lastPath: string;
  lastLabel: string;
  updatedAt: string;
};

const progressMap = new Map<string, MemoryProgress>();

function mapKey(userId: number, subjectKey: string) {
  return `${userId}:${subjectKey}`;
}

function toEntry(row: {
  subjectKey: string;
  subjectLabel: string;
  visitedChapters: string[];
  totalChapters: number;
  lastPath: string;
  lastLabel: string;
  updatedAt: string;
}): ProgressEntry {
  const visited = row.visitedChapters;
  const total = row.totalChapters || 1;
  return {
    subjectKey: row.subjectKey,
    subjectLabel: row.subjectLabel,
    visitedChapters: visited,
    totalChapters: total,
    percent: Math.min(100, Math.round((visited.length / total) * 100)),
    lastPath: row.lastPath,
    lastLabel: row.lastLabel,
    updatedAt: row.updatedAt,
  };
}

async function countSubjectChapters(subjectKey: string) {
  const [boardSlug, classSlug, subjectSlug] = subjectKey.split("/");
  if (useDb()) {
    const subject = await db.query.subjects.findFirst({
      where: eq(schema.subjects.slug, subjectSlug),
      with: {
        class: { with: { board: true } },
        chapters: true,
      },
    });
    if (!subject || subject.class.slug !== classSlug || subject.class.board.slug !== boardSlug) {
      return 0;
    }
    return subject.chapters.filter((c) => c.status === "published").length;
  }
  return cmsStore.listChaptersAdmin().filter(
    (c) =>
      c.boardSlug === boardSlug &&
      c.classSlug === classSlug &&
      c.subjectSlug === subjectSlug &&
      c.status === "published",
  ).length;
}

export async function trackVisit(
  userId: number,
  input: { subjectKey: string; chapterSlug: string; path: string; label: string },
) {
  const { subjectKey, chapterSlug, path, label } = input;
  if (!subjectKey || !chapterSlug || !path) {
    throw ApiError.badRequest("subjectKey, chapterSlug, and path are required.");
  }

  const totalChapters = await countSubjectChapters(subjectKey);
  const subjectLabel = label.split(" → ")[0] ?? subjectKey;
  const now = new Date().toISOString();

  if (useDb()) {
    const existing = await db.query.userProgress.findFirst({
      where: and(
        eq(schema.userProgress.userId, userId),
        eq(schema.userProgress.subjectKey, subjectKey),
      ),
    });

    const visited = new Set(existing?.visitedChapters ?? []);
    visited.add(chapterSlug);

    if (existing) {
      const [row] = await db
        .update(schema.userProgress)
        .set({
          subjectLabel,
          visitedChapters: [...visited],
          totalChapters,
          lastPath: path,
          lastLabel: label,
          updatedAt: new Date(),
        })
        .where(eq(schema.userProgress.id, existing.id))
        .returning();
      return toEntry({
        subjectKey: row.subjectKey,
        subjectLabel: row.subjectLabel,
        visitedChapters: row.visitedChapters,
        totalChapters: row.totalChapters,
        lastPath: row.lastPath,
        lastLabel: row.lastLabel,
        updatedAt: row.updatedAt.toISOString(),
      });
    }

    const [row] = await db
      .insert(schema.userProgress)
      .values({
        userId,
        subjectKey,
        subjectLabel,
        visitedChapters: [chapterSlug],
        totalChapters,
        lastPath: path,
        lastLabel: label,
      })
      .returning();
    return toEntry({
      subjectKey: row.subjectKey,
      subjectLabel: row.subjectLabel,
      visitedChapters: row.visitedChapters,
      totalChapters: row.totalChapters,
      lastPath: row.lastPath,
      lastLabel: row.lastLabel,
      updatedAt: row.updatedAt.toISOString(),
    });
  }

  const key = mapKey(userId, subjectKey);
  const existing = progressMap.get(key);
  const row: MemoryProgress = existing ?? {
    userId,
    subjectKey,
    subjectLabel,
    visitedChapters: new Set(),
    totalChapters,
    lastPath: path,
    lastLabel: label,
    updatedAt: now,
  };

  row.visitedChapters.add(chapterSlug);
  row.totalChapters = totalChapters;
  row.lastPath = path;
  row.lastLabel = label;
  row.updatedAt = now;
  progressMap.set(key, row);
  return toEntry({
    subjectKey: row.subjectKey,
    subjectLabel: row.subjectLabel,
    visitedChapters: [...row.visitedChapters],
    totalChapters: row.totalChapters,
    lastPath: row.lastPath,
    lastLabel: row.lastLabel,
    updatedAt: row.updatedAt,
  });
}

export async function getProgress(userId: number): Promise<ProgressEntry[]> {
  if (useDb()) {
    const rows = await db.query.userProgress.findMany({
      where: eq(schema.userProgress.userId, userId),
      orderBy: (progress, { desc }) => [desc(progress.updatedAt)],
    });
    return rows.map((row) =>
      toEntry({
        subjectKey: row.subjectKey,
        subjectLabel: row.subjectLabel,
        visitedChapters: row.visitedChapters,
        totalChapters: row.totalChapters,
        lastPath: row.lastPath,
        lastLabel: row.lastLabel,
        updatedAt: row.updatedAt.toISOString(),
      }),
    );
  }
  return [...progressMap.values()]
    .filter((r) => r.userId === userId)
    .map((row) =>
      toEntry({
        subjectKey: row.subjectKey,
        subjectLabel: row.subjectLabel,
        visitedChapters: [...row.visitedChapters],
        totalChapters: row.totalChapters,
        lastPath: row.lastPath,
        lastLabel: row.lastLabel,
        updatedAt: row.updatedAt,
      }),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getAuthors() {
  return listAuthors();
}

export function getAuthorBySlug(slug: string) {
  return getAuthor(slug);
}

export type FlashcardProgressRecord = {
  chapterKey: string;
  masteredIndices: number[];
  updatedAt: string;
};

const flashcardMemory = new Map<string, { indices: Set<number>; updatedAt: string }>();

function flashcardMemoryKey(userId: number, chapterKey: string) {
  return `${userId}:${chapterKey}`;
}

export async function getFlashcardProgress(
  userId: number,
  chapterKey: string,
): Promise<FlashcardProgressRecord> {
  if (!chapterKey.trim()) throw ApiError.badRequest("chapterKey is required.");

  if (useDb()) {
    const row = await db.query.flashcardProgress.findFirst({
      where: and(
        eq(schema.flashcardProgress.userId, userId),
        eq(schema.flashcardProgress.chapterKey, chapterKey),
      ),
    });
    if (!row) {
      return { chapterKey, masteredIndices: [], updatedAt: new Date().toISOString() };
    }
    return {
      chapterKey: row.chapterKey,
      masteredIndices: [...row.masteredIndices].sort((a, b) => a - b),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  const stored = flashcardMemory.get(flashcardMemoryKey(userId, chapterKey));
  return {
    chapterKey,
    masteredIndices: stored ? [...stored.indices].sort((a, b) => a - b) : [],
    updatedAt: stored?.updatedAt ?? new Date().toISOString(),
  };
}

export async function updateFlashcardProgress(
  userId: number,
  input: { chapterKey: string; cardIndex: number; mastered: boolean },
): Promise<FlashcardProgressRecord> {
  const chapterKey = input.chapterKey.trim();
  if (!chapterKey) throw ApiError.badRequest("chapterKey is required.");
  if (!Number.isInteger(input.cardIndex) || input.cardIndex < 0) {
    throw ApiError.badRequest("cardIndex must be a non-negative integer.");
  }

  const existing = await getFlashcardProgress(userId, chapterKey);
  const indices = new Set(existing.masteredIndices);
  if (input.mastered) indices.add(input.cardIndex);
  else indices.delete(input.cardIndex);
  const masteredIndices = [...indices].sort((a, b) => a - b);
  const now = new Date();

  if (useDb()) {
    const row = await db.query.flashcardProgress.findFirst({
      where: and(
        eq(schema.flashcardProgress.userId, userId),
        eq(schema.flashcardProgress.chapterKey, chapterKey),
      ),
    });

    if (row) {
      const [updated] = await db
        .update(schema.flashcardProgress)
        .set({ masteredIndices, updatedAt: now })
        .where(eq(schema.flashcardProgress.id, row.id))
        .returning();
      return {
        chapterKey: updated.chapterKey,
        masteredIndices: updated.masteredIndices,
        updatedAt: updated.updatedAt.toISOString(),
      };
    }

    const [created] = await db
      .insert(schema.flashcardProgress)
      .values({ userId, chapterKey, masteredIndices })
      .returning();
    return {
      chapterKey: created.chapterKey,
      masteredIndices: created.masteredIndices,
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  flashcardMemory.set(flashcardMemoryKey(userId, chapterKey), {
    indices,
    updatedAt: now.toISOString(),
  });
  return {
    chapterKey,
    masteredIndices,
    updatedAt: now.toISOString(),
  };
}
