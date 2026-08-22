import { notFound } from "next/navigation";

import { SubjectPageContent } from "@/components/content/hierarchy-pages";
import { apiFetchOrNull } from "@/lib/api-client";

type SubjectData = {
  board: { slug: string; title: string } | null;
  class: { slug: string; title: string } | null;
  subject: {
    slug: string;
    title: string;
    chapters: { slug: string; title: string; summary: string; summaryUr?: string }[];
  };
};

type AuthorSummary = { slug: string; name: string };

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ board: string; classSlug: string; subject: string }>;
}) {
  const { board, classSlug, subject } = await params;
  const [data, authors] = await Promise.all([
    apiFetchOrNull<SubjectData>(`/api/boards/${board}/classes/${classSlug}/subjects/${subject}`),
    apiFetchOrNull<AuthorSummary[]>("/api/authors"),
  ]);
  if (!data) notFound();

  return (
    <SubjectPageContent
      board={board}
      classSlug={classSlug}
      subject={subject}
      boardTitle={data.board?.title ?? "Board"}
      classTitle={data.class?.title ?? "Class"}
      subjectTitle={data.subject.title}
      chapters={data.subject.chapters}
      authors={authors ?? []}
    />
  );
}
