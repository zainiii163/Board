import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ClassPageContent } from "@/components/content/hierarchy-pages";
import { apiFetchOrNull } from "@/lib/api-client";

export const dynamic = "force-dynamic";

type ClassData = {
  board: { slug: string; title: string } | null;
  class: { slug: string; title: string; subjects: { slug: string; title: string }[] } | null;
};

export async function generateMetadata({ params }: { params: Promise<{ board: string; classSlug: string }> }): Promise<Metadata> {
  const { board, classSlug } = await params;
  const data = await apiFetchOrNull<ClassData>(`/api/boards/${board}/classes/${classSlug}`);
  if (!data?.class) return { title: "Class Not Found" };
  const boardTitle = data.board?.title ?? "Board";
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

  return (
    <ClassPageContent
      board={board}
      classSlug={classSlug}
      boardTitle={data.board?.title ?? "Board"}
      classTitle={klass.title}
      subjects={klass.subjects}
      initialView={view === "books" ? "books" : "notes"}
    />
  );
}
