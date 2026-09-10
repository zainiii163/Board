import { notFound } from "next/navigation";

import { ClassPageContent } from "@/components/content/hierarchy-pages";
import { apiFetchOrNull } from "@/lib/api-client";

export const dynamic = "force-dynamic";

type ClassData = {
  board: { slug: string; title: string } | null;
  class: { slug: string; title: string; subjects: { slug: string; title: string }[] } | null;
};

export default async function ClassPage({
  params,
}: {
  params: Promise<{ board: string; classSlug: string }>;
}) {
  const { board, classSlug } = await params;
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
    />
  );
}
