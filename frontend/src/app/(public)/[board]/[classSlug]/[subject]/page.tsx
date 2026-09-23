import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { SubjectPageContent } from "@/components/content/hierarchy-pages";
import { apiFetchOrNull } from "@/lib/api-client";

export const dynamic = "force-dynamic";

type ExerciseSummary = { slug: string; title: string };
type ChapterSummary = { slug: string; title: string; summary: string; summaryUr?: string; exercises?: ExerciseSummary[] };

type SubjectData = {
  board: { slug: string; title: string } | null;
  class: { slug: string; title: string } | null;
  subject: {
    slug: string;
    title: string;
    chapters: ChapterSummary[];
  };
};

type AuthorSummary = { slug: string; name: string };

export async function generateMetadata({ params }: { params: Promise<{ board: string; classSlug: string; subject: string }> }): Promise<Metadata> {
  const { board, classSlug, subject } = await params;
  const data = await apiFetchOrNull<SubjectData>(`/api/boards/${board}/classes/${classSlug}/subjects/${subject}`);
  if (!data) return { title: "Subject Not Found" };
  const title = `${data.subject.title} - ${data.class?.title ?? ""} | BoardNotes`;
  return {
    title,
    description: `Chapter-wise notes, exercises, and solutions for ${data.subject.title} (${data.class?.title ?? ""}). SLO-aligned, exam-focused study material.`,
    openGraph: { title, description: `Free study notes for ${data.subject.title}` },
  };
}

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
