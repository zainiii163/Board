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
      <iframe
        src={fullUrl}
        title={title}
        className="h-[600px] w-full rounded border border-border"
      />
      <a
        href={fullUrl}
        download
        className="inline-block text-sm font-semibold text-accent hover:underline"
      >
        {tr("downloadPdf")}
      </a>
    </div>
  );
}
