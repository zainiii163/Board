"use client";

import { useCallback, useEffect, useState } from "react";

import { MathText } from "@/components/content/math-text";
import { useAuth } from "@/lib/auth-context";
import { apiAuthFetchWithQuery, apiPost } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";
import { pickLocalized } from "@/lib/i18n";

export type Flashcard = {
  term: string;
  definition: string;
  termUr?: string;
  definitionUr?: string;
};

type FlashcardProgress = {
  chapterKey: string;
  masteredIndices: number[];
};

function storageKey(chapterKey: string) {
  return `boardnotes_flashcards:${chapterKey}`;
}

function readLocalProgress(chapterKey: string): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(chapterKey));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n): n is number => Number.isInteger(n) && n >= 0);
  } catch {
    return [];
  }
}

function writeLocalProgress(chapterKey: string, indices: number[]) {
  localStorage.setItem(storageKey(chapterKey), JSON.stringify(indices));
}

export function ChapterFlashcards({
  cards,
  chapterKey,
}: {
  cards: Flashcard[];
  chapterKey: string;
}) {
  const { tr, locale } = useLocale();
  const { user } = useAuth();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);

  const loadProgress = useCallback(async () => {
    if (user) {
      try {
        const data = await apiAuthFetchWithQuery<FlashcardProgress>("/api/progress/flashcards", {
          chapterKey,
        });
        setMastered(new Set(data.masteredIndices));
        return;
      } catch {
        // fall through to local
      }
    }
    setMastered(new Set(readLocalProgress(chapterKey)));
  }, [user, chapterKey]);

  useEffect(() => {
    (async () => {
      try {
        if (user) {
          try {
            const data = await apiAuthFetchWithQuery<FlashcardProgress>("/api/progress/flashcards", {
              chapterKey,
            });
            setMastered(new Set(data.masteredIndices));
            return;
          } catch {
            // fall through to local
          }
        }
        setMastered(new Set(readLocalProgress(chapterKey)));
      } catch {
        setMastered(new Set());
      }
    })();
  }, [user, chapterKey]);

  if (cards.length === 0) return null;

  const card = cards[index];
  const front = pickLocalized(locale, card.term, card.termUr);
  const back = pickLocalized(locale, card.definition, card.definitionUr);
  const masteredCount = mastered.size;
  const percent = Math.round((masteredCount / cards.length) * 100);
  const isMastered = mastered.has(index);

  function goTo(next: number) {
    setIndex(next);
    setFlipped(false);
  }

  async function toggleMastered() {
    const nextMastered = !isMastered;
    const nextSet = new Set(mastered);
    if (nextMastered) nextSet.add(index);
    else nextSet.delete(index);
    setMastered(nextSet);
    setSaving(true);

    try {
      if (user) {
        const data = await apiPost<FlashcardProgress>(
          "/api/progress/flashcards",
          { chapterKey, cardIndex: index, mastered: nextMastered },
          true,
        );
        setMastered(new Set(data.masteredIndices));
      } else {
        writeLocalProgress(chapterKey, [...nextSet].sort((a, b) => a - b));
      }
    } catch {
      await loadProgress();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-border bg-background p-5 print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-foreground">{tr("flashcards")}</h2>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {index + 1} / {cards.length}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">{tr("flashcardsDesc")}</p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-muted">
          <span>{tr("flashcardProgress")}: {masteredCount}/{cards.length}</span>
          <span className="text-accent">{percent}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/60">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {cards.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${tr("flashcardDot")} ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === index
                ? "ring-2 ring-accent/50 ring-offset-1 ring-offset-background"
                : ""
            } ${mastered.has(i) ? "bg-emerald-500" : "bg-border"}`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="mt-4 flex min-h-[180px] w-full flex-col items-center justify-center rounded-2xl border border-accent/30 bg-card p-6 text-center shadow-sm transition hover:border-accent/60"
        aria-label={flipped ? tr("showTerm") : tr("showDefinition")}
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
          {flipped ? tr("definitionLabel") : tr("termLabel")}
        </p>
        <div className="mt-4 text-lg font-semibold leading-8 text-foreground">
          <MathText text={flipped ? back : front} />
        </div>
        <p className="mt-4 text-xs font-semibold text-accent">{tr("tapToFlip")}</p>
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => goTo(Math.max(0, index - 1))}
          disabled={index === 0}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground disabled:opacity-40"
        >
          {tr("previous")}
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            {tr("flipCard")}
          </button>
          <button
            type="button"
            onClick={() => toggleMastered()}
            disabled={saving}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              isMastered
                ? "border border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border border-border bg-card text-foreground"
            }`}
          >
            {isMastered ? tr("flashcardMastered") : tr("flashcardGotIt")}
          </button>
        </div>
        <button
          type="button"
          onClick={() => goTo(Math.min(cards.length - 1, index + 1))}
          disabled={index >= cards.length - 1}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground disabled:opacity-40"
        >
          {tr("next")}
        </button>
      </div>

      {!user && (
        <p className="mt-3 text-center text-xs text-muted">{tr("signInForFlashcardSync")}</p>
      )}
    </div>
  );
}
