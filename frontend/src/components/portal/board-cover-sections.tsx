"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { CoverArt } from "@/components/portal/cover-art";
import { Reveal } from "@/components/motion/reveal";
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
  const reduceMotion = useReducedMotion();
  if (sections.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl space-y-10 px-4 pt-14 sm:px-6 lg:px-8" aria-label="Boards">
      {sections.map((board) => {
        const classNum = parseInt(board.featuredClassSlug, 10) || 0;
        return (
          <Reveal key={board.slug}>
            <div className="py-2">
              <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="flex items-center gap-2 font-serif text-xl font-black text-foreground sm:text-2xl">
                  <span className="inline-block h-6 w-1 rounded-full bg-gradient-to-b from-accent to-accent-2" aria-hidden="true" />
                  {board.title}{" "}
                  <span className="text-accent">({board.classNumbers.join(",")})</span>
                </h2>
                <Link
                  href={`/${board.slug}`}
                  className="pressable inline-flex flex-grow-0 items-center gap-1.5 rounded-xl border-2 border-accent/60 px-3 py-1.5 text-sm font-semibold text-foreground underline-offset-4 transition hover:bg-accent hover:text-white hover:underline"
                >
                  Click More
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {board.subjects.map((subject, i) => {
                  const cover = getBookCover(board.slug, classNum, subject.title);
                  const label = `${board.featuredClassSlug} ${subject.title}`;
                  return (
                    <motion.div
                      key={subject.slug}
                      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={`/${board.slug}/${board.featuredClassSlug}/${subject.slug}`}
                        className="group relative block overflow-hidden rounded-xl border border-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lift"
                      >
                        {cover ? (
                          <Image
                            src={cover}
                            alt={`${label} book cover`}
                            width={200}
                            height={300}
                            className="aspect-[2/3] w-full object-cover transition-all duration-500 group-hover:scale-[1.04] group-hover:grayscale-[55%]"
                          />
                        ) : (
                          <CoverArt title={label} className="aspect-[2/3] w-full transition-transform duration-500 group-hover:scale-[1.04]" />
                        )}
                        <p className="absolute inset-x-0 bottom-0 bg-gradient-to-r from-accent to-accent-2 p-1 text-center text-xs font-bold text-white">
                          {label}
                        </p>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        );
      })}
    </section>
  );
}
