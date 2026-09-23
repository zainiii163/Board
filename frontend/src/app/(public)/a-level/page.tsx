import type { Metadata } from "next";
import Link from "next/link";

import { LocalizedBreadcrumbs } from "@/components/layout/localized-breadcrumbs";
import { AdBanner } from "@/components/portal/ad-banner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "A Level (Cambridge AS / A2) — Notes & Books | BoardNotes",
  description:
    "Cambridge A Level and AS Level resources: Year 12–13 notes, textbooks, past papers and MCQ practice for Maths, Physics, Chemistry, Biology and more.",
  openGraph: {
    title: "A Level Notes & Books | BoardNotes",
    description: "Cambridge AS and A Level study materials — free.",
  },
};

const A_LEVEL_YEARS = [
  { slug: "year-12", title: "AS Level · Year 12", aka: "First year — AS certification" },
  { slug: "year-13", title: "A Level · Year 13", aka: "Second year — full A Level" },
];

const A_LEVEL_SUBJECTS = [
  { slug: "mathematics", title: "Mathematics (9709)", icon: "📐" },
  { slug: "further-mathematics", title: "Further Mathematics (9231)", icon: "🧮" },
  { slug: "physics", title: "Physics (9702)", icon: "⚛️" },
  { slug: "chemistry", title: "Chemistry (9701)", icon: "🧪" },
  { slug: "biology", title: "Biology (9700)", icon: "🧬" },
  { slug: "economics", title: "Economics (9708)", icon: "💹" },
  { slug: "business-studies", title: "Business Studies (9615)", icon: "📊" },
  { slug: "computer-science", title: "Computer Science (9618)", icon: "💻" },
];

export default function ALevelPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <LocalizedBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "A Level" }]} />

      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-muted">🌍 Cambridge</span>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">A Level</span>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-muted">AS · A2</span>
        </div>
        <h1 className="mt-3 text-3xl font-black text-foreground sm:text-4xl">A Level Notes &amp; Books</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Cambridge AS and A Level (Years 12–13) — chapter-wise notes, worked examples, and exam-style MCQ practice.
          This section is being expanded with higher-quality covers, PDFs and generated notes as they arrive.
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
          {A_LEVEL_YEARS.map((year) => (
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
        <h2 className="text-lg font-black text-foreground">Popular A Level subjects</h2>
        <p className="mt-1 text-sm text-muted">Syllabus codes shown for Cambridge. Content rolls in progressively.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {A_LEVEL_SUBJECTS.map((s) => (
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
        <h2 className="text-lg font-bold text-foreground">A Level FAQ</h2>
        <div className="mt-4 space-y-4 text-sm leading-6">
          <div>
            <p className="font-semibold text-foreground">What is the difference between AS and A Level?</p>
            <p className="mt-1 text-muted">
              AS Level (Year 12) is the first half of the qualification and can stand alone. A Level (Year 13) combines
              AS content with advanced material for the full certificate.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Do I need O Level first?</p>
            <p className="mt-1 text-muted">
              Most students continue from IGCSE/O Level into AS/A Level, but entry requirements vary by school and centre.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">How are exams structured?</p>
            <p className="mt-1 text-muted">
              Typically a mix of structured papers and, for sciences, a practical/alternative-to-pure paper. MCQ papers
              appear in several syllabuses — use our practice tools to drill them.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Where can I get past papers?</p>
            <p className="mt-1 text-muted">
              Check the <Link href="/categories/cambridge-intl-notes" className="font-semibold text-accent hover:underline">Cambridge library</Link>{" "}
              now; dedicated A Level paper packs will be linked from each subject page as they are added.
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
