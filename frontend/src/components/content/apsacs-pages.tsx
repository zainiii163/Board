"use client";

import Link from "next/link";

import { LocalizedBreadcrumbs } from "@/components/layout/localized-breadcrumbs";
import { useLocale } from "@/lib/locale-context";
import { BookmarkButton } from "@/components/content/bookmark-button";

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
    { icon: "📚", label: "Books", desc: "APSACS Textbooks", href: "#subjects-heading" },
    { icon: "📝", label: "Notes", desc: "Study Notes & Guides", href: "#subjects-heading" },
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

      {/* Header — simple */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-bold text-muted">
            🏫 {boardTitle}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-bold text-muted">
            🎓 {tr("classLabel")}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-foreground sm:text-4xl">{classTitle}</h1>
            <p className="mt-2 max-w-lg text-sm text-muted">Access APSACS textbooks, notes, and study materials designed for Army Public Schools & Colleges System curriculum.</p>
          </div>
          <BookmarkButton title={`${classTitle} · ${boardTitle}`} path={`/${board}/${classSlug}`} />
        </div>
      </div>

      {/* Resource types */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {resourceTypes.map((type) => (
          <Link
            key={type.label}
            href={type.href}
            className="group rounded-2xl border border-border bg-card p-6 transition hover:border-accent/40 hover:shadow-md"
          >
            <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-lg text-accent transition group-hover:bg-accent group-hover:text-white">
              {type.icon}
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{type.label}</p>
            <h2 className="mt-1 text-lg font-black text-foreground transition-colors group-hover:text-accent">{type.desc}</h2>
            <p className="mt-2 text-sm text-muted">Browse available resources</p>
          </Link>
        ))}
      </div>

      {/* Subject cards */}
      <div className="mt-10" id="subjects-heading">
        <h2 className="mb-4 text-xl font-bold text-foreground">Subjects</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {subjects.length === 0 ? (
            <p className="text-sm text-muted md:col-span-2 xl:col-span-3">No subjects available yet.</p>
          ) : (
            subjects.map((subject) => (
              <Link
                key={subject.slug}
                href={`/${board}/${classSlug}/${subject.slug}`}
                className="group rounded-2xl border border-border bg-card p-6 transition hover:border-accent/40 hover:shadow-md"
              >
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-lg text-accent transition group-hover:bg-accent group-hover:text-white">
                  📖
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{tr("subjectLabel")}</p>
                <h2 className="mt-1 text-lg font-black text-foreground transition-colors group-hover:text-accent">{subject.title}</h2>
                <p className="mt-2 text-sm text-muted">{tr("openChaptersNotes")}</p>
              </Link>
            ))
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
