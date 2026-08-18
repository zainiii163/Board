import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { apiFetchOrNull } from "@/lib/api-client";

type ChapterData = {
  board: { slug: string; title: string } | null;
  class: { slug: string; title: string } | null;
  subject: { slug: string; title: string } | null;
  chapter: {
    slug: string;
    title: string;
    summary: string;
    formulas: string[];
    exercises: { slug: string; title: string }[];
  };
};

export default async function ChapterPage({
  params,
}: {
  params: Promise<{
    board: string;
    classSlug: string;
    subject: string;
    chapter: string;
  }>;
}) {
  const { board, classSlug, subject, chapter } = await params;
  const data = await apiFetchOrNull<ChapterData>(
    `/api/boards/${board}/classes/${classSlug}/subjects/${subject}/chapters/${chapter}`,
  );

  if (!data) notFound();

  return (
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: data.board?.title ?? "Board", href: `/${board}` },
            { label: data.class?.title ?? "Class", href: `/${board}/${classSlug}` },
            { label: data.subject?.title ?? "Subject", href: `/${board}/${classSlug}/${subject}` },
            { label: data.chapter.title },
          ]}
        />

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Chapter</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">{data.chapter.title}</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">{data.chapter.summary}</p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">Key formulas</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                {data.chapter.formulas.map((formula) => (
                  <li key={formula} className="flex gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-sky-600" />
                    <span>{formula}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">Exercises</h2>
              <div className="mt-4 space-y-3">
                {data.chapter.exercises.map((exercise) => (
                  <Link
                    key={exercise.slug}
                    href={`/${board}/${classSlug}/${subject}/${chapter}/${exercise.slug}`}
                    className="block rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
                  >
                    {exercise.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}
