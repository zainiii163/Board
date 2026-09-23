import type { Metadata } from "next";
import Link from "next/link";

import { LocalizedBreadcrumbs } from "@/components/layout/localized-breadcrumbs";
import { AdBanner } from "@/components/portal/ad-banner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "O Level (Cambridge / IGCSE) — Notes & Books | BoardNotes",
  description:
    "O Level study resources for Cambridge IGCSE and Edexcel: Year 10–11 notes, textbooks, topical past papers and MCQ practice. Free PDFs for international students.",
  openGraph: {
    title: "O Level Notes & Books | BoardNotes",
    description: "Cambridge O Level and IGCSE study materials — free.",
  },
};

const O_LEVEL_YEARS = [
  { slug: "year-10", title: "O Level Year 10", aka: "IGCSE Year 1 · foundation year" },
  { slug: "year-11", title: "O Level Year 11", aka: "IGCSE Year 2 · exam year" },
];

const O_LEVEL_SUBJECTS = [
  { slug: "mathematics", title: "Mathematics (0580)", icon: "📐" },
  { slug: "add-mathematics", title: "Additional Maths (0606)", icon: "➗" },
  { slug: "physics", title: "Physics (0625)", icon: "⚛️" },
  { slug: "chemistry", title: "Chemistry (0620)", icon: "🧪" },
  { slug: "biology", title: "Biology (0610)", icon: "🧬" },
  { slug: "english", title: "First Language English (0500)", icon: "📖" },
  { slug: "english-2nd", title: "English as 2nd Language (0524)", icon: "💬" },
  { slug: "business-studies", title: "Business Studies (0450)", icon: "📊" },
  { slug: "economics", title: "Economics (0455)", icon: "💹" },
  { slug: "accounting", title: "Accounting (0452)", icon: "🧾" },
  { slug: "geography", title: "Geography (0460)", icon: "🌍" },
  { slug: "computer-science", title: "Computer Science (0478)", icon: "💻" },
  { slug: "ict", title: "ICT (0417)", icon: "🖥" },
  { slug: "history", title: "History (0470)", icon: "📜" },
];

const RESOURCES = [
  { icon: "📝", label: "Chapter-wise Notes", desc: "Topic summaries & worked examples", href: "/categories/cambridge-intl-notes" },
  { icon: "📚", label: "Textbooks & PDFs", desc: "Official course books, read online", href: "/categories/cambridge-intl-notes" },
  { icon: "🗂", label: "Topical Past Papers", desc: "Topic-by-topic paper drills", href: "/categories/cambridge-intl-notes" },
  { icon: "🎯", label: "MCQ Practice", desc: "Instant-feedback quizzes", href: "/online-quizzes" },
  { icon: "🧪", label: "Test Generator", desc: "Timed custom question papers", href: "/test-generator" },
];

