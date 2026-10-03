"use client";

import { useEffect, useRef, useState } from "react";

import { useLocale } from "@/lib/locale-context";
import { AdBanner } from "@/components/portal/ad-banner";

function detectAdBlocker(): boolean {
  if (typeof window === "undefined") return false;
  const probe = document.createElement("div");
  probe.className = "ad-banner-adzerk ad-banner-doubleclick adsbox leaderboard-ad ad-frame";
  probe.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;";
  document.body.appendChild(probe);
  const style = window.getComputedStyle(probe);
  const height = document.body.contains(probe) ? probe.getBoundingClientRect().height : 0;
  const blocked = height === 0 || style.display === "none" || style.visibility === "hidden";
  probe.remove();
  return blocked;
}

type Props = {
  url: string;
  label?: string;
  seconds?: number;
  compact?: boolean;
  /** Set false when the gate sits in a page header — ads must never render at the top. */
  showAd?: boolean;
  onDownload?: () => void;
};

export function DownloadGate({ url, label, seconds = 12, compact = false, showAd = true, onDownload }: Props) {
  const { tr } = useLocale();
  const text = label ?? tr("downloadPdf");
  const btnClass = compact
    ? "inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
    : "inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90";

  const isDrive = url.includes("drive.google.com") || url.includes("docs.google.com");
  const skipGate = isDrive;

  const [state, setState] = useState<"idle" | "waiting" | "ready">("idle");
  const [left, setLeft] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  if (skipGate) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" onClick={onDownload} className={btnClass}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M12.01 1.485c0 0-5.304 1.5-7.673 2.236C3.23 3.96 2.5 4.81 2.5 5.82v10.36c0 1.01.73 1.86 1.837 2.099 2.369.736 7.673 2.236 7.673 2.236s5.304-1.5 7.673-2.236c1.107-.239 1.837-1.089 1.837-2.099V5.82c0-1.01-.73-1.86-1.837-2.099-2.369-.736-7.673-2.236-7.673-2.236zM12 17.5l-5-2.5v-5l5 2.5v5zm0-6.5l-5-2.5 5-2.5 5 2.5-5 2.5zm5 4l-5 2.5v-5l5-2.5v5z" />
        </svg>
        Open in Drive
      </a>
    );
  }

  function start() {
    if (timer.current) clearInterval(timer.current);
    const blocked = detectAdBlocker();
    const secondsToWait = blocked ? 0 : Math.max(1, seconds);
    setLeft(secondsToWait);
    setState("waiting");
    if (secondsToWait === 0) {
      setState("ready");
      return;
    }
    timer.current = setInterval(() => {
      setLeft((n) => {
        if (n <= 1) {
          if (timer.current) clearInterval(timer.current);
          setState("ready");
          return 0;
        }
        return n - 1;
      });
    }, 1000);
  }

  if (state === "idle") {
    return (
      <button type="button" onClick={start} className={btnClass}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="M7 10l5 5 5-5" />
          <path d="M12 15V3" />
        </svg>
        {text}
      </button>
    );
  }

  if (state === "waiting") {
    return (
      <div className={compact ? "w-full max-w-[320px]" : "w-full max-w-xl"}>
        {showAd && <AdBanner size="inline" />}
        <button
          type="button"
          disabled
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-muted"
        >
          <span>{text}</span>
          <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          {left}s
        </button>
      </div>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" onClick={onDownload} className={btnClass}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M7 10l5 5 5-5" />
        <path d="M12 15V3" />
      </svg>
      {text}
    </a>
  );
}