"use client";

import { useEffect, useState } from "react";

import {
  cacheUrlsForOffline,
  isChapterSavedOffline,
  removeOfflineChapter,
  saveOfflineChapter,
  type OfflineChapterRecord,
} from "@/lib/offline-chapters";
import { getApiBaseUrl } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";

type SaveOfflineButtonProps = {
  path: string;
  title: string;
  subjectLabel: string;
  apiPath: string;
  payload: unknown;
  exercisePaths?: string[];
};

export function SaveOfflineButton({
  path,
  title,
  subjectLabel,
  apiPath,
  payload,
  exercisePaths = [],
}: SaveOfflineButtonProps) {
  const { tr } = useLocale();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSaved(isChapterSavedOffline(path));
  }, [path]);

  async function save() {
    setBusy(true);
    try {
      const apiUrl = `${getApiBaseUrl()}${apiPath}`;
      const record: OfflineChapterRecord = {
        path,
        title,
        subjectLabel,
        savedAt: new Date().toISOString(),
        apiUrl,
        payload,
      };
      saveOfflineChapter(record);
      await cacheUrlsForOffline([path, apiUrl, ...exercisePaths]);
      setSaved(true);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    removeOfflineChapter(path);
    setSaved(false);
  }

  return (
    <div className="mt-6 rounded-2xl border border-border bg-background p-4 print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{tr("offlineReading")}</p>
          <p className="mt-1 text-xs text-muted">{tr("offlineReadingDesc")}</p>
        </div>
        {saved ? (
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
              {tr("savedOffline")}
            </span>
            <button
              type="button"
              onClick={remove}
              className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted hover:bg-card"
            >
              {tr("removeOffline")}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {busy ? tr("pleaseWait") : tr("saveForOffline")}
          </button>
        )}
      </div>
    </div>
  );
}
