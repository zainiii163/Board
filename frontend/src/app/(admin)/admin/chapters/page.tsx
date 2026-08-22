"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch, apiDelete, apiPatch, apiPost, apiPut } from "@/lib/api-client";
import { HierarchyPicker } from "@/components/admin/hierarchy-picker";
import { useAuth } from "@/lib/auth-context";
import type { ContentStatus } from "@boardnotes/shared";

type ChapterDefinition = {
  term: string;
  definition: string;
  termUr?: string;
  definitionUr?: string;
};

type Chapter = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  classSlug: string;
  classTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  slug: string;
  title: string;
  summary: string;
  summaryUr?: string;
  formulas: string[];
  formulasUr?: string[];
  definitions?: ChapterDefinition[];
  videoUrl?: string;
  status: ContentStatus;
  exerciseCount: number;
};

const statuses: ContentStatus[] = ["draft", "in_review", "published", "archived"];

const emptyDefinition = (): ChapterDefinition => ({
  term: "",
  definition: "",
  termUr: "",
  definitionUr: "",
});

const emptyForm = {
  boardSlug: "fbise",
  classSlug: "9",
  subjectSlug: "mathematics",
  title: "",
  summary: "",
  summaryUr: "",
  formulas: "",
  formulasUr: "",
};

function DefinitionsEditor({
  items,
  onChange,
}: {
  items: ChapterDefinition[];
  onChange: (next: ChapterDefinition[]) => void;
}) {
  function update(index: number, patch: Partial<ChapterDefinition>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">Flashcards / glossary</p>
        <button
          type="button"
          onClick={() => onChange([...items, emptyDefinition()])}
          className="rounded-full border border-border px-3 py-1 text-xs font-semibold"
        >
          + Add card
        </button>
      </div>
      {items.length === 0 && (
        <p className="text-xs text-muted">No flashcards yet. Add terms students can flip on the chapter page.</p>
      )}
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-border bg-background p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-accent">Card {index + 1}</span>
            <button type="button" onClick={() => remove(index)} className="text-xs font-semibold text-red-600">
              Remove
            </button>
          </div>
          <input
            value={item.term}
            onChange={(e) => update(index, { term: e.target.value })}
            placeholder="Term (English)"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
          <textarea
            value={item.definition}
            onChange={(e) => update(index, { definition: e.target.value })}
            placeholder="Definition (English)"
            className="min-h-16 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
          <input
            value={item.termUr ?? ""}
            onChange={(e) => update(index, { termUr: e.target.value })}
            placeholder="Term (Urdu, optional)"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            dir="rtl"
          />
          <textarea
            value={item.definitionUr ?? ""}
            onChange={(e) => update(index, { definitionUr: e.target.value })}
            placeholder="Definition (Urdu, optional)"
            className="min-h-16 w-full rounded-lg border border-border px-3 py-2 text-sm"
            dir="rtl"
          />
        </div>
      ))}
    </div>
  );
}

