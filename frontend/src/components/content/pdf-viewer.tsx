"use client";

type Props = {
  url: string;
  title: string;
};

export function PdfViewer({ url, title }: Props) {
  return (
    <div className="space-y-2">
      <iframe
        src={url}
        title={title}
        className="h-[600px] w-full rounded border border-border"
      />
      <a
        href={url}
        download
        className="inline-block text-sm text-accent hover:underline"
      >
        Download PDF
      </a>
    </div>
  );
}
