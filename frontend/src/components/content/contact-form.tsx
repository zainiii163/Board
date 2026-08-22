"use client";

import { useState, type FormEvent } from "react";

import { apiPost } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";

export function ContactForm() {
  const { tr } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await apiPost("/api/contact", { name, email, message });
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : tr("couldNotSendMessage"));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">{tr("fullName")}</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-accent"
          placeholder={tr("yourName")}
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">{tr("email")}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-accent"
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">{tr("message")}</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-32 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-accent"
          placeholder={tr("howCanWeHelp")}
          required
          minLength={10}
        />
      </div>
      {status === "success" && (
        <p className="rounded-xl bg-accent/15 px-4 py-3 text-sm text-accent">{tr("messageSent")}</p>
      )}
      {status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? tr("sending") : tr("sendMessage")}
      </button>
    </form>
  );
}
