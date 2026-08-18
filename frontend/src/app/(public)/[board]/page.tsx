import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { apiFetch } from "@/lib/api-client";

type BoardData = {
  slug: string;
  title: string;
  classes: {
    slug: string;
    title: string;
  }[];
};

export default async function BoardPage({
  params,
}: {
  params: Promise<{ board: string }>;
}) {
  const { board } = await params;

  try {
    const data = await apiFetch<BoardData>(`/api/boards/${board}`);

    return (
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: data.title }]} />
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Board</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">{data.title}</h1>
          <p className="mt-3 text-slate-600">Choose a class to continue.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.classes.map((klass) => (
              <Link
                key={klass.slug}
                href={`/${board}/${klass.slug}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-sky-200 hover:bg-sky-50"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Class</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">{klass.title}</h2>
                <p className="mt-2 text-sm text-slate-600">Open subjects and resources</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  } catch {
    notFound();
  }
}
