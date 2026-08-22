"use client";

import { useState, type FormEvent } from "react";

import { apiPost } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";

type ReportMistakeFormProps = {
  pageUrl: string;
  boardSlug: string;
  questionRef: string;
};

export function ReportMistakeForm({ pageUrl, boardSlug, questionRef }: ReportMistakeFormProps) {
  const { tr } = useLocale();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await apiPost("/api/reports", { pageUrl, boardSlug, questionRef, message });
      setStatus("success");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : tr("couldNotSubmitReport"));
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-border bg-background p-5 print:hidden">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-sm font-semibold text-accent hover:underline"
        >
          {tr("reportMistake")}
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-sm font-semibold text-foreground">{tr("tellUsWrong")}</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-24 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
            placeholder={tr("describeError")}
            minLength={10}
            required
          />
          {status === "success" && <p className="text-sm text-accent">{tr("reportThanks")}</p>}
          {status === "error" && <p className="text-sm text-red-600 dark:text-red-300">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {status === "loading" ? tr("sending") : tr("submitReport")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
            >
              {tr("cancel")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
