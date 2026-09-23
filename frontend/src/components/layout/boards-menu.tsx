"use client";

import Link from "next/link";
import { useState } from "react";

import { NAV_BOARDS, NAV_CLASSES } from "@/lib/constants";
import { useLocale } from "@/lib/locale-context";

const CLASS_LABEL = (num: number) => `${num}th Class`;

export function BoardsMenu() {
  const { tr } = useLocale();
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const active = NAV_BOARDS.find((b) => b.slug === activeSlug) ?? null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setOpen(false);
        setActiveSlug(null);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold text-foreground/80 transition hover:bg-accent/10 hover:text-accent whitespace-nowrap"
      >
        {tr("boards")}
        <svg viewBox="0 0 24 24" className={`h-2 w-2 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-[640px] rounded-2xl border border-border bg-card p-3 shadow-2xl animate-scale-in backdrop-blur-sm">
          <div className="flex gap-3">
            {/* Boards column */}
            <div className="w-48 shrink-0 space-y-1">
              {NAV_BOARDS.map((board) => (
                <button
                  key={board.slug}
                  type="button"
                  onMouseEnter={() => setActiveSlug(board.slug)}
                  onClick={() => setActiveSlug(board.slug)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-all duration-200 ${
                    activeSlug === board.slug
                      ? "bg-accent/10 text-accent"
                      : "text-foreground hover:bg-background hover:text-accent hover:pl-4"
                  }`}
                >
                  {board.label}
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 6 6 6-6 6" /></svg>
                </button>
              ))}
              <Link
                href="/books"
                className="mt-1 block rounded-xl border-t border-border px-3 py-2 text-[11px] font-bold text-accent"
              >
                {tr("books")} →
              </Link>
            </div>

            {/* Books / Notes by class */}
            {active ? (
              <div className="min-w-0 flex-1 space-y-3 rounded-xl bg-background/70 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{active.label}</p>
                  <Link href={`/${active.slug}`} className="text-[11px] font-bold text-foreground hover:text-accent">
                    View Board →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                      <span className="text-sm">📚</span>{tr("books")}
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {NAV_CLASSES.map((num) => (
                        <Link
                          key={`books-${num}`}
                          href={`/${active.slug}/${num}?view=books`}
                          className="rounded-lg px-2 py-1.5 text-[12px] font-semibold text-foreground transition hover:bg-accent/10 hover:text-accent"
                        >
                          {CLASS_LABEL(num)}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                      <span className="text-sm">📝</span>{tr("notes")}
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {NAV_CLASSES.map((num) => (
                        <Link
                          key={`notes-${num}`}
                          href={`/${active.slug}/${num}`}
                          className="rounded-lg px-2 py-1.5 text-[12px] font-semibold text-foreground transition hover:bg-accent/10 hover:text-accent"
                        >
                          {CLASS_LABEL(num)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="flex flex-1 items-center justify-center rounded-xl bg-background/70 p-3 text-xs text-muted">
                Select a board to browse its classes
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}