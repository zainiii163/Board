"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch, apiDelete, apiPost, apiPut } from "@/lib/api-client";

type PastPaper = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  classSlug: string;
  classTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  year: string;
  sessionType: "annual" | "supply";
  pdfUrl: string | null;
};

const emptyForm = {
  boardSlug: "fbise",
  boardTitle: "Federal Board (FBISE)",
  classSlug: "9",
  classTitle: "Class 9",
  subjectSlug: "mathematics",
  subjectTitle: "Mathematics",
  year: new Date().getFullYear().toString(),
  sessionType: "annual" as "annual" | "supply",
  pdfUrl: "",
};

export default function ManagePastPapersPage() {
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    const data = await apiAuthFetch<PastPaper[]>("/api/past-papers");
    setPapers(data);
  }

  useEffect(() => {
    apiAuthFetch<PastPaper[]>("/api/past-papers")
      .then(setPapers)
      .catch(() => setPapers([]));
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, pdfUrl: form.pdfUrl || null };
    if (editingId) await apiPut(`/api/past-papers/${editingId}`, payload);
    else await apiPost("/api/past-papers", payload, true);
    resetForm();
    await load();
  }

  function startEdit(paper: PastPaper) {
    setEditingId(paper.id);
    setForm({
      boardSlug: paper.boardSlug,
      boardTitle: paper.boardTitle,
      classSlug: paper.classSlug,
      classTitle: paper.classTitle,
      subjectSlug: paper.subjectSlug,
      subjectTitle: paper.subjectTitle,
      year: paper.year,
      sessionType: paper.sessionType,
      pdfUrl: paper.pdfUrl ?? "",
    });
  }

  async function remove(id: number) {
    if (!confirm("Delete this past paper?")) return;
    await apiDelete(`/api/past-papers/${id}`);
    if (editingId === id) resetForm();
    await load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Manage Past Papers</h1>
      <p className="mt-2 text-muted">Board exam papers by year, subject, and session type.</p>

      <form onSubmit={save} className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
          {editingId ? "Edit past paper" : "Add past paper"}
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input value={form.subjectTitle} onChange={(e) => setForm({ ...form, subjectTitle: e.target.value })} placeholder="Subject title" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
          <input value={form.subjectSlug} onChange={(e) => setForm({ ...form, subjectSlug: e.target.value })} placeholder="Subject slug" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
          <input value={form.boardSlug} onChange={(e) => setForm({ ...form, boardSlug: e.target.value })} placeholder="Board slug" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
          <input value={form.boardTitle} onChange={(e) => setForm({ ...form, boardTitle: e.target.value })} placeholder="Board title" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
          <input value={form.classSlug} onChange={(e) => setForm({ ...form, classSlug: e.target.value })} placeholder="Class slug" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
          <input value={form.classTitle} onChange={(e) => setForm({ ...form, classTitle: e.target.value })} placeholder="Class title" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
          <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="Year" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
          <select value={form.sessionType} onChange={(e) => setForm({ ...form, sessionType: e.target.value as "annual" | "supply" })} className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground">
            <option value="annual">Annual</option>
            <option value="supply">Supply</option>
          </select>
          <input value={form.pdfUrl} onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })} placeholder="PDF URL (from Uploads)" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground md:col-span-2" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
            {editingId ? "Save" : "Add paper"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 space-y-2">
        {papers.map((paper) => (
          <div key={paper.id} className="rounded-xl border border-border bg-card px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">
                  {paper.subjectTitle} — {paper.year} ({paper.sessionType})
                </p>
                <p className="mt-1 text-sm text-muted">
                  {paper.boardTitle} • {paper.classTitle}
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(paper)} className="text-xs font-semibold text-accent">Edit</button>
                <button type="button" onClick={() => remove(paper.id)} className="text-xs font-semibold text-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
