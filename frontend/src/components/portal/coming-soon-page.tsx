"use client";

import Link from "next/link";
import { useState } from "react";

import { useLocale } from "@/lib/locale-context";

type Feature = { icon: string; title: string; desc: string };

type Props = {
  titleKey: "quizzesTitle" | "whiteboardTitle" | "testGeneratorTitle";
  descKey: "quizzesDesc" | "whiteboardDesc" | "testGeneratorDesc";
  detailKey: "quizzesComingSoon" | "whiteboardComingSoon" | "testGeneratorComingSoon";
  gradient: string;
  icon: string;
  features: Feature[];
  backHref?: string;
};

export function ComingSoonPage({ titleKey, descKey, detailKey, gradient, icon, features, backHref = "/" }: Props) {
  const { tr } = useLocale();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {/* Hero */}
        <div className={`relative bg-gradient-to-br ${gradient} px-8 py-16 text-center text-white sm:py-20`}>
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <span className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-5xl backdrop-blur">
              {icon}
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">{tr(titleKey)}</h1>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/80 sm:text-base">{tr(descKey)}</p>
          </div>
        </div>

        {/* Coming soon badge */}
        <div className="px-8 pt-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            {tr("comingSoonTitle")}
          </span>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            {tr(detailKey)}
          </p>
        </div>

        {/* Features grid */}
        <div className="px-8 py-8">
          <h3 className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-muted">What to expect</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-4">
                <span className="text-2xl">{f.icon}</span>
                <h4 className="mt-2 font-semibold text-foreground">{f.title}</h4>
                <p className="mt-1 text-xs text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Email notify */}
        <div className="border-t border-border px-8 py-8 text-center">
          <h3 className="text-sm font-bold text-foreground">Get notified when we launch</h3>
          <p className="mt-1 text-xs text-muted">No spam — just a one-time notification.</p>
          <div className="mx-auto mt-4 max-w-sm">
            {submitted ? (
              <div className="rounded-xl border border-accent/30 bg-accent/10 px-5 py-4 text-sm font-semibold text-accent">
                {tr("comingSoonThanks")}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSubmitted(true);
                }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tr("comingSoonEmail")}
                  required
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
                >
                  {tr("comingSoonNotify")}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Back link */}
        <div className="border-t border-border px-8 py-4 text-center">
          <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:underline">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}