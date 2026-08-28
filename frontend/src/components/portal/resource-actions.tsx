"use client";

import { useEffect, useState } from "react";

import { apiFetch, pdfUrl } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";

type Props = {
  slug: string;
  fileUrl: string | null;
  downloads: number;
};

function formatCount(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

export function ResourceActions({ slug, fileUrl, downloads }: Props) {
  const { tr } = useLocale();
  const [count, setCount] = useState(downloads);
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  async function handleDownload() {
    try {
      await apiFetch(`/api/resources/${slug}/download`, { method: "POST" });
      setCount((c) => c + 1);
    } catch {
      // tracking is best-effort
    }
    if (fileUrl) window.open(pdfUrl(fileUrl), "_blank");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Check out this study resource: ${pageUrl}`)}`;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {fileUrl && (
          <>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M7 10l5 5 5-5" />
                <path d="M12 15V3" />
              </svg>
              {tr("downloadPdf")}
            </button>
            <a
              href="#pdf-reader"
              className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-6 py-3 text-sm font-bold text-accent transition hover:bg-accent/20"
            >
              {tr("readOnline")}
            </a>
          </>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-card"
        >
          {copied ? tr("copied") : tr("copyLink")}
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-card"
        >
          {tr("whatsApp")}
        </a>
      </div>
      <p className="text-xs font-semibold text-muted">
        {formatCount(count)} {tr("downloadsLabel")}
      </p>
    </div>
  );
}