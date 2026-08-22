"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { listOfflineChapters, removeOfflineChapter, type OfflineChapterRecord } from "@/lib/offline-chapters";
import { useLocale } from "@/lib/locale-context";

export function SavedOfflineCard() {
  const { tr } = useLocale();
  const [entries, setEntries] = useState<OfflineChapterRecord[]>([]);

  useEffect(() => {
    setEntries(listOfflineChapters());
  }, []);

  if (entries.length === 0) return null;

  function remove(path: string) {
    removeOfflineChapter(path);
    setEntries(listOfflineChapters());
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{tr("savedOffline")}</p>
      <ul className="mt-3 space-y-2">
        {entries.slice(0, 4).map((entry) => (
          <li key={entry.path} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2">
            <div>
              <Link href={entry.path} className="font-semibold text-foreground hover:text-accent">
                {entry.title}
              </Link>
              <p className="text-xs text-muted">{entry.subjectLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => remove(entry.path)}
              className="text-xs font-semibold text-muted hover:text-foreground"
            >
              {tr("removeOffline")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
