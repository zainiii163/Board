"use client";

import { useEffect, useState } from "react";

import { useLocale } from "@/lib/locale-context";

const KEY = "boardnotes_text_scale";
const levels = [0.9, 1, 1.1, 1.2] as const;

export function TextSizeControl() {
  const { tr } = useLocale();
  const [index, setIndex] = useState(1);

  useEffect(() => {
    queueMicrotask(() => {
      const saved = Number(localStorage.getItem(KEY));
      if (Number.isFinite(saved) && saved >= 0 && saved < levels.length) {
        setIndex(saved);
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, String(index));
    document.documentElement.style.setProperty("--text-scale", String(levels[index]));
  }, [index]);

  return (
    <div className="flex items-center gap-1 print:hidden">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{tr("textSizeLabel")}</span>
      <button
        type="button"
        onClick={() => setIndex((i) => Math.max(0, i - 1))}
        disabled={index === 0}
            className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold text-foreground disabled:opacity-40"
        aria-label={tr("decreaseTextSize")}
      >
        A−
      </button>
      <button
        type="button"
        onClick={() => setIndex((i) => Math.min(levels.length - 1, i + 1))}
        disabled={index === levels.length - 1}
            className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold text-foreground disabled:opacity-40"
        aria-label={tr("increaseTextSize")}
      >
        A+
      </button>
    </div>
  );
}
