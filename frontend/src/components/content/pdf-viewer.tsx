"use client";

import { pdfUrl } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";

type Props = {
  url: string;
  title: string;
};

export function PdfViewer({ url, title }: Props) {
  const { tr } = useLocale();
  const fullUrl = pdfUrl(url);

  return (
    <div className="space-y-2">
      <div className="relative w-full overflow-hidden rounded-xl border border-border">
        <iframe
          src={fullUrl}
          title={title}
          className="h-[50vh] w-full sm:h-[60vh] lg:h-[700px]"
        />
      </div>
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:underline"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="M7 10l5 5 5-5" />
          <path d="M12 15V3" />
        </svg>
        {tr("downloadPdf")}
      </a>
    </div>
  );
}
