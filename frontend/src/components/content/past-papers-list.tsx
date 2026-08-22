"use client";

import { PageHeading } from "@/components/layout/page-heading";
import { useLocale } from "@/lib/locale-context";
import { pdfUrl } from "@/lib/api-client";

export type PastPaperItem = {
  id: number;
  boardTitle: string;
  subjectTitle: string;
  classTitle: string;
  year: string;
  sessionType: "annual" | "supply";
  pdfUrl: string | null;
};

export function PastPapersList({ papers }: { papers: PastPaperItem[] }) {
  const { tr } = useLocale();

  return (
    <>
      <PageHeading titleKey="pastPapers" subtitleKey="pastPapersSubtitle" />
      <div className="mt-8 space-y-3">
        {papers.map((paper) => (
          <div
            key={paper.id}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{paper.boardTitle}</p>
              <h2 className="mt-1 text-lg font-bold text-foreground">{paper.subjectTitle}</h2>
              <p className="text-sm text-muted">{paper.classTitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-accent/15 px-3 py-1 text-sm font-semibold text-accent">
                {paper.year}
              </span>
              <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground/90">
                {paper.sessionType === "annual" ? tr("annual") : tr("supply")}
              </span>
              {paper.pdfUrl && (
                <a href={pdfUrl(paper.pdfUrl)} className="text-sm font-semibold text-accent hover:underline" download>
                  {tr("downloadPdf")}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
