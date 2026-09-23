import type { Metadata } from "next";
import Link from "next/link";

import { LocalizedBreadcrumbs } from "@/components/layout/localized-breadcrumbs";
import { AdBanner } from "@/components/portal/ad-banner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "O Level (Cambridge / IGCSE) — Notes & Books | BoardNotes",
  description:
    "O Level study resources for Cambridge IGCSE and Edexcel: Year 10–11 notes, textbooks, past papers and MCQ practice. Free PDFs for international students.",
  openGraph: {
    title: "O Level Notes & Books | BoardNotes",
    description: "Cambridge O Level and IGCSE study materials — free.",
  },
};

const O_LEVEL_YEARS = [
  { slug: "year-10", title: "O Level Year 10", aka: "IGCSE Year 1" },
  { slug: "year-11", title: "O Level Year 11", aka: "IGCSE Year 2 · Exam year" },
];

const O_LEVEL_SUBJECTS = [
  { slug: "mathematics", title: "Mathematics (0580)", icon: "📐" },
  { slug: "physics", title: "Physics (0625)", icon: "⚛️" },
  { slug: "chemistry", title: "Chemistry (0620)", icon: "🧪" },
  { slug: "biology", title: "Biology (0610)", icon: "🧬" },
  { slug: "english", title: "First Language English (0500)", icon: "📖" },
  { slug: "business-studies", title: "Business Studies (0450)", icon: "📊" },
  { slug: "economics", title: "Economics (0455)", icon: "💹" },
  { slug: "accounting", title: "Accounting (0452)", icon: "🧾" },
];

export default function OLevelPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <LocalizedBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "O Level" }]} />

      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-muted">🌍 Cambridge</span>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">O Level</span>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-muted">IGCSE</span>
        </div>
        <h1 className="mt-3 text-3xl font-black text-foreground sm:text-4xl">O Level Notes &amp; Books</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Cambridge O Level and IGCSE resources for Year 10 and Year 11 — chapter-wise notes, textbooks, and past-paper
          practice. We are expanding this section beyond what other sites cover; PDFs and covers will land here as they are ready.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/online-quizzes"
            className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-white transition hover:opacity-90"
          >
            MCQ Practice →
          </Link>
          <Link
            href="/categories/cambridge-intl-notes"
            className="rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground transition hover:border-accent hover:text-accent"
          >
            Cambridge International library →
          </Link>
          <Link
            href="/test-generator"
            className="rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground transition hover:border-accent hover:text-accent"
          >
            Test Generator →
          </Link>
        </div>
      </div>

      {/* Years */}
      <div className="mt-8">
        <h2 className="text-lg font-black text-foreground">Years</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {O_LEVEL_YEARS.map((year) => (
            <div
              key={year.slug}
              id={year.slug}
              className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 transition hover:border-accent/40 hover:shadow-sm"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-lg text-accent">
                🎓
              </span>
              <h3 className="mt-3 text-xl font-black text-foreground">{year.title}</h3>
              <p className="mt-1 text-xs text-muted">{year.aka}</p>
              <p className="mt-2 text-sm text-muted">Subject pages coming as content is published.</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subjects */}
      <div className="mt-10">
        <h2 className="text-lg font-black text-foreground">Popular O Level subjects</h2>
        <p className="mt-1 text-sm text-muted">Syllabus codes shown for Cambridge. Content rolls in progressively.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {O_LEVEL_SUBJECTS.map((s) => (
            <div key={s.slug} className="rounded-xl border border-dashed border-border bg-background p-4">
              <span className="text-lg">{s.icon}</span>
              <p className="mt-1.5 text-sm font-bold text-foreground">{s.title}</p>
              <p className="text-[11px] text-muted">Notes coming soon</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-10 rounded-2xl border border-border bg-background p-5">
        <h2 className="text-lg font-bold text-foreground">O Level FAQ</h2>
        <div className="mt-4 space-y-4 text-sm leading-6">
          <div>
            <p className="font-semibold text-foreground">What is the difference between O Level and IGCSE?</p>
            <p className="mt-1 text-muted">
              They are parallel Cambridge international qualifications with overlapping syllabuses. IGCSE is often used
              as the stepping stone to IGCSE/AS/A Level; O Level is recognised in many regions with a similar exam structure.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Which years are covered?</p>
            <p className="mt-1 text-muted">
              Year 10 (first year) and Year 11 (exam year). We map them as dedicated sections so you can bookmark your year page.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Are past papers available?</p>
            <p className="mt-1 text-muted">
              Browse the Cambridge International library for notes and paper collections; dedicated O Level past-paper packs
              will appear here as they are uploaded.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Can I practise MCQs?</p>
            <p className="mt-1 text-muted">
              Yes — use <Link href="/online-quizzes" className="font-semibold text-accent hover:underline">MCQ Practice</Link> and the{" "}
              <Link href="/test-generator" className="font-semibold text-accent hover:underline">Test Generator</Link> for timed papers.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <AdBanner size="leaderboard" className="mx-auto" />
      </div>
    </section>
  );
}
