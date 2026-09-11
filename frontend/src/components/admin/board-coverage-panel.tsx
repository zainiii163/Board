"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { apiAuthFetch, apiFetch } from "@/lib/api-client";
import type { ContentStatus } from "@/lib/shared-types";

type BoardCatalog = {
  slug: string;
  title: string;
  ready?: boolean;
  chapterCount?: number;
  classCount?: number;
};

type ChapterRow = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  status: ContentStatus;
  exerciseCount: number;
};

type CoverageRow = {
  slug: string;
  title: string;
  classes: number;
  chapters: number;
  published: number;
  inReview: number;
  drafts: number;
  exercises: number;
  ready: boolean;
};

export function BoardCoveragePanel() {
  const [boards, setBoards] = useState<BoardCatalog[]>([]);
  const [chapters, setChapters] = useState<ChapterRow[]>([]);

  useEffect(() => {
    apiFetch<BoardCatalog[]>("/api/boards").then(setBoards).catch(() => setBoards([]));
    apiAuthFetch<ChapterRow[]>("/api/chapters").then(setChapters).catch(() => setChapters([]));
  }, []);

  const rows = useMemo<CoverageRow[]>(() => {
    return boards.map((board) => {
      const boardChapters = chapters.filter((c) => c.boardSlug === board.slug);
      return {
        slug: board.slug,
        title: board.title,
        classes: board.classCount ?? 0,
        chapters: boardChapters.length,
        published: boardChapters.filter((c) => c.status === "published").length,
        inReview: boardChapters.filter((c) => c.status === "in_review").length,
        drafts: boardChapters.filter((c) => c.status === "draft").length,
        exercises: boardChapters.reduce((sum, c) => sum + (c.exerciseCount ?? 0), 0),
        ready: Boolean(board.ready ?? boardChapters.some((c) => c.status === "published")),
      };
    });
  }, [boards, chapters]);

  if (rows.length === 0) return null;

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Board coverage</h2>
          <p className="mt-1 text-sm text-muted">Published chapters and pipeline status per board.</p>
        </div>
        <Link href="/admin/chapters" className="text-sm font-semibold text-accent hover:underline">
          Manage chapters →
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th className="px-2 py-2 font-semibold">Board</th>
              <th className="px-2 py-2 font-semibold">Status</th>
              <th className="px-2 py-2 font-semibold">Published</th>
              <th className="px-2 py-2 font-semibold">In review</th>
              <th className="px-2 py-2 font-semibold">Drafts</th>
              <th className="px-2 py-2 font-semibold">Exercises</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.slug} className="border-b border-border/70 last:border-0">
                <td className="px-2 py-3">
                  <p className="font-semibold text-foreground">{row.title}</p>
                  <p className="text-xs text-muted">
                    /{row.slug} · {row.classes} classes · {row.chapters} chapters
                  </p>
                </td>
                <td className="px-2 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                      row.ready ? "bg-accent/15 text-accent" : "bg-background text-muted"
                    }`}
                  >
                    {row.ready ? "Ready" : "Empty"}
                  </span>
                </td>
                <td className="px-2 py-3 font-semibold text-foreground">{row.published}</td>
                <td className="px-2 py-3 text-foreground">{row.inReview}</td>
                <td className="px-2 py-3 text-foreground">{row.drafts}</td>
                <td className="px-2 py-3 text-foreground">{row.exercises}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
