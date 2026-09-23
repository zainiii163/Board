"use client";

import { useEffect, useState, useRef, useCallback, type FormEvent, type DragEvent } from "react";

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

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  mathematics: ["math", "algebra", "geometry", "calculus", "trigonometry", "maths"],
  physics: ["physics", "mechanics", "optics", "thermodynamics"],
  chemistry: ["chemistry", "organic", "inorganic", "periodic"],
  biology: ["biology", "botany", "zoology", "genetics"],
  english: ["english", "grammar", "literature", "writing"],
  urdu: ["urdu", "nazm", "ghazal"],
  computer: ["computer", "programming", "cs", "ict", "software"],
};

function suggestCategory(filename: string, categories: CategoryOption[]): string {
  const lower = filename.toLowerCase();
  for (const [key, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      const match = categories.find((c) => c.name.toLowerCase().includes(key));
      if (match) return String(match.id);
    }
  }
  return "";
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
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFile = useCallback(
    (f: File) => {
      setFile(f);
      if (!title.trim()) {
        const name = f.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
        setTitle(name);
      }
      if (!categoryId || categoryId === (categories[0] && String(categories[0].id))) {
        const suggested = suggestCategory(f.name, categories);
        if (suggested) setCategoryId(suggested);
      }
    },
    [title, categoryId, categories],
  );

  function handleDrag(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const token = getAuthToken();
    if (!token) return;
    setBusy(true);
    setMessage(null);
    setUploadProgress(0);
    try {
      const form = new FormData();
      form.append("title", title.trim());
      form.append("categoryId", categoryId);
      if (subject.trim()) form.append("subject", subject.trim());
      if (board.trim()) form.append("board", board.trim());
      if (description.trim()) form.append("description", description.trim());
      form.append("file", file as File);

      const xhr = new XMLHttpRequest();
      const result = await new Promise<{ ok: boolean; body: string }>((resolve) => {
        xhr.upload.addEventListener("progress", (ev) => {
          if (ev.lengthComputable) {
            setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        });
        xhr.addEventListener("load", () => resolve({ ok: xhr.status >= 200 && xhr.status < 300, body: xhr.responseText }));
        xhr.addEventListener("error", () => resolve({ ok: false, body: tr("uploadError") }));
        xhr.open("POST", `${getApiBaseUrl()}/api/resources`);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(form);
      });

      const data = (() => { try { return JSON.parse(result.body); } catch { return {}; } })();
      if (!result.ok) throw new Error(typeof data.error === "string" ? data.error : tr("uploadError"));
      setTitle("");
      setSubject("");
      setBoard("");
      setDescription("");
      setFile(null);
      setUploadProgress(0);
      setMessage(tr("uploadSuccess"));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : tr("uploadError"));
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {needsSignIn && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
          {tr("signInToUpload")}
        </div>
      )}

      {/* Card: File Upload */}
      <div className="rounded-2xl border border-border bg-background/50 p-5">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">{tr("formFile")} *</h3>
        <label
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200 ${
            dragActive
              ? "border-accent bg-accent/10 scale-[1.02]"
              : file
                ? "border-accent/40 bg-accent/5"
                : "border-border bg-card hover:border-accent/40 hover:bg-accent/5"
          }`}
        >
          {file ? (
            <>
              <div className="rounded-full bg-accent/10 p-3">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-foreground">{file.name}</span>
              <span className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              <span className="text-xs text-accent underline">Click to change file</span>
            </>
          ) : (
            <>
              <div className={`rounded-full p-3 transition-colors ${dragActive ? "bg-accent/20" : "bg-muted/10"}`}>
                <svg viewBox="0 0 24 24" className="h-10 w-10 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="M17 8l-5-5-5 5" />
                  <path d="M12 3v12" />
                </svg>
              </div>
              <span className="text-sm font-semibold">
                {dragActive ? "Drop your file here" : tr("browseFile")}
              </span>
              <span className="text-xs text-muted">{tr("fileHint")}</span>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </label>
      </div>

      {/* Card: Upload Progress */}
      {busy && (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-foreground">{tr("uploading")}</span>
            <span className="font-bold text-accent">{uploadProgress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Card: Basic Info */}
      <div className="rounded-2xl border border-border bg-background/50 p-5">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">Resource Details</h3>
        <div className="space-y-4">
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
      </div>

      {message && (
        <p
          className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${
            message === tr("uploadSuccess")
              ? "border-accent/30 bg-accent/10 text-accent"
              : "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-accent/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
      >
        {busy ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {tr("uploading")}
          </>
        ) : (
          tr("submitUpload")
        )}
      </button>
    </form>
  );
}
