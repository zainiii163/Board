import { createRequire } from "node:module";
import type { Response } from "express";
import { eq } from "drizzle-orm";

import { getChapterBySlug } from "../../demo-data.js";
import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { readPdfBuffer } from "../../store/pdf-store.js";
import { ApiError } from "../../utils/api-error.js";

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-require-imports
const archiver = require("archiver") as (
  format: "zip",
  options?: { zlib?: { level: number } },
) => import("archiver").Archiver;

export type ChapterZipInfo = {
  chapterTitle: string;
  pdfCount: number;
  filenames: string[];
  downloadPath: string;
};

function uniqueFilenames(names: (string | null | undefined)[]) {
  return [...new Set(names.filter((name): name is string => Boolean(name?.trim())))];
}

async function collectChapterPdfNames(
  boardSlug: string,
  classSlug: string,
  subjectSlug: string,
  chapterSlug: string,
): Promise<{ title: string; filenames: string[] } | null> {
  if (useDb()) {
    const chapter = await db.query.chapters.findFirst({
      where: eq(schema.chapters.slug, chapterSlug),
      with: {
        subject: { with: { class: { with: { board: true } } } },
        exercises: { with: { questions: true } },
      },
    });
    if (
      !chapter ||
      chapter.status !== "published" ||
      chapter.subject.slug !== subjectSlug ||
      chapter.subject.class.slug !== classSlug ||
      chapter.subject.class.board.slug !== boardSlug
    ) {
      return null;
    }
    const filenames = uniqueFilenames(
      chapter.exercises.flatMap((exercise) => exercise.questions.map((q) => q.pdfName)),
    );
    return { title: chapter.title, filenames };
  }

  const chapter = getChapterBySlug(boardSlug, classSlug, subjectSlug, chapterSlug);
  if (!chapter) return null;
  const filenames = uniqueFilenames(
    chapter.exercises.flatMap((exercise) => exercise.questions.map((q) => q.pdfName)),
  );
  return { title: chapter.title, filenames };
}

export async function getChapterZipInfo(
  boardSlug: string,
  classSlug: string,
  subjectSlug: string,
  chapterSlug: string,
): Promise<ChapterZipInfo> {
  const collected = await collectChapterPdfNames(boardSlug, classSlug, subjectSlug, chapterSlug);
  if (!collected) throw ApiError.notFound("Chapter not found.");

  const available: string[] = [];
  for (const filename of collected.filenames) {
    const buffer = await readPdfBuffer(filename);
    if (buffer) available.push(filename);
  }

  return {
    chapterTitle: collected.title,
    pdfCount: available.length,
    filenames: available,
    downloadPath: `/api/boards/${boardSlug}/classes/${classSlug}/subjects/${subjectSlug}/chapters/${chapterSlug}/zip`,
  };
}

export async function streamChapterZip(
  boardSlug: string,
  classSlug: string,
  subjectSlug: string,
  chapterSlug: string,
  res: Response,
) {
  const info = await getChapterZipInfo(boardSlug, classSlug, subjectSlug, chapterSlug);
  if (info.pdfCount === 0) {
    throw ApiError.notFound("No PDF files available for this chapter yet.");
  }

  const safeSlug = chapterSlug.replace(/[^a-z0-9-_]/gi, "-").toLowerCase();
  const zipName = `${safeSlug}-pdfs.zip`;

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="${zipName}"`);

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.on("error", (error: Error) => {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.destroy(error);
    }
  });
  archive.pipe(res);

  for (const filename of info.filenames) {
    const buffer = await readPdfBuffer(filename);
    if (buffer) archive.append(buffer, { name: filename });
  }

  await archive.finalize();
}
