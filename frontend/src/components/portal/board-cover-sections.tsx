"use client";

import Link from "next/link";
import Image from "next/image";

import { CoverArt } from "@/components/portal/cover-art";
import { getBookCover } from "@/lib/book-covers";

export type HomeBoardSection = {
  slug: string;
  title: string;
  classNumbers: number[];
  featuredClassSlug: string;
  subjects: { slug: string; title: string }[];
};

type Props = {
  sections: HomeBoardSection[];
};

export function BoardCoverSections({ sections }: Props) {
  if (sections.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl space-y-14 px-4 pt-14 sm:px-6 lg:px-8" aria-label="Boards">
      {sections.map((board) => {
        const classNum = parseInt(board.featuredClassSlug, 10) || 0;
        return (
          <div key={board.slug}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-serif text-2xl font-black text-foreground sm:text-3xl">
                {board.title}{" "}
                <span className="text-accent">({board.classNumbers.join(",")})</span>
              </h2>
              <Link
                href={`/${board.slug}`}
                className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-bold text-accent transition hover:bg-accent hover:text-white"
              >
                Click More →
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {board.subjects.map((subject) => {
                const cover = getBookCover(board.slug, classNum, subject.title);
                const label = `${board.featuredClassSlug} ${subject.title}`;
                return (
                  <Link
                    key={subject.slug}
                    href={`/${board.slug}/${board.featuredClassSlug}/${subject.slug}`}
                    className="group"
                  >
                    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={`${label} book cover`}
                          width={200}
                          height={267}
                          className="aspect-[3/4] w-full object-cover"
                        />
                      ) : (
                        <CoverArt title={label} className="aspect-[3/4] w-full" />
                      )}
                    </div>
                    <p className="mt-2 text-center text-xs font-semibold text-foreground group-hover:text-accent">
                      {label}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
