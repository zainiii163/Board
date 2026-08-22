"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch } from "@/lib/api-client";
import type { ContactMessage } from "@boardnotes/shared";

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    apiAuthFetch<ContactMessage[]>("/api/contact").then(setMessages).catch(() => setMessages([]));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Contact Messages</h1>
      <p className="mt-2 text-muted">Messages submitted from the public contact form.</p>

      <div className="mt-8 space-y-3">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted">
            No contact messages yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">{msg.name}</p>
                  <a href={`mailto:${msg.email}`} className="text-sm text-accent hover:underline">
                    {msg.email}
                  </a>
                </div>
                <p className="text-xs text-muted">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-foreground">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
