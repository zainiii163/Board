import type { Metadata } from "next";
import Link from "next/link";

import { LocalizedBreadcrumbs } from "@/components/layout/localized-breadcrumbs";
import { AdBanner } from "@/components/portal/ad-banner";
import { NAV_BOARDS, NAV_CLASSES, ACADEMIC_YEAR } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MCQ Practice — Online Quizzes for Class 9, 11 & 12 | BoardNotes",
  description:
    "Practice MCQs for Class 9, 11 and 12 board exams. Federal Board and other Pakistani boards now include ~50% MCQs — free chapter-wise practice with instant feedback.",
  openGraph: {
    title: "MCQ Practice | BoardNotes",
    description: "Free MCQ practice for Class 9, 11 and 12 board exams.",
  },
};

const MCQ_CLASSES = [9, 11, 12] as const;

const CORE_SUBJECTS = [
  { slug: "mathematics", title: "Mathematics", icon: "📐" },
  { slug: "physics", title: "Physics", icon: "⚛️" },
  { slug: "chemistry", title: "Chemistry", icon: "🧪" },
  { slug: "biology", title: "Biology", icon: "🧬" },
  { slug: "english", title: "English", icon: "📖" },
  { slug: "urdu", title: "Urdu", icon: "؀" },
  { slug: "islamiat", title: "Islamiyat", icon: "🕌" },
  { slug: "pakistan-studies", title: "Pakistan Studies", icon: "🇵🇰" },
];

const MATH_CHAPTERS: Record<number, { slug: string; title: string }[]> = {
  9: [
    { slug: "real-numbers", title: "Real Numbers" },
    { slug: "logarithms", title: "Logarithms" },
    { slug: "sets", title: "Sets & Functions" },
    { slug: "linear-equations", title: "Linear Equations" },
  ],
  11: [
    { slug: "trigonometry", title: "Trigonometry" },
    { slug: "sequences", title: "Sequences & Series" },
    { slug: "derivatives", title: "Differentiation" },
  ],
  12: [
    { slug: "integrals", title: "Integration" },
    { slug: "conic-sections", title: "Conic Sections" },
    { slug: "vectors", title: "Vectors" },
  ],
};

export default function OnlineQuizzesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <LocalizedBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "MCQ Practice" }]} />

      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Test Yourself</p>
        <h1 className="mt-1 text-3xl font-black text-foreground sm:text-4xl">MCQ Practice — Class 9, 11 &amp; 12</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Board exams for {ACADEMIC_YEAR} now include roughly <strong className="text-foreground">50% MCQs</strong>.
          Practice chapter-wise multiple choice questions with instant feedback — free, no login required for quizzes.
        </p>
      </div>

      {/* Class selector */}
      <div className="mt-8">
        <h2 className="text-lg font-black text-foreground">Choose your class</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {MCQ_CLASSES.map((num) => (
            <Link
              key={num}
              href={`#class-${num}`}
              className="group rounded-2xl border border-border bg-card p-5 transition hover:border-accent/40 hover:shadow-md"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-lg text-accent transition group-hover:bg-accent group-hover:text-white">
                🎯
              </span>
              <h3 className="mt-3 text-xl font-black text-foreground group-hover:text-accent">Class {num}</h3>
              <p className="mt-1 text-xs text-muted">
                {num === 9 ? "Matric Part I" : num === 11 ? "Intermediate Part I" : "Intermediate Part II"} · ~50% MCQs
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick test generator CTA */}
      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-300/50 bg-emerald-50/60 p-5 dark:border-emerald-800/40 dark:bg-emerald-950/30">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Build a custom MCQ test</p>
          <p className="mt-0.5 text-xs text-emerald-800/80 dark:text-emerald-200/80">
            Pick board, class, subject and chapters — timed test with instant scoring.
          </p>
        </div>
        <Link
          href="/test-generator"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
        >
          Open Test Generator →
        </Link>
      </div>

      {/* Per-class subject MCQ links */}
      {MCQ_CLASSES.map((num) => (
        <div key={num} id={`class-${num}`} className="mt-10 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-foreground sm:text-2xl">Class {num} MCQs</h2>
              <p className="mt-1 text-sm text-muted">Open a subject to practice chapter quizzes, or jump into a full test.</p>
            </div>
            <Link
              href="/test-generator"
              className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-bold text-accent transition hover:bg-accent hover:text-white"
            >
              Full Test →
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CORE_SUBJECTS.map((s) => (
              <Link
                key={s.slug}
                href={`/fbise/${num}/${s.slug}`}
                className="group rounded-xl border border-border bg-card p-4 transition hover:border-accent/40 hover:shadow-sm"
              >
                <span className="text-lg">{s.icon}</span>
                <p className="mt-1.5 text-sm font-bold text-foreground group-hover:text-accent">{s.title}</p>
                <p className="text-[11px] text-muted">Chapter quizzes →</p>
              </Link>
            ))}
          </div>

          {MATH_CHAPTERS[num] && (
            <div className="mt-4 rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Popular Math chapters</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {MATH_CHAPTERS[num].map((ch) => (
                  <Link
                    key={ch.slug}
                    href={`/fbise/${num}/mathematics/${ch.slug}`}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground/80 transition hover:border-accent hover:text-accent"
                  >
                    {ch.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Board links */}
      <div className="mt-10 rounded-2xl border border-border bg-card/50 p-5">
        <h2 className="text-lg font-bold text-foreground">Practice by board</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {NAV_BOARDS.map((b) => (
            <Link
              key={b.slug}
              href={`/${b.slug}`}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground/80 transition hover:border-accent hover:text-accent"
            >
              {b.label}
            </Link>
          ))}
          {NAV_CLASSES.filter((n) => !MCQ_CLASSES.includes(n as 9 | 11 | 12)).map((n) => (
            <span key={n} className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-semibold text-muted">
              Class {n} — notes only
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-muted">
          MCQ-heavy exams apply to Class 9, 11 and 12. Classes 5–8 (NBF) focus on exercise practice — browse notes from your board page.
        </p>
      </div>

      <div className="mt-8">
        <AdBanner size="leaderboard" className="mx-auto" />
      </div>
    </section>
  );
}
