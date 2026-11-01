import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import { ClassPageContent } from "@/components/content/hierarchy-pages";
import { apiFetchOrNull } from "@/lib/api-client";
import { boardDisplayTitle, sortSubjects } from "@/lib/constants";

export const dynamic = "force-dynamic";

type ClassData = {
  board: { slug: string; title: string } | null;
  class: {
    slug: string;
    title: string;
    subjects: { slug: string; title: string; chapters?: unknown[]; chapterCount?: number }[];
  } | null;
};

type BookSummary = { subjectSlug: string | null; subjectTitle: string | null; pdfUrl: string | null };

export async function generateMetadata({ params }: { params: Promise<{ board: string; classSlug: string }> }): Promise<Metadata> {
  const { board, classSlug } = await params;
  const data = await apiFetchOrNull<ClassData>(`/api/boards/${board}/classes/${classSlug}`);
  if (!data?.class) return { title: "Class Not Found" };
  const classNum = parseInt(classSlug, 10) || 0;
  const boardTitle = boardDisplayTitle(data.board?.title ?? "Board", board, classNum);
  return {
    title: `${data.class.title} - ${boardTitle} | BoardNotes`,
    description: `Browse all subjects for ${data.class.title} under ${boardTitle}. Notes, textbooks, past papers, and solved exercises.`,
    openGraph: { title: `${data.class.title} - ${boardTitle} | BoardNotes`, description: `Study materials for ${data.class.title}` },
  };
}

export default async function ClassPage({
  params,
  searchParams,
}: {
  params: Promise<{ board: string; classSlug: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const { board, classSlug } = await params;
  const { view } = await searchParams;
  const data = await apiFetchOrNull<ClassData>(`/api/boards/${board}/classes/${classSlug}`);
  const klass = data?.class;
  if (!data || !klass) notFound();

  const books = await apiFetchOrNull<BookSummary[]>(`/api/books?board=${board}&class=${classSlug}`);

  // Client 123.pdf: Past Papers are not part of Books & Notes pages.
  // Deep links with ?view=past-papers redirect to the dedicated archive.
  if (view === "past-papers") {
    redirect(`/past-papers?board=${encodeURIComponent(board)}&class=${encodeURIComponent(classSlug)}`);
  }

  return (
    <ClassPageContent
      board={board}
      classSlug={classSlug}
      boardTitle={data.board?.title ?? "Board"}
      classTitle={klass.title}
      subjects={sortSubjects(
        klass.subjects.map((subject) => ({
          slug: subject.slug,
          title: subject.title,
          chapterCount:
            typeof subject.chapterCount === "number"
              ? subject.chapterCount
              : Array.isArray(subject.chapters)
                ? subject.chapters.length
                : 0,
        })),
      )}
      initialView={view === "books" ? "books" : "notes"}
      books={books ?? []}
    />
  );
}
