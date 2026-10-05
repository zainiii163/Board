"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, CircleDot, Filter, GraduationCap } from "lucide-react";

import { PageHeading } from "@/components/layout/page-heading";
import { pdfUrl } from "@/lib/api-client";
import { DownloadGate } from "@/components/content/download-gate";
import { DriveLinkButton } from "@/components/content/drive-link-button";

export type PastPaperType = "model" | "first-annual" | "second-annual" | "pba";

export const PAPER_TYPE_LABELS: Record<PastPaperType, string> = {
  model: "Model Papers",
  "first-annual": "1st Annual",
  "second-annual": "2nd Annual",
  pba: "PBA",
};

export type PastPaperItem = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  subjectTitle: string;
  classTitle: string;
  year: string;
  sessionType: "annual" | "supply";
  paperType: PastPaperType;
  isSolved: boolean;
  syllabus: "new" | "old";
  pdfUrl: string | null;
  driveUrl: string | null;
};

const TYPE_CHIPS: ("all" | PastPaperType)[] = ["all", "second-annual", "model", "first-annual", "pba"];

/**
 * Display order within a single exam year: 2nd Annual → Model Paper → 1st Annual.
 * Years themselves render newest-first, giving the exact sequence
 * 2nd Annual 2026, Model 2026, 1st Annual 2026, 2nd Annual 2025, 1st Annual 2025…
 */
const TYPE_RANK: Record<PastPaperType, number> = {
  "second-annual": 0,
  model: 1,
  "first-annual": 2,
  pba: 3,
};

const TYPE_TITLES: Record<Exclude<PastPaperType, "pba">, string> = {
  "second-annual": "2nd Annual",
  model: "Model Paper",
  "first-annual": "1st Annual",
};

/**
 * Practical papers are grouped under the science subject they belong to instead of
 * forming their own top-level block.
 */
const PBA_SUBJECTS = ["Physics", "Chemistry", "Biology", "Computer Science"];

function pbaBucket(subjectTitle: string): string | null {
  const title = subjectTitle.toLowerCase();
  if (title.includes("physics")) return "Physics";
  if (title.includes("chemistry")) return "Chemistry";
  if (title.includes("biology")) return "Biology";
  if (title.includes("computer")) return "Computer Science";
  return null;
}

const CHIP_LABEL: Record<(typeof TYPE_CHIPS)[number], string> = {
  all: "All",
  "second-annual": "2nd Annual",
  model: "Model Papers",
  "first-annual": "1st Annual",
  pba: "PBA",
};

function normalizeBoardLabel(boardTitle: string, classTitle: string): string {
  if (!/federal|fbise/i.test(boardTitle)) return boardTitle;
  const match = classTitle.match(/\d+/);
  const classNum = match ? parseInt(match[0], 10) : 0;
  if (classNum >= 9) return "Federal Board (FBISE)";
  if (classNum > 0) return "National Book Foundation (NBF)";
  return boardTitle.replace(/\s*\(FBISE\)/i, "").trim() || "Federal Board";
}

