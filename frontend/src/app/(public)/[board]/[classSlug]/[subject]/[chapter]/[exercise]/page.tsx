import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { PdfSummary } from "@/lib/shared-types";

import { ExercisePageContent } from "@/components/content/hierarchy-pages";
import { apiFetchOrNull, pdfUrl } from "@/lib/api-client";

export const dynamic = "force-dynamic";

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

type ChapterData = {
  chapter: {
    slug: string;
    title: string;
    exercises: { slug: string; title: string }[];
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
  const batchSize = 5;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map((q) =>
        apiFetchOrNull<QuestionData>(
          `/api/boards/${board}/classes/${classSlug}/subjects/${subject}/chapters/${chapter}/exercises/${exercise}/q/${q.num}`,
        ),
      ),
    );
    for (const data of results) {
      const pdfName = data?.question.pdfName;
      if (!pdfName) continue;
      const pdf = await apiFetchOrNull<PdfSummary>(`/api/pdfs/${pdfName}`);
      if (pdf?.url) return pdfUrl(pdf.url);
    }
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ board: string; classSlug: string; subject: string; chapter: string; exercise: string }> }): Promise<Metadata> {
  const { board, classSlug, subject, chapter, exercise } = await params;
  const data = await apiFetchOrNull<ExerciseData>(
    `/api/boards/${board}/classes/${classSlug}/subjects/${subject}/chapters/${chapter}/exercises/${exercise}`,
  );
  if (!data) return { title: "Exercise Not Found" };
  const title = `${data.exercise.title} - ${data.chapter?.title ?? ""} | BoardNotes`;
  return {
    title,
    description: `Solved exercise ${data.exercise.title} for ${data.chapter?.title ?? ""}. View questions, download PDFs, and practice with step-by-step solutions.`,
    openGraph: { title, description: `Solved ${data.exercise.title} - step-by-step solutions` },
  };
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

  const [data, chapterData] = await Promise.all([
    apiFetchOrNull<ExerciseData>(
      `/api/boards/${board}/classes/${classSlug}/subjects/${subject}/chapters/${chapter}/exercises/${exercise}`,
    ),
    apiFetchOrNull<ChapterData>(
      `/api/boards/${board}/classes/${classSlug}/subjects/${subject}/chapters/${chapter}`,
    ),
  ]);

  if (!data) notFound();

  const questions = data.exercise.questions ?? [];
  const exercises = chapterData?.chapter.exercises ?? [];

  const pdfDownloadUrl = await findExercisePdfDownloadUrl(
    board, classSlug, subject, chapter, exercise, questions,
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
      exercises={exercises}
    />
  );
}
