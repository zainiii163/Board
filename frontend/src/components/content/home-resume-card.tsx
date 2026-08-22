"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/locale-context";
import { apiAuthFetch } from "@/lib/api-client";

type ProgressEntry = {
  subjectKey: string;
  subjectLabel: string;
  percent: number;
  lastPath: string;
  lastLabel: string;
};

const LAST_PATH_KEY = "boardnotes_last_path";

export function HomeResumeCard() {
  const { user } = useAuth();
  const { tr } = useLocale();
  const [lastPath, setLastPath] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressEntry | null>(null);

  useEffect(() => {
    setLastPath(localStorage.getItem(LAST_PATH_KEY));
    if (user) {
      apiAuthFetch<ProgressEntry[]>("/api/progress")
        .then((rows) => setProgress(rows[0] ?? null))
        .catch(() => setProgress(null));
    }
  }, [user]);

  if (!lastPath && !progress) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{tr("continueStudying")}</p>
      {lastPath && (
        <Link href={lastPath} className="mt-2 block text-lg font-bold text-foreground hover:text-accent">
          {tr("resumeReading")}
        </Link>
      )}
      {progress && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">{progress.subjectLabel}</span>
            <span className="font-semibold text-accent">{progress.percent}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress.percent}%` }} />
          </div>
          {!user && (
            <p className="mt-2 text-xs text-muted">
              <Link href="/login" className="font-semibold text-accent hover:underline">
                {tr("signIn")}
              </Link>{" "}
              {tr("signInForProgress")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
