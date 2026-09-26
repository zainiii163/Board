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
    <section className="mx-auto max-w-6xl space-y-8 px-4 pt-14 sm:px-6 lg:px-8" aria-label="Boards">
      {sections.map((board) => {
        const classNum = parseInt(board.featuredClassSlug, 10) || 0;
        return (
          <div key={board.slug} className="py-2">
            <div className="mb-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-serif text-xl font-black text-foreground sm:text-2xl">
                {board.title}{" "}
                <span className="text-accent">({board.classNumbers.join(",")})</span>
              </h2>
              <Link
                href={`/${board.slug}`}
                className="flex-grow-0 rounded-md border-2 border-accent px-2 py-1 text-sm font-semibold text-foreground underline transition hover:bg-accent hover:text-white"
              >
                Click More
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {board.subjects.map((subject) => {
                const cover = getBookCover(board.slug, classNum, subject.title);
                const label = `${board.featuredClassSlug} ${subject.title}`;
                return (
                  <Link
                    key={subject.slug}
                    href={`/${board.slug}/${board.featuredClassSlug}/${subject.slug}`}
                    className="group relative block overflow-hidden rounded-md border border-border transition hover:grayscale-[60%]"
                  >
                    {cover ? (
                      <Image
                        src={cover}
                        alt={`${label} book cover`}
                        width={200}
                        height={300}
                        className="aspect-[2/3] w-full object-cover"
                      />
                    ) : (
                      <CoverArt title={label} className="aspect-[2/3] w-full" />
                    )}
                    <p className="absolute inset-x-0 bottom-0 bg-accent p-1 text-center text-xs font-bold text-white underline">
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
