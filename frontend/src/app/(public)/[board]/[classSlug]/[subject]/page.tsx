import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { apiFetchOrNull } from "@/lib/api-client";

type SubjectData = {
  board: { slug: string; title: string } | null;
  class: { slug: string; title: string } | null;
  subject: {
    slug: string;
    title: string;
    chapters: {
      slug: string;
      title: string;
      summary: string;
    }[];
  };
};

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ board: string; classSlug: string; subject: string }>;
}) {
  const { board, classSlug, subject } = await params;
  const data = await apiFetchOrNull<SubjectData>(
    `/api/boards/${board}/classes/${classSlug}/subjects/${subject}`,
  );

  if (!data) notFound();

  return (
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: data.board?.title ?? "Board", href: `/${board}` },
            { label: data.class?.title ?? "Class", href: `/${board}/${classSlug}` },
            { label: data.subject.title },
          ]}
        />
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Subject</p>
              <h1 className="mt-3 text-3xl font-black text-slate-900">{data.subject.title}</h1>
            </div>
            <div className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">
              Session 2026–2027
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {['SLO-aligned', 'Exam-focused', 'Stepwise solutions', 'PDF notes'].map((tag) => (
              <span key={tag} className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {data.subject.chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                href={`/${board}/${classSlug}/${subject}/${chapter.slug}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-sky-200 hover:bg-sky-50"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Chapter</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">{chapter.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{chapter.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
}
