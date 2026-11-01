"use client";

import { useMemo, useState } from "react";
import { BookOpenCheck, ExternalLink, FileText, Search, ShieldCheck } from "lucide-react";

import { DriveLinkButton } from "@/components/content/drive-link-button";
import { DownloadGate } from "@/components/content/download-gate";
import { pdfUrl } from "@/lib/api-client";
import type { PastPaperItem } from "@/components/content/past-papers-list";

type Props = { papers: PastPaperItem[]; initialClass?: string };

const CLASS_CARDS = [
  { slug: "9", title: "Class 9", subtitle: "SSC Part I" },
  { slug: "10", title: "Class 10", subtitle: "SSC Part II" },
  { slug: "11", title: "Class 11", subtitle: "HSSC Part I" },
  { slug: "12", title: "Class 12", subtitle: "HSSC Part II" },
] as const;

/** Client 113.pdf — Class 9 excludes Pakistan Studies; includes Tarjuma-tul-Quran. */
const REQUIRED_SUBJECTS: Record<string, string[]> = {
  "9": ["Biology", "Chemistry", "Physics", "Computer Science", "Mathematics", "English", "Urdu", "Islamiat", "Tarjuma-tul-Quran"],
  "10": ["Biology", "Chemistry", "Physics", "Computer Science", "Mathematics", "English", "Urdu", "Pakistan Studies"],
};

const CLASS_SOURCE_URL: Record<string, string> = {
  "9": "https://fbisepastpapers.com/class-9-fbise-past-papers/",
  "10": "https://fbisepastpapers.com/class-10-fbise-past-papers/",
  "11": "https://fbisepastpapers.com/",
  "12": "https://fbisepastpapers.com/",
};

/** Expected new-syllabus sessions from client annotations (113.pdf / 125.pdf). */
const EXPECTED_SESSIONS: Record<string, { year: string; paperType: PastPaperItem["paperType"] }[]> = {
  "9": [
    { year: "2027", paperType: "paper-pattern" },
    { year: "2027", paperType: "model" },
    { year: "2026", paperType: "second-annual" },
    { year: "2026", paperType: "first-annual" },
    { year: "2025", paperType: "second-annual" },
    { year: "2025", paperType: "first-annual" },
    { year: "2024", paperType: "model" },
  ],
  "10": [
    { year: "2026", paperType: "second-annual" },
    { year: "2026", paperType: "first-annual" },
    { year: "2025", paperType: "model" },
  ],
};

const sessionLabel = (paper: Pick<PastPaperItem, "year" | "paperType">) => {
  const base =
    paper.paperType === "second-annual"
      ? "2nd Annual"
      : paper.paperType === "first-annual"
        ? "1st Annual"
        : paper.paperType === "model"
          ? "Model Paper"
          : paper.paperType === "paper-pattern"
            ? "Paper Pattern"
            : "PBA";
  return `${paper.year} ${base}`;
};

function mergeSubjectRows(
  classSlug: string,
  subjectTitle: string,
  papers: PastPaperItem[],
): PastPaperItem[] {
  const existing = papers.filter(
    (paper) =>
      paper.classSlug === classSlug &&
      paper.subjectTitle === subjectTitle &&
      paper.syllabus !== "old",
  );
  const expected = EXPECTED_SESSIONS[classSlug] ?? [];
  if (expected.length === 0) return existing;

  const rows: PastPaperItem[] = [];
  for (const session of expected) {
    const match = existing.find(
      (paper) => paper.year === session.year && paper.paperType === session.paperType,
    );
    if (match) {
      rows.push(match);
      continue;
    }
    rows.push({
      id: -1 * (rows.length + 1),
      boardSlug: "fbise",
      boardTitle: "Federal Board (FBISE)",
      classSlug,
      classTitle: `Class ${classSlug}`,
      subjectTitle,
      year: session.year,
      sessionType: session.paperType === "second-annual" ? "supply" : "annual",
      paperType: session.paperType,
      isSolved: false,
      syllabus: "new",
      pdfUrl: null,
      driveUrl: CLASS_SOURCE_URL[classSlug] ?? null,
    });
  }

  // Chemistry PBA for Class 10 (125.pdf annotation).
  if (classSlug === "10" && subjectTitle === "Chemistry") {
    const pba = existing.find((paper) => paper.paperType === "pba");
    rows.push(
      pba ?? {
        id: -99,
        boardSlug: "fbise",
        boardTitle: "Federal Board (FBISE)",
        classSlug: "10",
        classTitle: "Class 10",
        subjectTitle: "Chemistry",
        year: "2026",
        sessionType: "annual",
        paperType: "pba",
        isSolved: false,
        syllabus: "new",
        pdfUrl: null,
        driveUrl: CLASS_SOURCE_URL["10"],
      },
    );
  }

  return rows;
}

