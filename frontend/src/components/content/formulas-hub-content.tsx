"use client";

import Link from "next/link";

import { MathText } from "@/components/content/math-text";
import { useLocale } from "@/lib/locale-context";
import { pickLocalizedList } from "@/lib/i18n";

type FormulaChapter = {
  boardSlug: string;
  classSlug: string;
  subjectSlug: string;
  chapterSlug: string;
  boardTitle: string;
  classTitle: string;
  subjectTitle: string;
  chapterTitle: string;
  formulas: string[];
  formulasUr?: string[];
};

export function FormulasHubContent({ chapters }: { chapters: FormulaChapter[] }) {
  const { tr, locale } = useLocale();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{tr("formulasHub")}</p>
        <h1 className="mt-2 font-serif text-3xl font-black text-foreground">{tr("formulasHubTitle")}</h1>
        <p className="mt-3 max-w-2xl text-muted">{tr("formulasHubDesc")}</p>

        <div className="mt-8 space-y-4">
          {chapters.length === 0 ? (
            <p className="text-sm text-muted">{tr("noFormulasYet")}</p>
          ) : (
            chapters.map((chapter) => {
              const formulas = pickLocalizedList(locale, chapter.formulas, chapter.formulasUr);
              const chapterPath = `/${chapter.boardSlug}/${chapter.classSlug}/${chapter.subjectSlug}/${chapter.chapterSlug}`;
              return (
                <article
                  key={chapterPath}
                  className="rounded-2xl border border-border bg-background p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                    {chapter.boardTitle} • {chapter.classTitle} • {chapter.subjectTitle}
                  </p>
                  <Link href={chapterPath} className="mt-1 inline-block text-lg font-bold text-foreground hover:text-accent">
                    {chapter.chapterTitle}
                  </Link>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-foreground">
                    {formulas.map((formula) => (
                      <li key={formula} className="flex gap-2">
                        <span className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full bg-accent" />
                        <MathText text={formula} />
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
