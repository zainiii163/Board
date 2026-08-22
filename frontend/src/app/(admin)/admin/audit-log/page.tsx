"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch } from "@/lib/api-client";
import type { AuditEntry } from "@boardnotes/shared";

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);

  useEffect(() => {
    apiAuthFetch<AuditEntry[]>("/api/audit").then(setLogs).catch(() => setLogs([]));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Audit Log</h1>
      <p className="mt-2 text-muted">Track publishing and admin actions.</p>

      <div className="mt-8 space-y-3">
        {logs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted">
            No audit entries yet. Actions like publish, unpublish, and role changes will appear here.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="rounded-2xl border border-border bg-card p-4">
              <p className="text-sm font-semibold text-foreground">{log.action}</p>
              <p className="mt-1 text-sm text-muted">{log.target}</p>
              <p className="mt-2 text-xs text-muted">
                {log.userName ?? log.userId} • {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
