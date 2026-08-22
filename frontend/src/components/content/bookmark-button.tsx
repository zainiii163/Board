"use client";

import { useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/locale-context";
import { apiPost } from "@/lib/api-client";

type BookmarkButtonProps = {
  title: string;
  path: string;
};

export function BookmarkButton({ title, path }: BookmarkButtonProps) {
  const { user } = useAuth();
  const { tr } = useLocale();
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");

  async function saveBookmark() {
    if (!user) {
      setMessage(tr("signInToSaveBookmarks"));
      return;
    }
    try {
      await apiPost("/api/bookmarks", { title, path }, true);
      setSaved(true);
      setMessage(tr("savedToAccount"));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : tr("couldNotSaveBookmark"));
    }
  }

  return (
    <div className="print:hidden">
      {user ? (
        <button
          type="button"
          onClick={saveBookmark}
          disabled={saved}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-background disabled:opacity-60"
        >
          {saved ? tr("bookmarked") : tr("saveBookmark")}
        </button>
      ) : (
        <Link
          href={`/login?next=${encodeURIComponent(path)}`}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-background"
        >
          {tr("signInToBookmark")}
        </Link>
      )}
      {message && <p className="mt-2 text-xs text-muted">{message}</p>}
    </div>
  );
}
