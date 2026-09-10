import { notFound } from "next/navigation";

import { ChapterPageContent } from "@/components/content/hierarchy-pages";
import { apiFetchOrNull } from "@/lib/api-client";

export const dynamic = "force-dynamic";

type ChapterData = {
  board: { slug: string; title: string } | null;
  class: { slug: string; title: string } | null;
  subject: { slug: string; title: string } | null;
  chapter: {
    slug: string;
    title: string;
    summary: string;
    summaryUr?: string;
    formulas: string[];
    formulasUr?: string[];
    definitions?: { term: string; definition: string; termUr?: string; definitionUr?: string }[];
    videoUrl?: string;
    exercises: { slug: string; title: string }[];
  };
};

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ board: string; classSlug: string; subject: string; chapter: string }>;
}) {
  const { board, classSlug, subject, chapter } = await params;
  const data = await apiFetchOrNull<ChapterData>(
    `/api/boards/${board}/classes/${classSlug}/subjects/${subject}/chapters/${chapter}`,
  );
  if (!data) notFound();

  return (
    <ChapterPageContent
      board={board}
      classSlug={classSlug}
      subject={subject}
      chapter={chapter}
      boardTitle={data.board?.title ?? "Board"}
      classTitle={data.class?.title ?? "Class"}
      subjectTitle={data.subject?.title ?? "Subject"}
      chapterTitle={data.chapter.title}
      summary={data.chapter.summary}
      summaryUr={data.chapter.summaryUr}
      formulas={data.chapter.formulas}
      formulasUr={data.chapter.formulasUr}
      definitions={data.chapter.definitions}
      videoUrl={data.chapter.videoUrl ?? undefined}
      exercises={data.chapter.exercises}
    />
  );
}
