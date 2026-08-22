"use client";

import { useEffect, useState } from "react";

import { apiFetchOrNull, getApiBaseUrl } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";

type ZipInfo = {
  chapterTitle: string;
  pdfCount: number;
  filenames: string[];
  downloadPath: string;
};

type ChapterZipDownloadProps = {
  board: string;
  classSlug: string;
  subject: string;
  chapter: string;
};

export function ChapterZipDownload({ board, classSlug, subject, chapter }: ChapterZipDownloadProps) {
  const { tr } = useLocale();
  const [info, setInfo] = useState<ZipInfo | null>(null);

  useEffect(() => {
    apiFetchOrNull<ZipInfo>(
      `/api/boards/${board}/classes/${classSlug}/subjects/${subject}/chapters/${chapter}/zip/info`,
    ).then(setInfo);
  }, [board, classSlug, subject, chapter]);

  if (!info || info.pdfCount === 0) return null;

  const href = `${getApiBaseUrl()}${info.downloadPath}`;

  return (
    <div className="mt-8 rounded-2xl border border-border bg-background p-5">
      <h2 className="text-lg font-bold text-foreground">{tr("chapterZipTitle")}</h2>
      <p className="mt-1 text-sm text-muted">{tr("chapterZipHint")}</p>
      <a
        href={href}
        download
        className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        {tr("downloadChapterZip").replace("{count}", String(info.pdfCount))}
      </a>
    </div>
  );
}
