"use client";

import { useState } from "react";

import { useLocale } from "@/lib/locale-context";

export function ShareButtons({ title }: { title?: string }) {
  const { tr } = useLocale();
  const [copied, setCopied] = useState(false);

  function getUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  async function copyLink() {
    await navigator.clipboard.writeText(getUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(`${title ? `${title} — ` : ""}${getUrl()}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title, url: getUrl() });
    } else {
      copyLink();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{tr("share")}</span>
      <button
        type="button"
        onClick={copyLink}
        className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-background"
      >
        {copied ? tr("copied") : tr("copyLink")}
      </button>
      <button
        type="button"
        onClick={shareWhatsApp}
        className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-background"
      >
        {tr("whatsApp")}
      </button>
      <button
        type="button"
        onClick={nativeShare}
        className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
      >
        {tr("share")}
      </button>
    </div>
  );
}