export default function ManageChaptersPage() {
  const { isEditor } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [boardFilter, setBoardFilter] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    summary: "",
    summaryUr: "",
    formulas: "",
    formulasUr: "",
    videoUrl: "",
    definitions: [] as ChapterDefinition[],
  });

  async function load() {
    const data = await apiAuthFetch<Chapter[]>("/api/chapters");
    setChapters(data);
    setLoading(false);
  }

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  async function createChapter(e: React.FormEvent) {
    e.preventDefault();
    if (!form.boardSlug || !form.classSlug || !form.subjectSlug) return;
    await apiPost(
      "/api/chapters",
      {
        boardSlug: form.boardSlug,
        classSlug: form.classSlug,
        subjectSlug: form.subjectSlug,
        title: form.title,
        summary: form.summary,
        summaryUr: form.summaryUr || undefined,
        formulas: form.formulas.split("\n").filter(Boolean),
        formulasUr: form.formulasUr.split("\n").filter(Boolean),
        status: "draft",
      },
      true,
    );
    setForm(emptyForm);
    await load();
  }

  function startEdit(chapter: Chapter) {
    setEditingId(chapter.id);
    setEditForm({
      summary: chapter.summary,
      summaryUr: chapter.summaryUr ?? "",
      formulas: chapter.formulas.join("\n"),
      formulasUr: (chapter.formulasUr ?? []).join("\n"),
      videoUrl: chapter.videoUrl ?? "",
      definitions: (chapter.definitions ?? []).map((d) => ({ ...d })),
    });
  }

  async function saveEdit(id: number) {
    const definitions = editForm.definitions
      .filter((d) => d.term.trim() && d.definition.trim())
      .map((d) => ({
        term: d.term.trim(),
        definition: d.definition.trim(),
        termUr: d.termUr?.trim() || undefined,
        definitionUr: d.definitionUr?.trim() || undefined,
      }));

    await apiPut(`/api/chapters/${id}`, {
      summary: editForm.summary,
      summaryUr: editForm.summaryUr,
      formulas: editForm.formulas.split("\n").filter(Boolean),
      formulasUr: editForm.formulasUr.split("\n").filter(Boolean),
      videoUrl: editForm.videoUrl.trim(),
      definitions,
    });
    setEditingId(null);
    await load();
  }

  async function updateStatus(id: number, status: ContentStatus) {
    await apiPut(`/api/chapters/${id}`, { status });
    await load();
  }

  async function submitReview(id: number) {
    await apiPatch(`/api/chapters/${id}/review`);
    await load();
  }

  async function publish(id: number) {
    await apiPatch(`/api/chapters/${id}/publish`);
    await load();
  }

  async function unpublish(id: number) {
    await apiPatch(`/api/chapters/${id}/unpublish`);
    await load();
  }

  function statusBadgeClass(status: ContentStatus) {
    switch (status) {
      case "published":
        return "bg-accent/15 text-accent";
      case "in_review":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
      case "archived":
        return "bg-background text-muted";
      default:
        return "bg-background text-muted";
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this chapter?")) return;
    await apiDelete(`/api/chapters/${id}`);
    await load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Manage Chapters</h1>
      <p className="mt-2 text-muted">
        {isEditor
          ? "Create, review, and publish chapters. Teachers submit drafts for your approval."
          : "Write chapter content and submit for editor review. You cannot publish directly."}
      </p>

      <form onSubmit={createChapter} className="mt-8 space-y-3 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-bold text-foreground">Add chapter</h2>
        <HierarchyPicker
          value={{ boardSlug: form.boardSlug, classSlug: form.classSlug, subjectSlug: form.subjectSlug }}
          onChange={(next) => setForm({ ...form, ...next })}
        />
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Chapter title" className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
        <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Summary (English)" className="min-h-20 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
        <textarea value={form.summaryUr} onChange={(e) => setForm({ ...form, summaryUr: e.target.value })} placeholder="Summary (Urdu, optional)" className="min-h-20 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" dir="rtl" />
        <textarea value={form.formulas} onChange={(e) => setForm({ ...form, formulas: e.target.value })} placeholder="Formulas — English (one per line)" className="min-h-16 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" />
        <textarea value={form.formulasUr} onChange={(e) => setForm({ ...form, formulasUr: e.target.value })} placeholder="Formulas — Urdu (one per line, optional)" className="min-h-16 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" dir="rtl" />
        <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">Create chapter</button>
      </form>

      <div className="mt-8 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">{chapters.length} chapter(s)</p>
          <select
            value={boardFilter}
            onChange={(e) => setBoardFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground"
          >
            <option value="all">All boards</option>
            {[...new Map(chapters.map((c) => [c.boardSlug, c.boardTitle])).entries()].map(([slug, title]) => (
              <option key={slug} value={slug}>
                {title}
              </option>
            ))}
          </select>
        </div>
        {loading && <p className="text-sm text-muted">Loading…</p>}
        {chapters
          .filter((chapter) => boardFilter === "all" || chapter.boardSlug === boardFilter)
          .map((chapter) => (
          <div key={chapter.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${statusBadgeClass(chapter.status)}`}>
                  {chapter.status.replace("_", " ")}
                </span>
                <h2 className="mt-2 text-lg font-bold text-foreground">{chapter.title}</h2>
                <p className="text-sm text-muted">{chapter.boardTitle} → {chapter.classTitle} → {chapter.subjectTitle}</p>
                {!editingId && (chapter.definitions?.length ?? 0) > 0 && (
                  <p className="mt-1 text-xs font-semibold text-accent">{chapter.definitions!.length} flashcard(s)</p>
                )}
                {!editingId && chapter.videoUrl && (
                  <p className="mt-1 text-xs font-semibold text-accent">Video lesson linked</p>
                )}
                {editingId === chapter.id ? (
                  <div className="mt-4 space-y-2">
                    <textarea value={editForm.summary} onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })} placeholder="Summary (English)" className="min-h-20 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" />
                    <textarea value={editForm.summaryUr} onChange={(e) => setEditForm({ ...editForm, summaryUr: e.target.value })} placeholder="Summary (Urdu)" className="min-h-20 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" dir="rtl" />
                    <textarea value={editForm.formulas} onChange={(e) => setEditForm({ ...editForm, formulas: e.target.value })} placeholder="Formulas (English, one per line)" className="min-h-16 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" />
                    <textarea value={editForm.formulasUr} onChange={(e) => setEditForm({ ...editForm, formulasUr: e.target.value })} placeholder="Formulas (Urdu, one per line)" className="min-h-16 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" dir="rtl" />
                    <input
                      value={editForm.videoUrl}
                      onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                      placeholder="YouTube URL (optional)"
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
                    />
                    <DefinitionsEditor
                      items={editForm.definitions}
                      onChange={(definitions) => setEditForm({ ...editForm, definitions })}
                    />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => saveEdit(chapter.id)} className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white">Save content</button>
                      <button type="button" onClick={() => setEditingId(null)} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 line-clamp-2 text-sm text-foreground">{chapter.summary}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {editingId !== chapter.id && (
                  <button type="button" onClick={() => startEdit(chapter)} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">Edit content</button>
                )}
                {isEditor && (
                  <select
                    value={chapter.status}
                    onChange={(e) => updateStatus(chapter.id, e.target.value as ContentStatus)}
                    className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-foreground"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}
                {(chapter.status === "draft" || chapter.status === "archived") && (
                  <button type="button" onClick={() => submitReview(chapter.id)} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">
                    Submit for review
                  </button>
                )}
                {isEditor && chapter.status !== "published" && (
                  <button type="button" onClick={() => publish(chapter.id)} className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white">
                    Publish
                  </button>
                )}
                {isEditor && chapter.status === "published" && (
                  <button type="button" onClick={() => unpublish(chapter.id)} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">
                    Unpublish
                  </button>
                )}
                {isEditor && (
                  <button type="button" onClick={() => remove(chapter.id)} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600">
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
