"use client";

import Link from "next/link";

import { useLocale } from "@/lib/locale-context";

export function HomeHero() {
  const { tr } = useLocale();

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#182333] px-8 py-14 text-white shadow-xl sm:px-12 lg:px-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="font-serif text-5xl font-medium leading-none tracking-tight text-white sm:text-6xl lg:text-[4.5rem]">
            {tr("homeHeroTitle")}
          </h1>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-slate-300">{tr("homeHeroDesc")}</p>
          <form action="/search" method="get" className="mt-10 flex max-w-md items-center gap-2 rounded-full bg-[#243142] p-1.5">
            <input
              name="q"
              aria-label={tr("search")}
              placeholder={tr("pressSearch")}
              className="w-full bg-transparent px-5 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {tr("search")}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-end space-y-4 pt-4 lg:pt-0">
          <div className="w-[85%] rounded-2xl border border-white/5 bg-[#243142] px-5 py-4 text-sm text-slate-300 shadow-lg">
            Punjab → Class 9 → Mathematics
          </div>
          <div className="w-[90%] rounded-2xl border border-[#42A99D]/40 bg-accent px-5 py-4 text-sm text-white shadow-lg">
            Sets → Exercise 1.1 → Question 3
          </div>
        </div>
      </div>
    </div>
  );
}

type Board = { slug: string; title: string; ready?: boolean; chapterCount?: number };

export function HomeBoardsSection({ boards }: { boards: Board[] }) {
  const { tr } = useLocale();

  return (
    <div id="boards" className="mt-20 scroll-mt-24">
      <p className="text-[11px] font-bold uppercase tracking-widest text-accent">{tr("browse")}</p>
      <h2 className="mt-2 font-serif text-4xl text-foreground">{tr("boardsSection")}</h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {boards.map((board) => {
          const ready = board.ready ?? board.slug === "fbise";
          const card = (
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent">{tr("boardLabel")}</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${ready ? "bg-accent/15 text-accent" : "bg-background text-muted"}`}
                >
                  {ready ? tr("demoReady") : tr("soon")}
                </span>
              </div>
              <h3 className="mt-3 pr-4 font-serif text-2xl font-medium leading-tight text-foreground">
                {board.title.replace("(", "\n(")}
              </h3>
              <p className="mt-auto pt-8 text-[13px] leading-relaxed text-muted">
                {ready
                  ? tr("classNotesDesc")
                  : tr("boardComingSoon")}
              </p>
              {ready && typeof board.chapterCount === "number" && board.chapterCount > 0 && (
                <p className="mt-3 text-xs font-semibold text-accent">
                  {tr("chapterCountLabel").replace("{count}", String(board.chapterCount))}
                </p>
              )}
            </div>
          );

          if (ready) {
            return (
              <Link href={`/${board.slug}`} key={board.slug} className="block">
                {card}
              </Link>
            );
          }

          return <div key={board.slug}>{card}</div>;
        })}
      </div>
    </div>
  );
}

const latestNotes = [
  {
    title: "Real Numbers",
    subject: "Mathematics",
    board: "FBISE",
    className: "Class 9",
    description: "Quick concept recap and worked examples covering rational and irrational values.",
    path: "/fbise/9/mathematics/real-numbers",
  },
  {
    title: "Sets",
    subject: "Mathematics",
    board: "Punjab",
    className: "Class 9",
    description: "Roster form, unions, intersections, and counting formulas for Punjab Board.",
    path: "/punjab/9/mathematics/sets",
  },
  {
    title: "Exercise 1.1",
    subject: "Mathematics",
    board: "FBISE",
    className: "Class 9",
    description: "Solved decimal-to-rational questions including Question 3, 5, 6 and 7.",
    path: "/fbise/9/mathematics/real-numbers/exercise-1-1",
  },
  {
    title: "Linear Equations",
    subject: "Mathematics",
    board: "KPK",
    className: "Class 9",
    description: "Solve one-variable linear equations and check your answers.",
    path: "/kpk/9/mathematics/linear-equations",
  },
  {
    title: "Algebraic Expressions",
    subject: "Mathematics",
    board: "Sindh",
    className: "Class 9",
    description: "Combine like terms and expand expressions step by step.",
    path: "/sindh/9/mathematics/algebraic-expressions",
  },
];

export function HomeLatestSection() {
  const { tr } = useLocale();

  return (
    <div className="mt-24">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-accent">{tr("justPublished")}</p>
          <h2 className="mt-2 font-serif text-4xl text-foreground">{tr("latestNotes")}</h2>
        </div>
        <Link href="/search" className="text-sm font-semibold text-foreground hover:text-accent">
          {tr("browseAll")}
        </Link>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {latestNotes.map((note) => (
          <article
            key={note.title}
            className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
          >
            <div className="bg-[#182333] px-6 py-6 text-white dark:bg-background dark:ring-1 dark:ring-border">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{note.board}</p>
              <h3 className="mt-2 font-serif text-2xl font-medium text-white dark:text-foreground">{note.title}</h3>
              <p className="mt-1 text-sm text-slate-300 dark:text-muted">{note.subject}</p>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-[13px] text-muted">{note.className}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">{note.description}</p>
              <Link href={note.path} className="mt-auto pt-6 text-[13px] font-bold text-foreground hover:text-accent">
                {tr("openNotes")}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
