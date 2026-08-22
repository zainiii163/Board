"use client";

import { useEffect } from "react";

const LAST_PATH_KEY = "boardnotes_last_path";

export function ContinueReadingTracker({ path }: { path: string }) {
  useEffect(() => {
    localStorage.setItem(LAST_PATH_KEY, path);
  }, [path]);

  return null;
}
