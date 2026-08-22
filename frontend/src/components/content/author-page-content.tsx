"use client";

import Link from "next/link";

import { useLocale } from "@/lib/locale-context";

type AuthorData = {
  slug: string;
  name: string;
  title: string;
  bio: string;
  boards: string[];
  noteCount: number;
  notes: { title: string; path: string; subject: string }[];
};

export function AuthorPageContent({ author }: { author: AuthorData | null }) {
  const { tr } = useLocale();

  if (!author) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-2xl font-bold text-foreground">{tr("authorNotFound")}</h1>
        <Link href="/authors" className="mt-4 inline-block text-accent hover:underline">
          {tr("backToAuthors")}
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{tr("authorLabel")}</p>
        <h1 className="mt-2 font-serif text-3xl font-black text-foreground">{author.name}</h1>
        <p className="mt-1 text-sm font-semibold text-muted">{author.title}</p>
        <p className="mt-4 max-w-2xl leading-7 text-foreground">{author.bio}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {author.boards.map((b) => (
            <span key={b} className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-accent">
              {b}
            </span>
          ))}
          <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted">
            {author.noteCount} {tr("notesCount")}
          </span>
        </div>
        <h2 className="mt-8 text-xl font-bold text-foreground">{tr("publishedNotes")}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {author.notes.map((note) => (
            <Link
              key={note.path}
              href={note.path}
              className="rounded-2xl border border-border bg-background p-4 transition hover:border-accent"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{note.subject}</p>
              <p className="mt-1 font-semibold text-foreground">{note.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
