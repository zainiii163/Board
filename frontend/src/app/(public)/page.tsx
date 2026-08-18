import Link from "next/link";

import { apiFetch } from "@/lib/api-client";

async function getBoards() {
  try {
    return await apiFetch<{ slug: string; title: string }[]>("/api/boards");
  } catch {
    return [];
  }
}

const latestNotes = [
  {
    title: "Real Numbers",
    subject: "Mathematics",
    board: "FBISE",
    className: "Class 9",
    description: "Quick concept recap and worked examples for rational and irrational numbers.",
  },
  {
    title: "Quadratic Equations",
    subject: "Mathematics",
    board: "Punjab",
    className: "Class 10",
    description: "Stepwise methods with solved questions for exam preparation.",
  },
  {
    title: "Chemical Bonding",
    subject: "Chemistry",
    board: "KPK",
    className: "Class 9",
    description: "Foundation-level explanations with easy-to-remember examples.",
  },
  {
    title: "Pakistan Studies",
    subject: "Social Studies",
    board: "Sindh",
    className: "Class 10",
    description: "Concise chapter summaries built for last-minute revision.",
  },
];

export default async function HomePage() {
  const boards = await getBoards();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 px-6 py-10 text-white shadow-xl sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
              Free study resources
            </p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              BoardNotes — Free board-study notes, solved exercises, and PDFs
            </h1>
            <p className="mt-4 max-w-xl text-base text-sky-100 sm:text-lg">
              Explore solutions, notes, and exam-ready summaries across major boards.
            </p>
            <form action="/search" method="get" className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <input
                  name="q"
                  aria-label="Search content"
                  placeholder="Search notes, chapters, exercises..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-sky-100 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
              >
                Search
              </button>
            </form>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-100">
              Popular path
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-white/10 px-3 py-2 text-sm">FBISE → Class 9 → Mathematics</div>
              <div className="rounded-xl bg-white/10 px-3 py-2 text-sm">Real Numbers → Exercise 1.1 → Q3</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Boards</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {boards.map((board) => {
            const isFBISE = board.slug === "fbise";
            const card = (
              <div
                key={board.slug}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                      Board
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-slate-900">{board.title}</h3>
                  </div>
                  <span className="rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700">
                    Active
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-600">Class 9 to 12 resources and solved papers</p>
              </div>
            );

            if (isFBISE) {
              return (
                <Link href="/fbise" key={board.slug} className="block">
                  {card}
                </Link>
              );
            }

            return <div key={board.slug}>{card}</div>;
          })}
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Latest notes</h2>
          <Link href="/search" className="text-sm font-semibold text-sky-700 hover:underline">
            Browse all
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {latestNotes.map((note) => (
            <article
              key={note.title}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="bg-gradient-to-br from-sky-100 to-indigo-50 px-4 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  {note.board}
                </p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{note.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{note.subject}</p>
              </div>
              <div className="space-y-3 p-4">
                <p className="text-sm text-slate-500">{note.className}</p>
                <p className="text-sm leading-6 text-slate-700">{note.description}</p>
                <Link href="/fbise/9/mathematics/real-numbers" className="inline-flex font-semibold text-sky-700 hover:underline">
                  Read chapter
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
