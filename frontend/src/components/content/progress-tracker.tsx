"use client";

import { useEffect } from "react";

import { useAuth } from "@/lib/auth-context";
import { apiPost } from "@/lib/api-client";

type ProgressTrackerProps = {
  path: string;
  subjectKey: string;
  chapterSlug: string;
  label: string;
};

const LAST_PATH_KEY = "boardnotes_last_path";

export function ProgressTracker({ path, subjectKey, chapterSlug, label }: ProgressTrackerProps) {
  const { user } = useAuth();

  useEffect(() => {
    localStorage.setItem(LAST_PATH_KEY, path);
  }, [path]);

  useEffect(() => {
    if (!user) return;
    apiPost("/api/progress/track", { subjectKey, chapterSlug, path, label }, true).catch(() => {});
  }, [user, path, subjectKey, chapterSlug, label]);

  return null;
}
