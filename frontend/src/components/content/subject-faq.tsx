"use client";

import { useLocale } from "@/lib/locale-context";
import type { TranslationKey } from "@/lib/i18n";

const faqKeys: { q: TranslationKey; a: TranslationKey }[] = [
  { q: "faq1q", a: "faq1a" },
  { q: "faq2q", a: "faq2a" },
  { q: "faq3q", a: "faq3a" },
  { q: "faq4q", a: "faq4a" },
];

export function SubjectFaq() {
  const { tr } = useLocale();

  return (
    <div className="mt-8 rounded-2xl border border-border bg-background p-5">
      <h2 className="text-lg font-bold text-foreground">{tr("faqTitle")}</h2>
      <div className="mt-4 space-y-4">
        {faqKeys.map((item) => (
          <div key={item.q}>
            <p className="font-semibold text-foreground">{tr(item.q)}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{tr(item.a)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
