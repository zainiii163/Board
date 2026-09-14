"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch, apiDelete, apiPost, apiPut } from "@/lib/api-client";
import { BoardSelect } from "@/components/admin/hierarchy-picker";

type ClassRecord = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  slug: string;
  title: string;
  subjectCount: number;
};

export default function ManageClassesPage() {
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [form, setForm] = useState({ boardSlug: "fbise", title: "", slug: "" });
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  async function load() {
    const data = await apiAuthFetch<ClassRecord[]>("/api/classes");
    setClasses(data);
  }

  useEffect(() => {
    apiAuthFetch<ClassRecord[]>("/api/classes")
      .then(setClasses)
      .catch(() => setClasses([]));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (editingSlug) {
      await apiPut(`/api/classes/${editingSlug}`, { title: form.title });
    } else {
      await apiPost("/api/classes", { boardSlug: form.boardSlug, title: form.title, slug: form.slug || undefined }, true);
    }
    setForm({ boardSlug: "fbise", title: "", slug: "" });
    setEditingSlug(null);
    await load();
  }

  function startEdit(record: ClassRecord) {
    setEditingSlug(record.slug);
    setForm({ boardSlug: record.boardSlug, title: record.title, slug: record.slug });
  }

  async function remove(slug: string) {
    if (!confirm("Delete this class? Remove all subjects first.")) return;
    await apiDelete(`/api/classes/${slug}`);
    await load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Manage Classes</h1>
      <p className="mt-2 text-muted">Class hubs (5–12) under each board.</p>

      <form onSubmit={save} className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Board</span>
            <BoardSelect
              value={form.boardSlug}
              onChange={(boardSlug) => setForm({ ...form, boardSlug })}
              disabled={!!editingSlug}
            />
          </div>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Class title (Class 10)" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground md:mt-5" required />
          {!editingSlug && (
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug (optional, e.g. 10)" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground md:mt-5" />
          )}
        </div>
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
            {editingSlug ? "Save title" : "Add class"}
          </button>
          {editingSlug && (
            <button type="button" onClick={() => { setEditingSlug(null); setForm({ boardSlug: "fbise", title: "", slug: "" }); }} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 space-y-2">
        {classes.map((record) => (
          <div key={`${record.boardSlug}-${record.slug}`} className="rounded-xl border border-border bg-card px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{record.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {record.boardTitle} • /{record.boardSlug}/{record.slug} • {record.subjectCount} subjects
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(record)} className="text-xs font-semibold text-accent">Edit</button>
                <button type="button" onClick={() => remove(record.slug)} className="text-xs font-semibold text-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
