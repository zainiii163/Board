"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

import { apiFetch, apiPost } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/locale-context";

type Comment = {
  id: number;
  userName: string;
  body: string;
  createdAt: string;
};

type QuestionCommentsProps = {
  pagePath: string;
  questionRef: string;
};

export function QuestionComments({ pagePath, questionRef }: QuestionCommentsProps) {
  const { tr } = useLocale();
  const { user, loading } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<Comment[]>(`/api/comments?path=${encodeURIComponent(pagePath)}`)
      .then(setComments)
      .catch(() => setComments([]));
  }, [pagePath, status]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setStatus("loading");
    setError("");
    try {
      await apiPost("/api/comments", { pagePath, questionRef, body }, true);
      setBody("");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : tr("couldNotSubmitComment"));
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-5 print:hidden">
      <h2 className="text-lg font-bold text-foreground">{tr("askDoubt")}</h2>
      <p className="mt-1 text-sm text-muted">{tr("askDoubtDesc")}</p>

      <div className="mt-4 space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-muted">{tr("noCommentsYet")}</p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-semibold text-accent">{comment.userName}</p>
              <p className="mt-2 text-sm leading-6 text-foreground">{comment.body}</p>
            </article>
          ))
        )}
      </div>

      {!loading && user ? (
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={tr("doubtPlaceholder")}
            rows={3}
            required
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          />
          {status === "success" && <p className="text-sm text-accent">{tr("commentSubmitted")}</p>}
          {status === "error" && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {tr("submitDoubt")}
          </button>
        </form>
      ) : (
        !loading && (
          <p className="mt-4 text-sm text-muted">
            <Link href="/login" className="font-semibold text-accent hover:underline">
              {tr("signIn")}
            </Link>{" "}
            {tr("signInToAskDoubt")}
          </p>
        )
      )}
    </div>
  );
}
