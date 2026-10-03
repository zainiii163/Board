"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownToLine, HardDriveDownload, Loader2 } from "lucide-react";

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
  const reduceMotion = useReducedMotion();
  const text = label ?? tr("downloadPdf");
  const btnClass = compact
    ? "pressable inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent to-accent-2 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:shadow-md hover:shadow-accent/25"
    : "pressable inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-2 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:shadow-lg hover:shadow-accent/30";

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
        <HardDriveDownload className="h-4 w-4" aria-hidden="true" />
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
      <motion.button
        type="button"
        onClick={start}
        className={btnClass}
        whileHover={reduceMotion ? undefined : { y: -2 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
      >
        <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
        {text}
      </motion.button>
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
          <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden="true" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={left}
              initial={reduceMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="tabular-nums"
            >
              {left}s
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    );
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onDownload}
      className={btnClass}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
    >
      <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
      {text}
    </motion.a>
  );
}