import { notFound } from "next/navigation";
import type { PdfSummary } from "@boardnotes/shared";

import { ExercisePageContent } from "@/components/content/hierarchy-pages";
import { apiFetchOrNull, pdfUrl } from "@/lib/api-client";

type ExerciseData = {
  board: { slug: string; title: string } | null;
  class: { slug: string; title: string } | null;
  subject: { slug: string; title: string } | null;
  chapter: { slug: string; title: string } | null;
  exercise: {
    slug: string;
    title: string;
    questions: { num: number; question: string }[];
  };
};

type QuestionData = {
  question: { pdfName?: string | null };
};

async function findExercisePdfDownloadUrl(
  board: string,
  classSlug: string,
  subject: string,
  chapter: string,
  exercise: string,
  questions: { num: number }[],
) {
  for (const question of questions) {
    const data = await apiFetchOrNull<QuestionData>(
      `/api/boards/${board}/classes/${classSlug}/subjects/${subject}/chapters/${chapter}/exercises/${exercise}/q/${question.num}`,
    );
    const pdfName = data?.question.pdfName;
    if (!pdfName) continue;
    const pdf = await apiFetchOrNull<PdfSummary>(`/api/pdfs/${pdfName}`);
    if (pdf?.url) return pdfUrl(pdf.url);
  }
  return null;
}

export default async function ExercisePage({
  params,
}: {
  params: Promise<{
    board: string;
    classSlug: string;
    subject: string;
    chapter: string;
    exercise: string;
  }>;
}) {
  const { board, classSlug, subject, chapter, exercise } = await params;
  const data = await apiFetchOrNull<ExerciseData>(
    `/api/boards/${board}/classes/${classSlug}/subjects/${subject}/chapters/${chapter}/exercises/${exercise}`,
  );
  if (!data) notFound();

  const questions = data.exercise.questions ?? [];
  const pdfDownloadUrl = await findExercisePdfDownloadUrl(
    board,
    classSlug,
    subject,
    chapter,
    exercise,
    questions,
  );

  return (
    <ExercisePageContent
      board={board}
      classSlug={classSlug}
      subject={subject}
      chapter={chapter}
      exercise={exercise}
      boardTitle={data.board?.title ?? "Board"}
      classTitle={data.class?.title ?? "Class"}
      subjectTitle={data.subject?.title ?? "Subject"}
      chapterTitle={data.chapter?.title ?? "Chapter"}
      exerciseTitle={data.exercise.title}
      questions={questions}
      pdfDownloadUrl={pdfDownloadUrl}
    />
  );
}
