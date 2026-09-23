import { notFound } from "next/navigation";
import type { PdfSummary } from "@/lib/shared-types";

import { QuestionPageView } from "@/components/content/question-page-view";
import { apiFetchOrNull } from "@/lib/api-client";
import { boardDisplayTitle } from "@/lib/constants";

export const dynamic = "force-dynamic";

type QuestionData = {
  board: { slug: string; title: string } | null;
  class: { slug: string; title: string } | null;
  subject: { slug: string; title: string } | null;
  chapter: { slug: string; title: string } | null;
  exercise: { slug: string; title: string; questions?: { num: number }[] } | null;
  question: {
    num: number;
    question: string;
    marks: number;
    difficulty: string;
    pdfName: string;
    steps: { title: string; content: string }[];
  };
};

export default async function QuestionPage({
  params,
}: {
  params: Promise<{
    board: string;
    classSlug: string;
    subject: string;
    chapter: string;
    exercise: string;
    questionNum: string;
  }>;
}) {
  const { board, classSlug, subject, chapter, exercise, questionNum } = await params;
  const data = await apiFetchOrNull<QuestionData>(
    `/api/boards/${board}/classes/${classSlug}/subjects/${subject}/chapters/${chapter}/exercises/${exercise}/q/${questionNum}`,
  );
  if (!data) notFound();

  let pdfData: PdfSummary | null = null;
  if (data.question.pdfName) {
    pdfData = await apiFetchOrNull<PdfSummary>(`/api/pdfs/${data.question.pdfName}`);
  }

  const pagePath = `/${board}/${classSlug}/${subject}/${chapter}/${exercise}/q/${questionNum}`;
  const pageTitle = `${data.exercise?.title ?? "Exercise"} — Question ${data.question.num}`;
  const questionRef = `${data.chapter?.title ?? chapter} / ${data.exercise?.title ?? exercise} / Q${data.question.num}`;
  const classNum = parseInt(classSlug, 10) || 0;

  return (
    <QuestionPageView
      board={board}
      classSlug={classSlug}
      subject={subject}
      chapter={chapter}
      exercise={exercise}
      boardTitle={boardDisplayTitle(data.board?.title ?? "Board", board, classNum)}
      classTitle={data.class?.title ?? "Class"}
      subjectTitle={data.subject?.title ?? "Subject"}
      chapterTitle={data.chapter?.title ?? "Chapter"}
      exerciseTitle={data.exercise?.title ?? "Exercise"}
      question={data.question}
      questions={data.exercise?.questions ?? []}
      pdfData={pdfData}
      pagePath={pagePath}
      pageTitle={pageTitle}
      questionRef={questionRef}
    />
  );
}
