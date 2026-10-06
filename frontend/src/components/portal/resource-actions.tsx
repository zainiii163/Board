"use client";

import { useState } from "react";
import { BookOpen, Check, Link2, MessageCircle } from "lucide-react";

import { apiFetch, pdfUrl } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";
import { DownloadGate } from "@/components/content/download-gate";

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
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  async function trackDownload() {
    try {
      await apiFetch(`/api/resources/${slug}/download`, { method: "POST" });
      setCount((c) => c + 1);
    } catch {
      // tracking is best-effort
    }
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
            <DownloadGate
              url={pdfUrl(fileUrl)}
              label={tr("downloadPdf")}
              showAd={false}
              onDownload={trackDownload}
            />
            {!fileUrl.includes("drive.google.com") && !fileUrl.includes("docs.google.com") && (
              <a
                href="#pdf-reader"
                className="pressable inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-6 py-3 text-sm font-bold text-accent transition hover:bg-accent/20"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                {tr("readOnline")}
              </a>
            )}
          </>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="pressable inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition hover:border-accent/50 hover:text-accent"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
          {copied ? tr("copied") : tr("copyLink")}
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition hover:border-accent/50 hover:text-accent"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {tr("whatsApp")}
        </a>
      </div>
      <p className="text-xs font-semibold text-muted">
        {formatCount(count)} {tr("downloadsLabel")}
      </p>
    </div>
  );
}