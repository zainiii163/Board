"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

import { getApiBaseUrl, getAuthToken } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";
import { useAuth } from "@/lib/auth-context";
import { type PortalCategory } from "@/components/portal/portal-types";

type CategoryOption = {
  id: number;
  name: string;
  parentName?: string;
};

async function loadCategories(): Promise<CategoryOption[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/categories`);
    const data = await res.json();
    const flat: CategoryOption[] = [];
    for (const top of (data.tree ?? []) as PortalCategory[]) {
      if (top.children && top.children.length > 0) {
        for (const child of top.children) {
          flat.push({ id: child.id, name: `${child.name} (${top.name})`, parentName: top.name });
        }
      } else {
        flat.push({ id: top.id, name: top.name });
      }
    }
    return flat;
  } catch {
    return [];
  }
}

type UploadFormProps = {
  defaultCategoryId?: number;
};

export function UploadForm({ defaultCategoryId }: UploadFormProps) {
  const { tr } = useLocale();
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>(defaultCategoryId ? String(defaultCategoryId) : "");
  const [subject, setSubject] = useState("");
  const [board, setBoard] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadCategories().then((list) => {
      if (cancelled) return;
      setCategories(list);
      if (list.length > 0) setCategoryId((prev) => prev || String(list[0].id));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const needsSignIn = !authLoading && !user;
  const canSubmit = Boolean(title.trim() && categoryId && file && !busy);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const token = getAuthToken();
    if (!token) return;
    setBusy(true);
    setMessage(null);
    try {
      const form = new FormData();
      form.append("title", title.trim());
      form.append("categoryId", categoryId);
      if (subject.trim()) form.append("subject", subject.trim());
      if (board.trim()) form.append("board", board.trim());
      if (description.trim()) form.append("description", description.trim());
      form.append("file", file as File);
      const res = await fetch(`${getApiBaseUrl()}/api/resources`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : tr("uploadError"));
      setTitle("");
      setSubject("");
      setBoard("");
      setDescription("");
      setFile(null);
      setMessage(tr("uploadSuccess"));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : tr("uploadError"));
    } finally {
      setBusy(false);
    }
  }

  const selectedName = useMemo(() => categories.find((c) => c.id === Number(categoryId))?.name, [categories, categoryId]);

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {needsSignIn && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
          {tr("signInToUpload")}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-semibold" htmlFor="u-title">
          {tr("formTitle")} *
        </label>
        <input
          id="u-title"
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. 9th Class English Solved Exercises PDF"
          maxLength={120}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold" htmlFor="u-cat">
          {tr("formCategory")} *
        </label>
        <select
          id="u-cat"
          className={inputClass}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted">{selectedName ?? " "}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="u-subject">
            {tr("formSubject")}
          </label>
          <input
            id="u-subject"
            className={inputClass}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Physics / Urdu / Math"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="u-board">
            {tr("formBoard")}
          </label>
          <input
            id="u-board"
            className={inputClass}
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            placeholder="Punjab / Sindh / Federal"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold" htmlFor="u-desc">
          {tr("formDescription")}
        </label>
        <textarea
          id="u-desc"
          className={`${inputClass} min-h-24 resize-y`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={tr("formDescription")}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold" htmlFor="u-file">
          {tr("formFile")} *
        </label>
        <label
          className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-background px-6 py-10 text-center transition hover:border-accent"
        >
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M17 8l-5-5-5 5" />
            <path d="M12 3v12" />
          </svg>
          <span className="text-sm font-semibold">
            {file ? file.name : tr("browseFile")}
          </span>
          <span className="text-xs text-muted">{tr("fileHint")}</span>
          <input
            id="u-file"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      {message && (
        <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? tr("uploading") : tr("submitUpload")}
      </button>
    </form>
  );
}