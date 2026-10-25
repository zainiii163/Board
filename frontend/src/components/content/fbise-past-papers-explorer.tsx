"use client";

import { useMemo, useState } from "react";
import { BookOpenCheck, ExternalLink, FileText, Search, ShieldCheck } from "lucide-react";

import { DriveLinkButton } from "@/components/content/drive-link-button";
import { DownloadGate } from "@/components/content/download-gate";
import { pdfUrl } from "@/lib/api-client";
import type { PastPaperItem } from "@/components/content/past-papers-list";

type Props = { papers: PastPaperItem[] };

const sessionLabel = (paper: PastPaperItem) => {
  const base = paper.paperType === "second-annual" ? "2nd Annual" : paper.paperType === "first-annual" ? "1st Annual" : paper.paperType === "model" ? "Model Paper" : paper.paperType === "paper-pattern" ? "Paper Pattern" : "PBA";
  return `${paper.year} ${base}`;
};

const REQUIRED_SUBJECTS: Record<string, string[]> = {
  "9": ["Biology", "Chemistry", "Physics", "Computer Science", "Mathematics", "English", "Urdu", "Islamiat", "Tarjuma-tul-Quran"],
  "10": ["Biology", "Chemistry", "Physics", "Computer Science", "Mathematics", "English", "Urdu", "Pakistan Studies"],
};

/**
 * The public FBISE archive is deliberately subject-first: students choose a
 * class and subject, then see new- and old-syllabus sessions separately.  This
 * mirrors how the examination source is organised without pretending that a
 * source-only entry is a locally hosted PDF.
 */
export function FbisePastPapersExplorer({ papers }: Props) {
  const fbisePapers = useMemo(() => papers.filter((paper) => paper.boardSlug === "fbise"), [papers]);
  const classes = useMemo(
    () => [...new Map(fbisePapers.map((paper) => [paper.classSlug, paper.classTitle])).entries()].sort((a, b) => Number(a[0]) - Number(b[0])),
    [fbisePapers],
  );
  const [classSlug, setClassSlug] = useState(classes[0]?.[0] ?? "");
  const [subject, setSubject] = useState("all");
  const [query, setQuery] = useState("");

  const classPapers = useMemo(
    () => fbisePapers.filter((paper) => paper.classSlug === classSlug && (REQUIRED_SUBJECTS[classSlug] ?? []).includes(paper.subjectTitle) && (classSlug !== "9" && classSlug !== "10" || paper.syllabus !== "old")),
    [fbisePapers, classSlug],
  );
  const subjects = useMemo(
    () => [...new Set(classPapers.map((paper) => paper.subjectTitle))].sort((a, b) => a.localeCompare(b)),
    [classPapers],
  );
  const visibleSubjects = subjects.filter((name) => {
    const matchesSubject = subject === "all" || subject === name;
    return matchesSubject && name.toLowerCase().includes(query.trim().toLowerCase());
  });

  const selectClass = (next: string) => {
    setClassSlug(next);
    setSubject("all");
  };

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[color-mix(in_oklab,var(--accent)_18%,#0f172a)] via-slate-900 to-slate-950 p-6 text-white shadow-sm sm:p-10">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Federal Board archive
          </p>
          <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-5xl">FBISE Past Papers</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
            Choose your class, subject, and exam year. New-syllabus papers are kept separate from the older archive so you practise the right pattern.
          </p>
          <label className="mt-6 flex max-w-xl items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-900 shadow-sm" htmlFor="paper-search">
            <Search className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
            <input
              id="paper-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a subject, e.g. Physics"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            />
          </label>
        </div>
      </section>

      <section className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">1. Select class</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {classes.map(([slug, title]) => (
            <button
              key={slug}
              type="button"
              onClick={() => selectClass(slug)}
              className={`rounded-2xl border p-4 text-left transition ${classSlug === slug ? "border-accent bg-accent text-white shadow-sm" : "border-border bg-card text-foreground hover:border-accent/50"}`}
            >
              <span className="text-lg font-bold">{title}</span>
              <span className={`mt-1 block text-xs ${classSlug === slug ? "text-white/85" : "text-muted"}`}>Browse papers →</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">2. Select subject</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSubject("all")}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${subject === "all" ? "border-accent bg-accent text-white" : "border-border bg-card text-foreground hover:border-accent/50"}`}
          >
            All subjects
          </button>
          {subjects.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setSubject(name)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${subject === name ? "border-accent bg-accent text-white" : "border-border bg-card text-foreground hover:border-accent/50"}`}
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 space-y-5">
        {visibleSubjects.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">No paper source matches that subject.</p>
        )}
        {visibleSubjects.map((subjectTitle) => {
          const rows = classPapers.filter((paper) => paper.subjectTitle === subjectTitle);
          const current = rows.filter((paper) => paper.syllabus !== "old").sort((a, b) => b.year.localeCompare(a.year));
          const archive = rows.filter((paper) => paper.syllabus === "old").sort((a, b) => b.year.localeCompare(a.year));
          return (
            <article key={subjectTitle} className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-slate-50 px-5 py-4 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-white"><BookOpenCheck className="h-5 w-5" aria-hidden="true" /></span>
                  <div><h2 className="font-bold text-foreground">{subjectTitle}</h2><p className="text-xs text-muted">{classes.find(([slug]) => slug === classSlug)?.[1]} · FBISE</p></div>
                </div>
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">{rows.length} sessions</span>
              </header>
              <div className="grid gap-5 p-5 lg:grid-cols-2">
                <PaperGroup title="Requested new-syllabus resources" hint="Sessions specified in the client annotations" rows={current} />
                {archive.length > 0 && <PaperGroup title="Previous syllabus archive" hint="2024 and earlier" rows={archive} subdued />}
              </div>
            </article>
          );
        })}
      </section>

      <p className="mt-8 flex items-start gap-2 text-xs leading-5 text-muted"><ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> Source links open the corresponding FBISE Past Papers archive. A Download button appears only after a PDF has been uploaded to this site.</p>
    </>
  );
}

function PaperGroup({ title, hint, rows, subdued = false }: { title: string; hint: string; rows: PastPaperItem[]; subdued?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${subdued ? "border-border bg-background" : "border-accent/25 bg-accent/5"}`}>
      <div className="mb-3"><h3 className="font-bold text-foreground">{title}</h3><p className="text-xs text-muted">{hint}</p></div>
      <div className="space-y-2">
        {rows.length === 0 ? <p className="text-sm text-muted">No source available yet.</p> : rows.map((paper) => (
          <div key={paper.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"><FileText className="h-4 w-4 text-accent" aria-hidden="true" />{sessionLabel(paper)}</span>
            <div className="flex items-center gap-2">
              {paper.driveUrl && <DriveLinkButton href={paper.driveUrl} label="View source" className="px-2.5 py-1.5 text-xs" />}
              {paper.pdfUrl && <DownloadGate url={pdfUrl(paper.pdfUrl)} compact />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
