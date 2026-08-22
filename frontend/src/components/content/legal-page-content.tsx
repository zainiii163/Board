"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";
import type { Locale } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/i18n";

export type LegalPageData = {
  slug: string;
  title: { en: string; ur: string };
  paragraphs: { en: string[]; ur: string[] };
  cards?: { title: { en: string; ur: string }; body: { en: string; ur: string } }[];
};

type Props = {
  slug: string;
  fallbackTitleKey?: TranslationKey;
  className?: string;
};

function pickLocalized<T extends Record<Locale, string>>(map: T, locale: Locale) {
  return map[locale] ?? map.en;
}

export function LegalPageContent({ slug, fallbackTitleKey, className = "" }: Props) {
  const { locale, tr } = useLocale();
  const [page, setPage] = useState<LegalPageData | null>(null);

  useEffect(() => {
    apiFetch<LegalPageData>(`/api/legal/${slug}`)
      .then(setPage)
      .catch(() => setPage(null));
  }, [slug]);

  const title = page ? pickLocalized(page.title, locale) : fallbackTitleKey ? tr(fallbackTitleKey) : "";
  const paragraphs = page?.paragraphs[locale] ?? page?.paragraphs.en ?? [];

  return (
    <section className={`mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 ${className}`}>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-black text-foreground">{title}</h1>
        <div className="mt-5 space-y-4 text-foreground/90">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
        {page?.cards && page.cards.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {page.cards.map((card) => (
              <div key={pickLocalized(card.title, locale)} className="rounded-2xl border border-border bg-card p-4">
                <h2 className="text-lg font-bold text-foreground">{pickLocalized(card.title, locale)}</h2>
                <p className="mt-2 text-sm text-muted">{pickLocalized(card.body, locale)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function useEducationalNotice() {
  const { locale, tr } = useLocale();
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<LegalPageData>("/api/legal/educational-notice")
      .then((page) => setNotice(page.paragraphs[locale]?.[0] ?? page.paragraphs.en[0] ?? null))
      .catch(() => setNotice(null));
  }, [locale]);

  return notice ?? tr("educationalNotice");
}
