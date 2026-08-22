"use client";

import { useLocale } from "@/lib/locale-context";
import type { TranslationKey } from "@/lib/i18n";

type Props = {
  titleKey: TranslationKey;
  subtitleKey?: TranslationKey;
  className?: string;
};

export function PageHeading({ titleKey, subtitleKey, className = "" }: Props) {
  const { tr } = useLocale();

  return (
    <div className={className}>
      <h1 className="text-3xl font-black text-foreground">{tr(titleKey)}</h1>
      {subtitleKey && <p className="mt-3 text-muted">{tr(subtitleKey)}</p>}
    </div>
  );
}
