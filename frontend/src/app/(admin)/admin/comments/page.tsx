"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch, apiDelete, apiPatch } from "@/lib/api-client";

type Comment = {
  id: number;
  userName: string;
  pagePath: string;
  questionRef: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export default function ModerateCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await apiAuthFetch<Comment[]>("/api/comments/moderation");
    setComments(data);
    setLoading(false);
  }

  useEffect(() => {
    apiAuthFetch<Comment[]>("/api/comments/moderation")
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function approve(id: number) {
    await apiPatch(`/api/comments/${id}/approve`);
    await load();
  }

  async function reject(id: number) {
    await apiPatch(`/api/comments/${id}/reject`);
    await load();
  }

  async function remove(id: number) {
    await apiDelete(`/api/comments/${id}`);
    await load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Moderate Comments</h1>
      <p className="mt-2 text-muted">Review student doubts before they appear on question pages.</p>

      <div className="mt-8 space-y-3">
        {loading && <p className="text-sm text-muted">Loading…</p>}
        {!loading && comments.length === 0 && (
          <p className="text-sm text-muted">No comments awaiting review.</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase text-accent">{comment.status}</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{comment.userName}</p>
            <p className="text-xs text-muted">{comment.questionRef}</p>
            <p className="mt-2 text-sm leading-6 text-foreground">{comment.body}</p>
            <p className="mt-2 text-xs text-muted">{comment.pagePath}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => approve(comment.id)} className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white">
                Approve
              </button>
              <button type="button" onClick={() => reject(comment.id)} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">
                Reject
              </button>
              <button type="button" onClick={() => remove(comment.id)} className="rounded-full px-3 py-1.5 text-xs font-semibold text-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
