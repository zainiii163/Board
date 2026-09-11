"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch, apiPatch } from "@/lib/api-client";
import type { ContentStatus } from "@/lib/shared-types";

type Chapter = {
  id: number;
  title: string;
  boardSlug: string;
  classSlug: string;
  subjectSlug: string;
  slug: string;
  status: ContentStatus;
  summary: string;
};

export default function ContentReviewPage() {
  const [queue, setQueue] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await apiAuthFetch<Chapter[]>("/api/chapters?status=in_review");
    setQueue(data);
    setLoading(false);
  }

  useEffect(() => {
    load().catch(() => {
      setQueue([]);
      setLoading(false);
    });
  }, []);

  async function approve(id: number) {
    await apiPatch(`/api/chapters/${id}/publish`);
    await load();
  }

  async function reject(id: number) {
    await apiPatch(`/api/chapters/${id}/reject`);
    await load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Content Review Queue</h1>
      <p className="mt-2 text-muted">Editors approve contributor notes before they go live on the public site.</p>

      <div className="mt-8 space-y-3">
        {loading && <p className="text-sm text-muted">Loading queue…</p>}
        {!loading && queue.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted">
            No chapters waiting for review. Teachers submit drafts from Manage Chapters.
          </div>
        )}
        {queue.map((item) => (
          <div key={item.id} className="rounded-2xl border border-accent/30 bg-card p-5">
            <span className="rounded-full bg-amber-500/15 px-2 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
              in review
            </span>
            <h2 className="mt-2 text-lg font-bold text-foreground">{item.title}</h2>
            <p className="mt-1 text-sm text-muted">
              {item.boardSlug}/{item.classSlug}/{item.subjectSlug}/{item.slug}
            </p>
            <p className="mt-3 text-sm text-foreground line-clamp-3">{item.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => approve(item.id)}
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Approve &amp; publish
              </button>
              <button
                type="button"
                onClick={() => reject(item.id)}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-background"
              >
                Send back to draft
              </button>
              <a
                href={`/admin/chapters`}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
              >
                Edit in CMS
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
