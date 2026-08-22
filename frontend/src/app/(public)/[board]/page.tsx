import { notFound } from "next/navigation";

import { BoardPageContent } from "@/components/content/hierarchy-pages";
import { apiFetchOrNull } from "@/lib/api-client";

type BoardData = {
  slug: string;
  title: string;
  classes: { slug: string; title: string }[];
};

export default async function BoardPage({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  const data = await apiFetchOrNull<BoardData>(`/api/boards/${board}`);
  if (!data) notFound();

  return <BoardPageContent board={board} title={data.title} classes={data.classes} />;
}
