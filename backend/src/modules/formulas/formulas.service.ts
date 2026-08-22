import { eq } from "drizzle-orm";

import { cmsStore } from "../../store/cms-store.js";
import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";

export type FormulaChapter = {
  boardSlug: string;
  classSlug: string;
  subjectSlug: string;
  chapterSlug: string;
  boardTitle: string;
  classTitle: string;
  subjectTitle: string;
  chapterTitle: string;
  formulas: string[];
  formulasUr?: string[];
};

export async function listFormulaSheets(): Promise<FormulaChapter[]> {
  if (useDb()) {
    const rows = await db.query.chapters.findMany({
      where: eq(schema.chapters.status, "published"),
      with: {
        subject: { with: { class: { with: { board: true } } } },
      },
    });
    return rows
      .filter((row) => row.formulas.length > 0)
      .map((row) => ({
        boardSlug: row.subject.class.board.slug,
        classSlug: row.subject.class.slug,
        subjectSlug: row.subject.slug,
        chapterSlug: row.slug,
        boardTitle: row.subject.class.board.title,
        classTitle: row.subject.class.title,
        subjectTitle: row.subject.title,
        chapterTitle: row.title,
        formulas: row.formulas,
        formulasUr: row.formulasUr,
      }));
  }

  return cmsStore
    .listChaptersAdmin()
    .filter((chapter) => chapter.status === "published" && chapter.formulas.length > 0)
    .map((chapter) => ({
      boardSlug: chapter.boardSlug,
      classSlug: chapter.classSlug,
      subjectSlug: chapter.subjectSlug,
      chapterSlug: chapter.slug,
      boardTitle: chapter.boardTitle,
      classTitle: chapter.classTitle,
      subjectTitle: chapter.subjectTitle,
      chapterTitle: chapter.title,
      formulas: chapter.formulas,
      formulasUr: chapter.formulasUr,
    }));
}
