"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { t, type Locale, type TranslationKey } from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  toggleLocale: () => void;
  tr: (key: TranslationKey) => string;
  isRtl: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("boardnotes_locale") as Locale | null;
    // Applying the persisted locale on mount must stay synchronous (pre-paint) to
    // avoid a brief RTL/LTR flash and a hydration mismatch on the <html> dir/lang.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "en" || saved === "ur") setLocale(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("boardnotes_locale", locale);
    document.documentElement.lang = locale === "ur" ? "ur" : "en";
    document.documentElement.dir = locale === "ur" ? "rtl" : "ltr";
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      toggleLocale: () => setLocale((l) => (l === "en" ? "ur" : "en")),
      tr: (key: TranslationKey) => t(locale, key),
      isRtl: locale === "ur",
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function LocaleToggle() {
  const { locale, toggleLocale, tr } = useLocale();
  return (
    <button
      type="button"
      onClick={toggleLocale}
      className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-card"
      aria-label={locale === "en" ? "Switch to Urdu" : "Switch to English"}
    >
      {tr("language")}
    </button>
  );
}
