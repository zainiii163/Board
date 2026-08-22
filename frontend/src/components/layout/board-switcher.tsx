"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { apiFetch } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";

type BoardOption = {
  slug: string;
  title: string;
  ready?: boolean;
};

export function BoardSwitcher() {
  const { tr } = useLocale();
  const [open, setOpen] = useState(false);
  const [boards, setBoards] = useState<BoardOption[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiFetch<BoardOption[]>("/api/boards")
      .then(setBoards)
      .catch(() => setBoards([]));
  }, []);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const readyBoards = boards.filter((b) => b.ready !== false);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="text-[13px] font-semibold text-foreground transition hover:text-accent"
      >
        {tr("boardsSection")}
        <span className="ml-1 text-[10px] text-muted" aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-30 mt-2 min-w-[220px] rounded-2xl border border-border bg-card p-2 shadow-lg"
        >
          {readyBoards.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted">{tr("boardComingSoon")}</p>
          ) : (
            readyBoards.map((board) => (
              <Link
                key={board.slug}
                href={`/${board.slug}`}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-background hover:text-accent"
              >
                {board.title}
              </Link>
            ))
          )}
          <Link
            href="/#boards"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-xl border-t border-border px-3 py-2 text-xs font-semibold text-accent"
          >
            {tr("browseAll")} →
          </Link>
        </div>
      )}
    </div>
  );
}
