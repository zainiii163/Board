import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BoardPageContent } from "@/components/content/hierarchy-pages";
import { apiFetchOrNull } from "@/lib/api-client";

export const dynamic = "force-dynamic";

type BoardSubject = { slug: string; title: string; chapters?: { slug: string }[] };
type BoardClass = { slug: string; title: string; subjects?: BoardSubject[] };

type BoardData = {
  slug: string;
  title: string;
  classes: BoardClass[];
};

export async function generateMetadata({ params }: { params: Promise<{ board: string }> }): Promise<Metadata> {
  const { board } = await params;
  const data = await apiFetchOrNull<BoardData>(`/api/boards/${board}`);
  if (!data) return { title: "Board Not Found" };
  return {
    title: `${data.title} - All Classes | BoardNotes`,
    description: `Explore all classes under ${data.title} on BoardNotes. Access textbooks, notes, past papers, and solved exercises.`,
    openGraph: { title: `${data.title} | BoardNotes`, description: `Browse classes for ${data.title}` },
  };
}

export default async function BoardPage({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  const data = await apiFetchOrNull<BoardData>(`/api/boards/${board}`);
  if (!data) notFound();

  const classes = data.classes.map((klass) => ({
    slug: klass.slug,
    title: klass.title,
    subjects: (klass.subjects ?? []).map((s) => ({ slug: s.slug, title: s.title })),
  }));

  return <BoardPageContent board={board} title={data.title} classes={classes} />;
}
