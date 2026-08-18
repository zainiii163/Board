import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { apiFetch } from "@/lib/api-client";

type ClassData = {
  board: { slug: string; title: string } | null;
  class: {
    slug: string;
    title: string;
    subjects: {
      slug: string;
      title: string;
    }[];
  } | null;
};

export default async function ClassPage({
  params,
}: {
  params: Promise<{ board: string; classSlug: string }>;
}) {
  const { board, classSlug } = await params;

  try {
    const data = await apiFetch<ClassData>(`/api/boards/${board}/classes/${classSlug}`);

    const boardTitle = data.board?.title ?? "Board";
    const klass = data.class;

    if (!klass) throw new Error("Class unavailable");

    return (
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: boardTitle, href: `/${board}` },
            { label: klass.title },
          ]}
        />
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Class</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">{klass.title}</h1>
          <p className="mt-3 text-slate-600">{boardTitle} • Choose a subject to continue.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {klass.subjects.map((subject) => (
              <Link
                key={subject.slug}
                href={`/${board}/${classSlug}/${subject.slug}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-sky-200 hover:bg-sky-50"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Subject</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">{subject.title}</h2>
                <p className="mt-2 text-sm text-slate-600">Open chapters and notes</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Notes</p>
              <p className="mt-2 font-semibold text-slate-900">Concept summaries</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Books</p>
              <p className="mt-2 font-semibold text-slate-900">Textbook links</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Past Papers</p>
              <p className="mt-2 font-semibold text-slate-900">Solved paper sets</p>
            </div>
          </div>
        </div>
      </section>
    );
  } catch {
    notFound();
  }
}
