"use client";

import Link from "next/link";

const FEATURES = [
  {
    icon: "\uD83D\uDCDA",
    title: "Books & Notes",
    desc: "Curated textbooks, notes, and solved exercises from Class 5 to 12 \u2014 organized by board, class, and subject.",
    gradient: "from-teal-500 to-emerald-600",
    href: "/books",
  },
  {
    icon: "\uD83D\uDCCB",
    title: "Past Papers & Pairing",
    desc: "Past papers, pairing schemes, and model papers for all boards \u2014 know exactly what to expect.",
    gradient: "from-sky-500 to-blue-600",
    href: "/categories",
  },
  {
    icon: "\uD83D\uDCDD",
    title: "Test Generator",
    desc: "Custom practice tests with MCQs and subjective questions. Instant grading and progress tracking.",
    gradient: "from-violet-500 to-purple-600",
    href: "/test-generator",
  },
  {
    icon: "\uD83D\uDC69\u200D\uD83C\uDFEB",
    title: "Tuition & Support",
    desc: "Connect with experienced tutors for personalized learning support across all subjects.",
    gradient: "from-amber-500 to-orange-600",
    href: "/tuition",
  },
];

const STATS = [
  { value: "679+", label: "Resources" },
  { value: "8", label: "Boards" },
  { value: "5\u201312", label: "Classes" },
  { value: "100%", label: "Free" },
];

export function PlatformIntro() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-gradient-to-b from-background via-accent/[0.02] to-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 top-10 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -left-40 bottom-10 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Stats row */}
        <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card/60 px-4 py-3 text-center backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
              <p className="text-2xl font-black text-accent sm:text-3xl">{s.value}</p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Heading */}
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Why BoardNotes
          </div>
          <h2 className="font-serif text-2xl font-black text-foreground sm:text-3xl lg:text-4xl">
            Your Complete Learning Platform
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Everything you need to ace your board exams \u2014 free study resources, practice tests, and expert support in one place.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5 sm:p-7"
            >
              <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${f.gradient} transition-all duration-500 group-hover:h-1.5`} />
              <div className="flex gap-4">
                <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  {f.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-foreground transition-colors duration-200 group-hover:text-accent sm:text-lg">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {f.desc}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 right-5 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/categories"
            className="shine-on-hover inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-6 py-3 text-sm font-bold text-accent transition-all duration-300 hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/20"
          >
            Explore All Categories
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
