"use client";

import { useEffect, useState } from "react";

import { apiDelete, apiFetch, apiPost, apiPut } from "@/lib/api-client";

type Exam = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  classSlug: string;
  classTitle: string;
  title: string;
  examDate: string;
};

const emptyForm = {
  boardSlug: "fbise",
  boardTitle: "Federal Board (FBISE)",
  classSlug: "9",
  classTitle: "Class 9",
  title: "",
  examDate: "",
};

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatExamDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function isPast(iso: string) {
  return new Date(iso).getTime() < Date.now();
}

export default function ManageExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await apiFetch<Exam[]>("/api/exams/all");
    setExams(data);
    setLoading(false);
  }

  useEffect(() => {
    apiFetch<Exam[]>("/api/exams/all")
      .then((data) => {
        setExams(data);
        setLoading(false);
      })
      .catch(() => {
        setExams([]);
        setLoading(false);
      });
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      boardSlug: form.boardSlug.trim(),
      boardTitle: form.boardTitle.trim(),
      classSlug: form.classSlug.trim(),
      classTitle: form.classTitle.trim(),
      title: form.title.trim(),
      examDate: new Date(form.examDate).toISOString(),
    };
    if (editingId) await apiPut(`/api/exams/${editingId}`, payload);
    else await apiPost("/api/exams", payload, true);
    resetForm();
    await load();
  }

  function startEdit(exam: Exam) {
    setEditingId(exam.id);
    setForm({
      boardSlug: exam.boardSlug,
      boardTitle: exam.boardTitle,
      classSlug: exam.classSlug,
      classTitle: exam.classTitle,
      title: exam.title,
      examDate: toDatetimeLocal(exam.examDate),
    });
  }

  async function remove(id: number) {
    if (!confirm("Delete this exam date?")) return;
    await apiDelete(`/api/exams/${id}`);
    if (editingId === id) resetForm();
    await load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Exam Dates</h1>
      <p className="mt-2 text-muted">
        Manage countdown dates shown on the home page. Only upcoming exams appear publicly.
      </p>

      <form onSubmit={save} className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
          {editingId ? "Edit exam date" : "Add exam date"}
        </h2>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title (e.g. FBISE Class 9 Annual Exams 2026)"
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          required
        />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={form.boardSlug}
            onChange={(e) => setForm({ ...form, boardSlug: e.target.value })}
            placeholder="Board slug (fbise)"
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
            required
          />
          <input
            value={form.boardTitle}
            onChange={(e) => setForm({ ...form, boardTitle: e.target.value })}
            placeholder="Board title"
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
            required
          />
          <input
            value={form.classSlug}
            onChange={(e) => setForm({ ...form, classSlug: e.target.value })}
            placeholder="Class slug (9)"
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
            required
          />
          <input
            value={form.classTitle}
            onChange={(e) => setForm({ ...form, classTitle: e.target.value })}
            placeholder="Class title"
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
            required
          />
        </div>
        <input
          type="datetime-local"
          value={form.examDate}
          onChange={(e) => setForm({ ...form, examDate: e.target.value })}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          required
        />
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
            {editingId ? "Save" : "Add exam date"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {loading && <p className="text-sm text-muted">Loading…</p>}
        {exams.map((exam) => (
          <div
            key={exam.id}
            className={`flex flex-wrap items-start justify-between gap-3 rounded-2xl border bg-card p-5 ${
              isPast(exam.examDate) ? "border-border opacity-70" : "border-accent/30"
            }`}
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                    isPast(exam.examDate) ? "bg-background text-muted" : "bg-accent/15 text-accent"
                  }`}
                >
                  {isPast(exam.examDate) ? "Past" : "Upcoming"}
                </span>
                <span className="text-xs text-muted">{formatExamDate(exam.examDate)}</span>
              </div>
              <h2 className="mt-2 text-lg font-bold text-foreground">{exam.title}</h2>
              <p className="text-sm text-muted">
                {exam.boardTitle} · {exam.classTitle}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(exam)}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(exam.id)}
                className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && exams.length === 0 && (
          <p className="text-sm text-muted">No exam dates yet. Add one to show the home countdown widget.</p>
        )}
      </div>
    </div>
  );
}
