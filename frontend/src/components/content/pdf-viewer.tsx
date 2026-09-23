"use client";

import { pdfUrl } from "@/lib/api-client";
import { DownloadGate } from "@/components/content/download-gate";

type Props = {
  url: string;
  title: string;
};

export function PdfViewer({ url, title }: Props) {
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
      <DownloadGate url={fullUrl} />
    </div>
  );
}
