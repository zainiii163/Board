"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch, apiDelete, apiPost, apiPut } from "@/lib/api-client";

type ClassRecord = { id: number; boardSlug: string; slug: string; title: string };
type SubjectRecord = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  classSlug: string;
  classTitle: string;
  slug: string;
  title: string;
  chapterCount: number;
};

export default function ManageSubjectsPage() {
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [classId, setClassId] = useState<number | "">("");
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [form, setForm] = useState({ boardSlug: "fbise", classSlug: "9", title: "", slug: "" });
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  useEffect(() => {
    apiAuthFetch<ClassRecord[]>("/api/classes").then(setClasses).catch(() => setClasses([]));
  }, []);

  useEffect(() => {
    if (!classId) return;
    apiAuthFetch<SubjectRecord[]>(`/api/subjects?classId=${classId}`).then(setSubjects).catch(() => setSubjects([]));
  }, [classId]);

  const selectedClass = classes.find((c) => c.id === classId);

  async function reloadSubjects() {
    if (!classId) return;
    const data = await apiAuthFetch<SubjectRecord[]>(`/api/subjects?classId=${classId}`);
    setSubjects(data);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClass && !editingSlug) return;

    if (editingSlug) {
      await apiPut(`/api/subjects/${editingSlug}`, { title: form.title });
    } else if (selectedClass) {
      await apiPost(
        "/api/subjects",
        { boardSlug: selectedClass.boardSlug, classSlug: selectedClass.slug, title: form.title, slug: form.slug || undefined },
        true,
      );
    }

    setForm({ boardSlug: "fbise", classSlug: "9", title: "", slug: "" });
    setEditingSlug(null);
    await reloadSubjects();
  }

  function startEdit(record: SubjectRecord) {
    setEditingSlug(record.slug);
    setForm({ boardSlug: record.boardSlug, classSlug: record.classSlug, title: record.title, slug: record.slug });
  }

  async function remove(slug: string) {
    if (!confirm("Delete this subject? Remove all chapters first.")) return;
    await apiDelete(`/api/subjects/${slug}`);
    await reloadSubjects();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Manage Subjects</h1>
      <p className="mt-2 text-muted">Mathematics, Physics, Chemistry, and more per class.</p>

      <div className="mt-6 max-w-md">
        <select
          value={classId}
          onChange={(e) => {
            setClassId(Number(e.target.value) || "");
            setSubjects([]);
            setEditingSlug(null);
            setForm({ boardSlug: "fbise", classSlug: "9", title: "", slug: "" });
          }}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
        >
          <option value="">Select class…</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.boardSlug} / {c.slug} — {c.title}
            </option>
          ))}
        </select>
      </div>

      {(selectedClass || editingSlug) && (
        <>
          <form onSubmit={save} className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-5">
            <div className="grid gap-3 md:grid-cols-2">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Subject title" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground md:col-span-2" required />
              {!editingSlug && (
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug (optional)" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground md:col-span-2" />
              )}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
                {editingSlug ? "Save title" : "Add subject"}
              </button>
              {editingSlug && (
                <button type="button" onClick={() => setEditingSlug(null)} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 space-y-2">
            {subjects.map((record) => (
              <div key={record.id} className="rounded-xl border border-border bg-card px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{record.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      /{record.boardSlug}/{record.classSlug}/{record.slug} • {record.chapterCount} chapters
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
        </>
      )}
    </div>
  );
}
