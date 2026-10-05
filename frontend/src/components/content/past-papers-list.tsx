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

  // Group papers by subject for PBA organization
  const groupedBySubject = visible.reduce((acc, paper) => {
    const subject = paper.subjectTitle;
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(paper);
    return acc;
  }, {} as Record<string, typeof visible>);
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
        {Object.entries(groupedBySubject).map(([subject, papers]) => (
          <div key={subject}>
            <h3 className="mb-3 text-lg font-bold text-foreground">{subject}</h3>
            <div className="space-y-3">
              {papers.map((paper) => (
                <div
                  key={paper.id}
                  className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      {normalizeBoardLabel(paper.boardTitle, paper.classTitle)}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-foreground">{paper.subjectTitle}</h2>
                    <p className="text-sm text-muted">{paper.classTitle}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-accent/15 px-3 py-1 text-sm font-semibold text-accent">
                      {paper.year}
                    </span>
                    <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground/90">
                      {PAPER_TYPE_LABELS[paper.paperType] ?? (paper.sessionType === "annual" ? tr("annual") : tr("supply"))}
                    </span>
                    {paper.driveUrl && <DriveLinkButton href={paper.driveUrl} className="px-3 py-2 text-xs" />}
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