export function PastPapersList({
  papers,
  hideHeading = false,
  initialBoard,
  initialYear,
  initialType,
}: {
  papers: PastPaperItem[];
  hideHeading?: boolean;
  initialBoard?: string;
  initialYear?: string;
  initialType?: string;
}) {
  const reduceMotion = useReducedMotion();

  const boards = useMemo(
    () => [...new Map(papers.map((p) => [p.boardSlug, p.boardTitle])).entries()],
    [papers],
  );
  const years = useMemo(() => [...new Set(papers.map((p) => p.year))].sort().reverse(), [papers]);
  const subjects = useMemo(
    () =>
      [...new Set(papers.map((p) => p.subjectTitle))]
        .sort((a, b) => a.localeCompare(b))
        .filter(Boolean),
    [papers],
  );

  const [board, setBoard] = useState(
    initialBoard && papers.some((p) => p.boardSlug === initialBoard) ? initialBoard : "all",
  );
  const [type, setType] = useState<"all" | PastPaperType>(
    initialType && (TYPE_CHIPS as string[]).includes(initialType) && initialType !== "all"
      ? (initialType as PastPaperType)
      : "all",
  );
  const [year, setYear] = useState(initialYear && papers.some((p) => p.year === initialYear) ? initialYear : "all");
  // Old-syllabus papers are hidden by default; the toggle reveals them.
  const [syllabus, setSyllabus] = useState<"new" | "all">("new");
  const [solved, setSolved] = useState<"all" | "solved" | "unsolved">("all");
  const [subject, setSubject] = useState("all");

  const visible = useMemo(
    () =>
      papers.filter(
        (p) =>
          (board === "all" || p.boardSlug === board) &&
          (type === "all" || p.paperType === type) &&
          (year === "all" || p.year === year) &&
          (subject === "all" || p.subjectTitle === subject) &&
          (syllabus === "all" || (p.syllabus ?? "new") === "new") &&
          (solved === "all" || (solved === "solved" ? p.isSolved : !p.isSolved)),
      ),
    [papers, board, type, year, subject, syllabus, solved],
  );

  /**
   * Chronological hierarchy: years newest-first, and inside a year the exam types
   * in TYPE_RANK order. Practical papers are split out and nested under their
   * science subject further down.
   */
  const byYear = useMemo(() => {
    const exams = visible.filter((p) => p.paperType !== "pba");
    const grouped = new Map<string, { type: Exclude<PastPaperType, "pba">; rows: PastPaperItem[] }[]>();
    for (const paper of exams) {
      const yearKey = paper.year;
      const typeKey = paper.paperType as Exclude<PastPaperType, "pba">;
      const buckets = grouped.get(yearKey) ?? [];
      const bucket = buckets.find((b) => b.type === typeKey);
      if (bucket) bucket.rows.push(paper);
      else buckets.push({ type: typeKey, rows: [paper] });
      grouped.set(yearKey, buckets);
    }
    return [...grouped.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([yearKey, buckets]) => [
        yearKey,
        buckets.sort((a, b) => TYPE_RANK[a.type] - TYPE_RANK[b.type]),
      ] as const);
  }, [visible]);

  /** Practical papers bucketed by their parent science subject. */
  const pbaBySubject = useMemo(() => {
    const buckets = new Map<string, PastPaperItem[]>();
    for (const paper of visible) {
      if (paper.paperType !== "pba") continue;
      const key = pbaBucket(paper.subjectTitle) ?? "Other Practical";
      const rows = buckets.get(key) ?? [];
      rows.push(paper);
      buckets.set(key, rows);
    }
    return PBA_SUBJECTS.map((name) => [name, buckets.get(name)] as const).filter(
      (entry): entry is readonly [string, PastPaperItem[]] => Boolean(entry[1]),
    );
  }, [visible]);

  const segmented =
    "pressable focus-ring whitespace-nowrap rounded-xl border px-3 py-1.5 text-xs font-bold transition";
  const segmentedActive = "border-accent bg-accent text-white shadow-sm shadow-accent/25";
  const segmentedIdle = "border-border bg-card text-foreground/80 hover:border-accent/50 hover:text-accent";

  const chipActive = "border-accent bg-accent text-white shadow-sm shadow-accent/25";
  const chipIdle = "border-border bg-card text-foreground/80 hover:border-accent/50 hover:text-accent";

  const renderRow = (paper: PastPaperItem) => (
    <div
      key={paper.id}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-accent/40 hover:shadow-soft sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          {normalizeBoardLabel(paper.boardTitle, paper.classTitle)}
        </p>
        <h3 className="mt-1 text-base font-bold text-foreground">{paper.subjectTitle}</h3>
        <p className="mt-0.5 text-sm text-muted">{paper.classTitle}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {paper.isSolved ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              Solved
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
              <CircleDot className="h-3 w-3" aria-hidden="true" />
              Unsolved
            </span>
          )}
          {paper.syllabus === "old" && (
            <span className="rounded-full bg-amber-500/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Old syllabus
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent/12 px-3 py-1 text-sm font-bold text-accent">{paper.year}</span>
        {paper.driveUrl && <DriveLinkButton href={paper.driveUrl} className="px-3 py-2 text-xs" />}
        {paper.pdfUrl && <DownloadGate url={pdfUrl(paper.pdfUrl)} compact />}
      </div>
    </div>
  );

  return (
    <>
      {!hideHeading && <PageHeading titleKey="pastPapers" subtitleKey="pastPapersSubtitle" />}

      {/* ── Board selection (top level) ─────────────────────────── */}
      {boards.length > 1 && (
        <div className={hideHeading ? "mt-0" : "mt-6"}>
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            <GraduationCap className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            Select board
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            <button
              type="button"
              onClick={() => setBoard("all")}
              className={`pressable rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                board === "all" ? chipActive : chipIdle
              }`}
            >
              All boards
            </button>
            {boards.map(([slug, title]) => (
              <button
                key={slug}
                type="button"
                onClick={() => setBoard(slug)}
                className={`pressable rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                  board === slug ? chipActive : chipIdle
                }`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Subject grid ───────────────────────────────────────────── */}
      {subjects.length > 1 && (
        <div className={hideHeading ? "mt-4" : "mt-6"}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Subject</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            <button
              type="button"
              onClick={() => setSubject("all")}
              className={`pressable rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                subject === "all" ? chipActive : chipIdle
              }`}
            >
              All subjects
            </button>
            {subjects.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setSubject(subject === name ? "all" : name)}
                aria-pressed={subject === name}
                className={`pressable rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                  subject === name ? chipActive : chipIdle
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Filters ─────────────────────────────────────────────── */}
      <div className="mt-5 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {TYPE_CHIPS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              className={`pressable rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                type === value ? chipActive : chipIdle
              }`}
            >
              {CHIP_LABEL[value]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted">
            <Filter className="h-3.5 w-3.5" aria-hidden="true" />
            Solved
          </span>
          <div className="inline-flex gap-1.5" role="group" aria-label="Filter by solved status">
            {(["all", "unsolved", "solved"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSolved(value)}
                aria-pressed={solved === value}
                className={`${segmented} ${solved === value ? segmentedActive : segmentedIdle}`}
              >
                {value === "all" ? "Both" : value === "solved" ? "Solved" : "Unsolved"}
              </button>
            ))}
          </div>

          <div className="inline-flex gap-1.5" role="group" aria-label="Filter by syllabus">
            <button
              type="button"
              onClick={() => setSyllabus("new")}
              aria-pressed={syllabus === "new"}
              className={`${segmented} ${syllabus === "new" ? segmentedActive : segmentedIdle}`}
            >
              New Syllabus
            </button>
            <button
              type="button"
              onClick={() => setSyllabus("all")}
              aria-pressed={syllabus === "all"}
              className={`${segmented} ${syllabus === "all" ? segmentedActive : segmentedIdle}`}
            >
              Include Old
            </button>
          </div>

          {years.length > 1 && (
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              aria-label="Filter by year"
              className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground/80 transition hover:border-accent/50"
            >
              <option value="all">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ── Results: year-major chronology ─────────────────────────── */}
      <div className="mt-6 space-y-8">
        {visible.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
            No papers match these filters yet.
          </p>
        )}

        {byYear.map(([yearKey, buckets]) => (
          <section key={yearKey}>
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-block h-5 w-1 rounded-full bg-gradient-to-b from-accent to-accent-2" aria-hidden="true" />
              <h2 className="text-lg font-black text-foreground">{yearKey}</h2>
            </div>
            <div className="space-y-5">
              {buckets.map((bucket) => (
                <div key={bucket.type}>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                    {TYPE_TITLES[bucket.type]}
                  </h3>
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-2.5"
                  >
                    {bucket.rows.map(renderRow)}
                  </motion.div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Practical papers nest under their own science subject */}
        {pbaBySubject.length > 0 && (
          <section>
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-block h-5 w-1 rounded-full bg-gradient-to-b from-accent to-accent-2" aria-hidden="true" />
              <h2 className="text-lg font-black text-foreground">Practical Based Assessment</h2>
            </div>
            <p className="mb-3 text-xs text-muted">Practical / internal assessment papers, grouped by subject.</p>
            <div className="space-y-5">
              {pbaBySubject.map(([name, rows]) => (
                <div key={name}>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                    {name} — PBA
                  </h3>
                  <div className="space-y-2.5">{rows.map(renderRow)}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}