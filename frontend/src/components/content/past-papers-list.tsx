"use client";

import { useState } from "react";

import { PageHeading } from "@/components/layout/page-heading";
import { useLocale } from "@/lib/locale-context";
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
  pdfUrl: string | null;
  driveUrl: string | null;
  isSolved?: boolean;
  syllabus?: "new" | "old";
};

const FILTERS: ("all" | PastPaperType)[] = ["all", "second-annual", "model", "first-annual", "pba"];

// Chronological order: 2nd Annual → Model → 1st Annual (for same year)
function getSortOrder(paperType: PastPaperType): number {
  switch (paperType) {
    case "second-annual": return 1;
    case "model": return 2;
    case "first-annual": return 3;
    case "pba": return 4;
    default: return 5;
  }
}

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
  const { tr } = useLocale();
  const [filter, setFilter] = useState<"all" | PastPaperType>(
    initialType && (FILTERS as string[]).includes(initialType) && initialType !== "all"
      ? (initialType as PastPaperType)
      : "all",
  );
  const [boardFilter, setBoardFilter] = useState(initialBoard && papers.some((p) => p.boardSlug === initialBoard) ? initialBoard : "all");
  const [yearFilter, setYearFilter] = useState(initialYear && papers.some((p) => p.year === initialYear) ? initialYear : "all");
  const [solvedFilter, setSolvedFilter] = useState<"all" | "solved" | "unsolved">("all");
  const [syllabusFilter, setSyllabusFilter] = useState<"all" | "new" | "old">("new");

  const boards = Array.from(new Map(papers.map((p) => [p.boardSlug, p.boardTitle])));
  const years = Array.from(new Set(papers.map((p) => p.year))).sort().reverse();

  const visible = papers
    .filter(
      (p) =>
        (filter === "all" || p.paperType === filter) &&
        (boardFilter === "all" || p.boardSlug === boardFilter) &&
        (yearFilter === "all" || p.year === yearFilter) &&
        (solvedFilter === "all" || (solvedFilter === "solved" ? p.isSolved : !p.isSolved)) &&
        (syllabusFilter === "all" || p.syllabus === syllabusFilter || (syllabusFilter === "new" && !p.syllabus)),
    )
    .sort((a, b) => {
      // Sort by year descending, then by chronological order within year
      const yearDiff = parseInt(b.year) - parseInt(a.year);
      if (yearDiff !== 0) return yearDiff;
      return getSortOrder(a.paperType) - getSortOrder(b.paperType);
    });

  // Group papers by class (Class 9, 10, 11, 12)
  const groupedByClass = visible.reduce((acc, paper) => {
    const classTitle = paper.classTitle;
    if (!acc[classTitle]) {
      acc[classTitle] = [];
    }
    acc[classTitle].push(paper);
    return acc;
  }, {} as Record<string, typeof visible>);

  // Get unique subjects for each class
  const getSubjectsForClass = (classPapers: typeof visible) => {
    return Array.from(new Set(classPapers.map((p) => p.subjectTitle))).sort();
  };

  const selectClass =
    "rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground/80 transition hover:border-accent/50";

  return (
    <>
      {!hideHeading && <PageHeading titleKey="pastPapers" subtitleKey="pastPapersSubtitle" />}
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              filter === value
                ? "border-accent bg-accent text-white"
                : "border-border bg-card text-foreground/80 hover:border-accent/50 hover:text-accent"
            }`}
          >
            {value === "all" ? "All" : PAPER_TYPE_LABELS[value]}
          </button>
        ))}
        {boards.length > 1 && (
          <select
            value={boardFilter}
            onChange={(e) => setBoardFilter(e.target.value)}
            aria-label="Filter by board"
            className={selectClass}
          >
            <option value="all">All boards</option>
            {boards.map(([slug, title]) => (
              <option key={slug} value={slug}>{title}</option>
            ))}
          </select>
        )}
        {years.length > 1 && (
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            aria-label="Filter by year"
            className={selectClass}
          >
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        )}
        <div className="flex gap-2 rounded-full border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => setSolvedFilter("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${solvedFilter === "all" ? "bg-accent text-white" : "text-foreground/80 hover:text-accent"}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSolvedFilter("solved")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${solvedFilter === "solved" ? "bg-accent text-white" : "text-foreground/80 hover:text-accent"}`}
          >
            Solved
          </button>
          <button
            type="button"
            onClick={() => setSolvedFilter("unsolved")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${solvedFilter === "unsolved" ? "bg-accent text-white" : "text-foreground/80 hover:text-accent"}`}
          >
            Unsolved
          </button>
        </div>
        <div className="flex gap-2 rounded-full border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => setSyllabusFilter("new")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${syllabusFilter === "new" ? "bg-accent text-white" : "text-foreground/80 hover:text-accent"}`}
          >
            New Syllabus
          </button>
          <button
            type="button"
            onClick={() => setSyllabusFilter("old")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${syllabusFilter === "old" ? "bg-accent text-white" : "text-foreground/80 hover:text-accent"}`}
          >
            Old Syllabus
          </button>
        </div>
      </div>
      <div className="mt-4 space-y-6">
        {visible.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
            No papers in this category yet. Check back soon.
          </p>
        )}
        {Object.entries(groupedByClass).map(([classTitle, classPapers]) => (
          <div key={classTitle} className="rounded-2xl border border-border bg-card p-4">
            {/* Row Header: Class Name */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
              <h3 className="text-xl font-bold text-foreground">{classTitle}</h3>
              {/* Filter Chips: Paper Types */}
              <div className="flex flex-wrap gap-2">
                {FILTERS.filter((f) => f !== "all").map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilter(type as PastPaperType)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      filter === type
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-background text-foreground/80 hover:border-accent/50 hover:text-accent"
                    }`}
                  >
                    {PAPER_TYPE_LABELS[type as PastPaperType]}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Options - Horizontal Row */}
            <div className="mb-4 flex flex-wrap gap-2">
              {getSubjectsForClass(classPapers).map((subject) => (
                <span
                  key={subject}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground/90 hover:border-accent/50 hover:text-accent cursor-pointer transition"
                >
                  {subject}
                </span>
              ))}
            </div>

            {/* Papers List for this class - Horizontal Cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {classPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="flex flex-col gap-2 rounded-xl border border-border/50 bg-background/50 p-3 transition hover:border-accent/40 hover:shadow-sm"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      {normalizeBoardLabel(paper.boardTitle, paper.classTitle)}
                    </p>
                    <h4 className="mt-0.5 text-sm font-bold text-foreground">{paper.subjectTitle}</h4>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
                      {paper.year}
                    </span>
                    <span className="rounded-full bg-background px-2.5 py-0.5 text-[10px] font-semibold text-foreground/90">
                      {PAPER_TYPE_LABELS[paper.paperType] ?? (paper.sessionType === "annual" ? tr("annual") : tr("supply"))}
                    </span>
                    {paper.driveUrl && <DriveLinkButton href={paper.driveUrl} className="px-2.5 py-1.5 text-[10px]" />}
                    {paper.pdfUrl && <DownloadGate url={pdfUrl(paper.pdfUrl)} compact />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