const PATHWAY = [
  { label: "O Level / IGCSE", sub: "Years 10–11", href: "#years" },
  { label: "AS Level", sub: "Year 12", href: "/a-level#year-12" },
  { label: "A Level", sub: "Year 13", href: "/a-level#year-13" },
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
          Cambridge O Level and IGCSE resources for Year 10 and Year 11 — chapter-wise notes, textbooks, topical past
          papers, and MCQ practice across every major syllabus. We are expanding this section beyond what other sites
          cover; better covers and PDFs land here as they are ready.
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

      {/* Study pathway — O Level feeds into AS / A Level */}
      <div className="mt-8">
        <h2 className="text-lg font-black text-foreground">Your study pathway</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {PATHWAY.map((step, i) => (
            <Link
              key={step.label}
              href={step.href}
              className="group relative rounded-2xl border border-border bg-card p-4 transition hover:border-accent/40 hover:shadow-sm"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Step {i + 1}</span>
              <h3 className="mt-1 text-base font-black text-foreground group-hover:text-accent">{step.label}</h3>
              <p className="mt-0.5 text-xs text-muted">{step.sub} →</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Years */}
      <div className="mt-10">
        <h2 className="text-lg font-black text-foreground" id="years">Years</h2>
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
              <p className="mt-2 text-sm text-muted">
                Notes, books and topical papers for every subject in this year.
              </p>
              <Link
                href="/categories/cambridge-intl-notes"
                className="mt-3 inline-block text-xs font-bold text-accent transition hover:underline"
              >
                Browse {year.title} resources →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Resource types */}
      <div className="mt-10">
        <h2 className="text-lg font-black text-foreground">Everything in one place</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {RESOURCES.map((r) => (
            <Link
              key={r.label}
              href={r.href}
              className="group rounded-xl border border-border bg-background p-4 transition hover:border-accent/40 hover:shadow-sm"
            >
              <span className="text-lg">{r.icon}</span>
              <p className="mt-1.5 text-sm font-bold text-foreground group-hover:text-accent">{r.label}</p>
              <p className="text-[11px] leading-4 text-muted">{r.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Ad — between content */}
      <div className="mt-10">
        <AdBanner size="leaderboard" className="mx-auto" />
      </div>

      {/* Subjects */}
      <div className="mt-10">
        <h2 className="text-lg font-black text-foreground">O Level subjects</h2>
        <p className="mt-1 text-sm text-muted">
          Cambridge syllabus codes shown. Each subject links to the Cambridge library — notes, books and papers for
          that course.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {O_LEVEL_SUBJECTS.map((s) => (
            <Link
              key={s.slug}
              href="/categories/cambridge-intl-notes"
              className="group rounded-xl border border-border bg-card p-4 transition hover:border-accent/40 hover:shadow-sm"
            >
              <span className="text-lg">{s.icon}</span>
              <p className="mt-1.5 text-sm font-bold text-foreground group-hover:text-accent">{s.title}</p>
              <p className="text-[11px] font-semibold text-accent">Notes &amp; books →</p>
            </Link>
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
              as the stepping stone to AS/A Level; O Level is recognised in many regions with a similar exam structure.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Which years are covered?</p>
            <p className="mt-1 text-muted">
              Year 10 (first year) and Year 11 (exam year). We map them as dedicated sections so you can bookmark your
              year page.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Are past papers available?</p>
            <p className="mt-1 text-muted">
              Browse the{" "}
              <Link href="/categories/cambridge-intl-notes" className="font-semibold text-accent hover:underline">
                Cambridge International library
              </Link>{" "}
              for notes, topical papers and book collections; dedicated O Level paper packs appear here as they are
              uploaded.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Can I practise MCQs?</p>
            <p className="mt-1 text-muted">
              Yes — use{" "}
              <Link href="/online-quizzes" className="font-semibold text-accent hover:underline">
                MCQ Practice
              </Link>{" "}
              and the{" "}
              <Link href="/test-generator" className="font-semibold text-accent hover:underline">
                Test Generator
              </Link>{" "}
              for timed papers.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">What comes after O Level?</p>
            <p className="mt-1 text-muted">
              Progress to{" "}
              <Link href="/a-level" className="font-semibold text-accent hover:underline">
                AS Level (Year 12)
              </Link>{" "}
              and then the full A Level (Year 13) — our pathway above links each stage.
            </p>
          </div>
        </div>
      </div>

      {/* SEO Content Block */}
      <div className="mt-10 rounded-2xl border border-border bg-card/50 p-6">
        <h3 className="mb-3 text-lg font-bold text-foreground">O Level Books and Notes — Complete Study Material</h3>
        <p className="mb-3 text-sm leading-6 text-muted">
          BoardNotes compiles free O Level and IGCSE study material for Cambridge students worldwide: chapter-wise
          notes, textbook PDFs, topical past papers, and exam-style MCQ practice for Mathematics, Sciences, English,
          Business and more.
        </p>
        <p className="mb-3 text-sm leading-6 text-muted">
          Whether you are in Year 10 building foundations or Year 11 revising for exams, every subject follows its
          Cambridge syllabus code (0580, 0625, 0620, 0610, 0500 and friends) so you always study the right topics in
          the right order.
        </p>
        <p className="text-sm leading-6 text-muted">
          Use our test generator to build timed O Level papers from any combination of topics, then review instant
          scoring — a faster loop than passive re-reading ever gives you.
        </p>
      </div>

      <div className="mt-8">
        <AdBanner size="leaderboard" className="mx-auto" />
      </div>
    </section>
  );
}
