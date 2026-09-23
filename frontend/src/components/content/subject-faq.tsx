"use client";

import { useLocale } from "@/lib/locale-context";
import type { TranslationKey } from "@/lib/i18n";
import { boardShortName, ACADEMIC_YEAR } from "@/lib/constants";

const faqKeys: { q: TranslationKey; a: TranslationKey }[] = [
  { q: "faq1q", a: "faq1a" },
  { q: "faq2q", a: "faq2a" },
  { q: "faq3q", a: "faq3a" },
  { q: "faq4q", a: "faq4a" },
];

type SubjectFaqProps = {
  board?: string;
  classNum?: number;
};

export function SubjectFaq({ board, classNum }: SubjectFaqProps) {
  const { tr } = useLocale();

  const short = board ? boardShortName(board, classNum) : "FBISE";

  return (
    <div className="mt-8 rounded-2xl border border-border bg-background p-5">
      <h2 className="text-lg font-bold text-foreground">{tr("faqTitle")}</h2>
      <div className="mt-4 space-y-4">
        {faqKeys.map((item) => {
          const answer = tr(item.a)
            .replaceAll("FBISE SLOs", `${short} SLOs`)
            .replaceAll("FBISE", short)
            .replaceAll("2026–2027", ACADEMIC_YEAR);
          return (
            <div key={item.q}>
              <p className="font-semibold text-foreground">{tr(item.q)}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{answer}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
