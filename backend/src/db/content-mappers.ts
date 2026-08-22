import type { ContentStatus } from "@boardnotes/shared";

import type { CmsChapterRecord, CmsExerciseRecord, CmsQuestionRecord } from "../store/cms-store.js";

type ChapterRow = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  summaryUr: string | null;
  formulas: string[];
  formulasUr: string[];
  definitions?: { term: string; definition: string; termUr?: string; definitionUr?: string }[];
  videoUrl: string | null;
  status: ContentStatus;
  exercises: { id: number }[];
  subject: {
    slug: string;
    title: string;
    class: {
      slug: string;
      title: string;
      board: { slug: string; title: string };
    };
  };
};

export function mapChapterRow(row: ChapterRow): CmsChapterRecord {
  return {
    id: row.id,
    boardSlug: row.subject.class.board.slug,
    boardTitle: row.subject.class.board.title,
    classSlug: row.subject.class.slug,
    classTitle: row.subject.class.title,
    subjectSlug: row.subject.slug,
    subjectTitle: row.subject.title,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    summaryUr: row.summaryUr ?? undefined,
    formulas: row.formulas ?? [],
    formulasUr: row.formulasUr ?? [],
    definitions: row.definitions ?? [],
    videoUrl: row.videoUrl ?? undefined,
    status: row.status ?? "published",
    exerciseCount: row.exercises.length,
  };
}

export function mapExerciseRow(
  row: { id: number; slug: string; title: string; chapterId: number },
  questionCount: number,
): CmsExerciseRecord {
  return {
    id: row.id,
    chapterId: row.chapterId,
    slug: row.slug,
    title: row.title,
    questionCount,
  };
}

export function mapQuestionRow(
  row: {
    id: number;
    exerciseId: number;
    num: number;
    questionText: string;
    questionTextUr: string | null;
    marks: number;
    difficulty: string;
    pdfName: string | null;
    stepsUr: { title: string; content: string }[];
  },
  steps: { title: string; content: string }[],
): CmsQuestionRecord {
  return {
    id: row.id,
    exerciseId: row.exerciseId,
    num: row.num,
    questionText: row.questionText,
    questionTextUr: row.questionTextUr ?? undefined,
    marks: row.marks,
    difficulty: row.difficulty,
    pdfName: row.pdfName,
    steps,
    stepsUr: row.stepsUr?.length ? row.stepsUr : undefined,
  };
}
