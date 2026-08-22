"use client";

import Link from "next/link";

import { useLocale } from "@/lib/locale-context";

type AuthorSummary = {
  slug: string;
  name: string;
  title: string;
  bio: string;
  boards: string[];
  noteCount: number;
};

export function AuthorsListContent({ authors }: { authors: AuthorSummary[] }) {
  const { tr } = useLocale();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{tr("authorLabel")}</p>
        <h1 className="mt-2 font-serif text-3xl font-black text-foreground">{tr("authorsPageTitle")}</h1>
        <p className="mt-3 max-w-2xl text-muted">{tr("authorsPageDesc")}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {authors.map((author) => (
            <Link
              key={author.slug}
              href={`/authors/${author.slug}`}
              className="rounded-2xl border border-border bg-background p-5 transition hover:border-accent"
            >
              <h2 className="text-lg font-bold text-foreground">{author.name}</h2>
              <p className="mt-1 text-sm font-semibold text-muted">{author.title}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground">{author.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {author.boards.map((board) => (
                  <span key={board} className="rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-accent">
                    {board}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                {tr("viewAuthor")} →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
