"use client";

import Link from "next/link";

import { LocalizedBreadcrumbs } from "@/components/layout/localized-breadcrumbs";
import { useLocale } from "@/lib/locale-context";

const SUBJECT_COLORS = [
  { bg: "bg-gradient-to-br from-sky-50 to-blue-50", dark: "dark:from-sky-950/30 dark:to-blue-950/30", border: "border-sky-200/60 dark:border-sky-800/30", icon: "bg-gradient-to-br from-sky-500 to-blue-500", hover: "hover:border-sky-400", tag: "text-sky-600 dark:text-sky-300" },
  { bg: "bg-gradient-to-br from-emerald-50 to-teal-50", dark: "dark:from-emerald-950/30 dark:to-teal-950/30", border: "border-emerald-200/60 dark:border-emerald-800/30", icon: "bg-gradient-to-br from-emerald-500 to-teal-500", hover: "hover:border-emerald-400", tag: "text-emerald-600 dark:text-emerald-300" },
  { bg: "bg-gradient-to-br from-amber-50 to-orange-50", dark: "dark:from-amber-950/30 dark:to-orange-950/30", border: "border-amber-200/60 dark:border-amber-800/30", icon: "bg-gradient-to-br from-amber-500 to-orange-500", hover: "hover:border-amber-400", tag: "text-amber-600 dark:text-amber-300" },
  { bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50", dark: "dark:from-purple-950/30 dark:to-fuchsia-950/30", border: "border-purple-200/60 dark:border-purple-800/30", icon: "bg-gradient-to-br from-purple-500 to-fuchsia-500", hover: "hover:border-purple-400", tag: "text-purple-600 dark:text-purple-300" },
  { bg: "bg-gradient-to-br from-rose-50 to-pink-50", dark: "dark:from-rose-950/30 dark:to-pink-950/30", border: "border-rose-200/60 dark:border-rose-800/30", icon: "bg-gradient-to-br from-rose-500 to-pink-500", hover: "hover:border-rose-400", tag: "text-rose-600 dark:text-rose-300" },
  { bg: "bg-gradient-to-br from-cyan-50 to-sky-50", dark: "dark:from-cyan-950/30 dark:to-sky-950/30", border: "border-cyan-200/60 dark:border-cyan-800/30", icon: "bg-gradient-to-br from-cyan-500 to-sky-500", hover: "hover:border-cyan-400", tag: "text-cyan-600 dark:text-cyan-300" },
];

type APSACSClassPageContentProps = {
  board: string;
  classSlug: string;
  boardTitle: string;
  classTitle: string;
  subjects: { slug: string; title: string }[];
};

export function APSACSClassPageContent({
  board,
  classSlug,
  boardTitle,
  classTitle,
  subjects,
}: APSACSClassPageContentProps) {
  const { tr } = useLocale();

  const resourceTypes = [
    { icon: "📚", label: "Books", desc: "APSACS Textbooks", href: `/${board}/${classSlug}/books` },
    { icon: "📝", label: "Notes", desc: "Study Notes & Guides", href: `/${board}/${classSlug}/notes` },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <LocalizedBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: boardTitle, href: `/${board}` },
          { label: classTitle },
        ]}
      />

      {/* Colorful header banner */}
      <div className="hero-gradient relative mt-6 overflow-hidden rounded-3xl px-8 py-10 text-white shadow-xl sm:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl animate-float" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl animate-float-slow" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur-sm">
              🏫 {boardTitle}
            </span>
            <span className="text-white/40">/</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur-sm">
              🎓 {tr("classLabel")}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>{classTitle}</h1>
          <p className="mt-2 max-w-lg text-sm text-white/85">Access APSACS textbooks, notes, and study materials designed for Army Public Schools & Colleges System curriculum.</p>
        </div>
      </div>

      {/* Resource types */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {resourceTypes.map((type, i) => {
          const color = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
          return (
            <Link
              key={type.label}
              href={type.href}
              className={`group relative overflow-hidden rounded-2xl border ${color.border} ${color.bg} ${color.dark} p-6 transition-all duration-400 hover:-translate-y-1 hover:shadow-xl ${color.hover} animate-fade-in-up stagger-${i + 1}`}
            >
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${color.icon} opacity-[0.08] blur-xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-[0.15]`} />
              <span className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color.icon} text-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                {type.icon}
              </span>
              <p className={`text-xs font-bold uppercase tracking-[0.18em] ${color.tag}`}>{type.label}</p>
              <h2 className="mt-1 text-xl font-black text-foreground transition-colors duration-200 group-hover:text-accent">{type.desc}</h2>
              <p className="mt-2 text-sm text-muted">Browse available resources</p>
              <span className={`absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r ${color.icon} opacity-60 transition-all duration-700 group-hover:w-full rounded-full`} />
            </Link>
          );
        })}
      </div>

      {/* Subject cards */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-foreground">Subjects</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {subjects.length === 0 ? (
            <p className="text-sm text-muted md:col-span-2 xl:col-span-3">No subjects available yet.</p>
          ) : (
            subjects.map((subject, i) => {
              const color = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
              return (
                <Link
                  key={subject.slug}
                  href={`/${board}/${classSlug}/${subject.slug}`}
                  className={`group relative overflow-hidden rounded-2xl border ${color.border} ${color.bg} ${color.dark} p-6 transition-all duration-400 hover:-translate-y-1 hover:shadow-xl ${color.hover} animate-fade-in-up stagger-${Math.min((i % 6) + 1, 6)}`}
                >
                  <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${color.icon} opacity-[0.08] blur-xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-[0.15]`} />
                  <span className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color.icon} text-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    📖
                  </span>
                  <p className={`text-xs font-bold uppercase tracking-[0.18em] ${color.tag}`}>{tr("subjectLabel")}</p>
                  <h2 className="mt-1 text-xl font-black text-foreground transition-colors duration-200 group-hover:text-accent">{subject.title}</h2>
                  <p className="mt-2 text-sm text-muted">{tr("openChaptersNotes")}</p>
                  <span className={`absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r ${color.icon} opacity-60 transition-all duration-700 group-hover:w-full rounded-full`} />
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* SEO Content Block */}
      <div className="mt-12 rounded-2xl border border-border bg-card/50 p-6">
        <h3 className="mb-3 text-lg font-bold text-foreground">APSACS {classTitle} Study Resources</h3>
        <p className="mb-3 text-sm leading-6 text-muted">
          Access comprehensive study materials for APSACS {classTitle}, including textbooks, notes, and practice exercises. 
          Our resources are aligned with the Army Public Schools & Colleges System curriculum, ensuring students have access to 
          high-quality educational content that supports their learning journey.
        </p>
        <p className="mb-3 text-sm leading-6 text-muted">
          Find subject-specific guides for English, Mathematics, Science, Urdu, Islamic Studies, and Social Studies. 
          Each subject includes detailed chapter notes, solved exercises, and additional practice materials to help students 
          excel in their academic performance.
        </p>
        <p className="text-sm leading-6 text-muted">
          All study materials are designed to follow the APSACS curriculum standards, making them perfect for classroom learning, 
          homework assistance, and exam preparation. Teachers and students can rely on these resources for consistent and accurate 
          educational content.
        </p>
      </div>
    </section>
  );
}
