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
  boardTitle: string;
  subjectTitle: string;
  classTitle: string;
  year: string;
  sessionType: "annual" | "supply";
  paperType: PastPaperType;
  pdfUrl: string | null;
  driveUrl: string | null;
};

const FILTERS: ("all" | PastPaperType)[] = ["all", "model", "first-annual", "second-annual", "pba"];

function normalizeBoardLabel(boardTitle: string, classTitle: string): string {
  if (!/federal|fbise/i.test(boardTitle)) return boardTitle;
  const match = classTitle.match(/\d+/);
  const classNum = match ? parseInt(match[0], 10) : 0;
  if (classNum >= 9) return "Federal Board (FBISE)";
  if (classNum > 0) return "National Book Foundation (NBF)";
  return boardTitle.replace(/\s*\(FBISE\)/i, "").trim() || "Federal Board";
}

export function PastPapersList({ papers }: { papers: PastPaperItem[] }) {
  const { tr } = useLocale();
  const [filter, setFilter] = useState<"all" | PastPaperType>("all");

  const visible = filter === "all" ? papers : papers.filter((p) => p.paperType === filter);

  return (
    <>
      <PageHeading titleKey="pastPapers" subtitleKey="pastPapersSubtitle" />
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
      </div>
      <div className="mt-4 space-y-3">
        {visible.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
            No papers in this category yet. Check back soon.
          </p>
        )}
        {visible.map((paper) => (
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
    </>
  );
}