/**
 * FBISE past-papers explorer aligned to client PDFs 111/113/125 and
 * fbisepastpapers.com information architecture.
 */
export function FbisePastPapersExplorer({ papers, initialClass }: Props) {
  const fbisePapers = useMemo(() => papers.filter((paper) => paper.boardSlug === "fbise"), [papers]);
  const startingClass = CLASS_CARDS.some((klass) => klass.slug === initialClass) ? initialClass! : "9";
  const [classSlug, setClassSlug] = useState<string>(startingClass);
  const [subject, setSubject] = useState("all");
  const [query, setQuery] = useState("");

  const subjects = REQUIRED_SUBJECTS[classSlug] ?? [];
  const visibleSubjects = subjects.filter((name) => {
    const matchesSubject = subject === "all" || subject === name;
    return matchesSubject && name.toLowerCase().includes(query.trim().toLowerCase());
  });

  const selectClass = (next: string) => {
    setClassSlug(next);
    setSubject("all");
  };

  return (
    <div className="min-w-0 w-full overflow-x-clip">
      <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-emerald-900/20 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-4 text-white shadow-sm sm:p-7 lg:p-10">
        <div className="w-full min-w-0 max-w-3xl">
          <p className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-amber-300/40 bg-amber-300/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-amber-100 sm:px-3 sm:text-[11px] sm:tracking-[0.12em]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" aria-hidden="true" />
            <span className="min-w-0 break-words">Updated for 2026–2027 exams</span>
          </p>
          <h1 className="mt-4 max-w-full break-words font-serif text-[1.35rem] font-bold leading-[1.2] tracking-tight hyphens-auto sm:text-3xl sm:leading-[1.15] md:text-4xl lg:text-5xl">
            FBISE Past Papers,{" "}
            <span className="text-amber-300">All in One Place</span>
          </h1>
          <p className="mt-3 max-w-full break-words text-sm leading-6 text-slate-200 sm:max-w-2xl sm:text-base">
            Browse Federal Board past papers, model papers, and paper patterns for Class 9–12 by subject and year.
            Open a verified source archive, or download a PDF when one has been uploaded here — free.
          </p>
          <label className="mt-6 flex w-full min-w-0 max-w-xl items-center gap-2 rounded-2xl bg-white px-3 py-3 text-slate-900 shadow-sm sm:gap-3 sm:px-4" htmlFor="paper-search">
            <Search className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
            <input
              id="paper-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search e.g. Physics Class 10…"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            />
          </label>
          <div className="mt-6 grid w-full min-w-0 grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div className="min-w-0"><p className="text-xl font-black text-amber-300">4</p><p className="text-[11px] uppercase tracking-wide text-slate-300 sm:text-xs">Classes</p></div>
            <div className="min-w-0"><p className="text-xl font-black text-amber-300">25+</p><p className="text-[11px] uppercase tracking-wide text-slate-300 sm:text-xs">Subjects</p></div>
            <div className="min-w-0"><p className="text-xl font-black text-amber-300">New</p><p className="text-[11px] uppercase tracking-wide text-slate-300 sm:text-xs">Syllabus only</p></div>
            <div className="min-w-0"><p className="text-xl font-black text-amber-300">Free</p><p className="text-[11px] uppercase tracking-wide text-slate-300 sm:text-xs">Source / PDF</p></div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">1. Select class</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CLASS_CARDS.map((klass) => {
            const active = classSlug === klass.slug;
            const ready = Boolean(REQUIRED_SUBJECTS[klass.slug]);
            return (
              <button
                key={klass.slug}
                type="button"
                onClick={() => selectClass(klass.slug)}
                className={`rounded-2xl border p-4 text-left transition ${active ? "border-emerald-700 bg-emerald-700 text-white shadow-sm" : "border-border bg-card text-foreground hover:border-emerald-600/50"}`}
              >
                <span className="text-lg font-bold">{klass.title}</span>
                <span className={`mt-1 block text-xs ${active ? "text-white/85" : "text-muted"}`}>
                  {ready ? klass.subtitle : "Inventory coming soon"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {subjects.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
          Class {classSlug} past-paper inventory will appear here after the client supplies the annotated source list (same as Class 9/10).
        </p>
      ) : (
        <>
          <section className="mt-8 scroll-mt-24">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">2. Select subject</p>
            <div className="mt-3 flex flex-wrap gap-2 pb-1">
              <button
                type="button"
                onClick={() => setSubject("all")}
                className={`inline-flex min-h-11 items-center rounded-full border px-3.5 py-2.5 text-sm font-semibold transition sm:px-4 ${subject === "all" ? "border-emerald-700 bg-emerald-700 text-white" : "border-border bg-card text-foreground hover:border-emerald-600/50"}`}
              >
                All subjects
              </button>
              {subjects.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSubject(name)}
                  className={`inline-flex min-h-11 items-center rounded-full border px-3.5 py-2.5 text-sm font-semibold transition sm:px-4 ${subject === name ? "border-emerald-700 bg-emerald-700 text-white" : "border-border bg-card text-foreground hover:border-emerald-600/50"}`}
                >
                  {name}
                </button>
              ))}
            </div>
            <p className="mt-3 inline-flex items-center gap-2 text-xs text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
              {classSlug === "9"
                ? "Pakistan Studies removed for Class 9 (client 113.pdf). Tarjuma-tul-Quran included."
                : "Islamiat removed for Class 10 (client 125.pdf). New syllabus only."}
            </p>
          </section>

          <section className="mt-8 space-y-5">
            {visibleSubjects.length === 0 && (
              <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">No subject matches that search.</p>
            )}
            {visibleSubjects.map((subjectTitle) => {
              const rows = mergeSubjectRows(classSlug, subjectTitle, fbisePapers);
              return (
                <article key={subjectTitle} className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                  <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-slate-50 px-5 py-4 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700 text-white">
                        <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h2 className="font-bold text-foreground">{subjectTitle}</h2>
                        <p className="text-xs text-muted">Class {classSlug} · FBISE · New syllabus</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-700/15 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      {rows.length} sessions
                    </span>
                  </header>
                  <div className="p-5">
                    <PaperGroup
                      title="Requested new-syllabus resources"
                      hint="Sessions from client annotations — source opens FBISE archive until a PDF is uploaded here"
                      rows={rows}
                    />
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}

      <p className="mt-8 flex min-w-0 items-start gap-2 break-words text-xs leading-5 text-muted">
        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Source links open the corresponding FBISE Past Papers archive. A Download button appears only after a PDF has been uploaded to this site.
      </p>
    </div>
  );
}

function PaperGroup({ title, hint, rows }: { title: string; hint: string; rows: PastPaperItem[] }) {
  return (
    <div className="rounded-2xl border border-emerald-700/20 bg-emerald-700/[0.04] p-4">
      <div className="mb-3">
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted">{hint}</p>
      </div>
      <div className="space-y-2">
        {rows.length === 0 ? (
          <p className="text-sm text-muted">No source available yet.</p>
        ) : (
          rows.map((paper, index) => (
            <div
              key={`${paper.subjectTitle}-${paper.year}-${paper.paperType}-${index}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2.5"
            >
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                {sessionLabel(paper)}
              </span>
              <div className="flex items-center gap-2">
                {paper.driveUrl && <DriveLinkButton href={paper.driveUrl} label="View source" className="px-2.5 py-1.5 text-xs" />}
                {paper.pdfUrl ? (
                  <DownloadGate url={pdfUrl(paper.pdfUrl)} compact />
                ) : (
                  <span className="rounded-lg border border-dashed border-border px-2.5 py-1.5 text-[11px] font-semibold text-muted">
                    PDF pending
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
