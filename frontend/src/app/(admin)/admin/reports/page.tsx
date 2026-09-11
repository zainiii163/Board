"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch, apiPatch } from "@/lib/api-client";
import type { ReportTicket } from "@/lib/shared-types";

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiAuthFetch<ReportTicket[]>("/api/reports")
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  async function resolveReport(id: number) {
    const updated = await apiPatch<ReportTicket>(`/api/reports/${id}/resolve`);
    setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Reports &amp; Tickets</h1>
      <p className="mt-2 text-muted">Student-submitted mistake reports.</p>

      <div className="mt-8 space-y-3">
        {loading && <p className="text-sm text-muted">Loading reports…</p>}
        {!loading && reports.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted">
            No reports yet. When students flag a question, tickets will appear here.
          </div>
        )}
        {reports.map((report) => (
          <div key={report.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    report.status === "open"
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                      : "bg-accent/15 text-accent"
                  }`}
                >
                  {report.status}
                </span>
                <p className="mt-2 text-sm font-semibold text-foreground">{report.questionRef ?? "General page report"}</p>
                <a href={report.pageUrl} className="mt-1 block text-sm text-accent hover:underline">
                  {report.pageUrl}
                </a>
              </div>
              {report.status === "open" && (
                <button
                  type="button"
                  onClick={() => resolveReport(report.id)}
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
                >
                  Mark resolved
                </button>
              )}
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-foreground">{report.message}</p>
            <p className="mt-3 text-xs text-muted">{new Date(report.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
