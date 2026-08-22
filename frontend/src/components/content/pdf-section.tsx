"use client";

import { useEducationalNotice } from "@/components/content/legal-page-content";
import { useLocale } from "@/lib/locale-context";

import { PdfViewer } from "./pdf-viewer";

type Props = {
  url: string;
  title: string;
};

export function PdfSection({ url, title }: Props) {
  const { tr } = useLocale();
  const notice = useEducationalNotice();

  return (
    <div className="mt-8 rounded-2xl border border-border bg-background p-5 print:hidden">
      <h2 className="mb-2 text-lg font-bold text-foreground">{tr("viewDownloadPdf")}</h2>
      <p className="mb-4 text-xs text-muted">{notice}</p>
      <PdfViewer url={url} title={title} />
    </div>
  );
}
