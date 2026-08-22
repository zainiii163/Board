"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch, apiDelete, apiPost, apiPut } from "@/lib/api-client";

type Chapter = {
  id: number;
  boardSlug: string;
  classSlug: string;
  subjectSlug: string;
  slug: string;
  title: string;
};

type Mcq = {
  id: number;
  chapterKey: string;
  question: string;
  options: { label: string; text: string }[];
  correctLabel: string;
  reason: string;
};

const defaultOptions = [
  { label: "A", text: "" },
  { label: "B", text: "" },
  { label: "C", text: "" },
  { label: "D", text: "" },
];

const emptyForm = {
  question: "",
  options: defaultOptions.map((o) => ({ ...o })),
  correctLabel: "A",
  reason: "",
};

export default function ManageMcqsPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterId, setChapterId] = useState<number | "">("");
  const [mcqs, setMcqs] = useState<Mcq[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const selectedChapter = chapters.find((c) => c.id === chapterId);

  useEffect(() => {
    apiAuthFetch<Chapter[]>("/api/chapters").then(setChapters).catch(() => setChapters([]));
  }, []);

  useEffect(() => {
    if (!selectedChapter) {
      setMcqs([]);
      return;
    }
    const params = new URLSearchParams({
      board: selectedChapter.boardSlug,
      class: selectedChapter.classSlug,
      subject: selectedChapter.subjectSlug,
      chapter: selectedChapter.slug,
    });
    apiAuthFetch<Mcq[]>(`/api/mcqs?${params}`).then(setMcqs).catch(() => setMcqs([]));
  }, [selectedChapter]);

  function resetForm() {
    setEditingId(null);
    setForm({
      question: "",
      options: defaultOptions.map((o) => ({ ...o })),
      correctLabel: "A",
      reason: "",
    });
  }

  async function reloadMcqs() {
    if (!selectedChapter) return;
    const params = new URLSearchParams({
      board: selectedChapter.boardSlug,
      class: selectedChapter.classSlug,
      subject: selectedChapter.subjectSlug,
      chapter: selectedChapter.slug,
    });
    const data = await apiAuthFetch<Mcq[]>(`/api/mcqs?${params}`);
    setMcqs(data);
  }

  async function saveMcq(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedChapter) return;

    const payload = {
      boardSlug: selectedChapter.boardSlug,
      classSlug: selectedChapter.classSlug,
      subjectSlug: selectedChapter.subjectSlug,
      chapterSlug: selectedChapter.slug,
      question: form.question,
      options: form.options.filter((o) => o.text.trim()),
      correctLabel: form.correctLabel,
      reason: form.reason,
    };

    if (editingId) {
      await apiPut(`/api/mcqs/${editingId}`, payload);
    } else {
      await apiPost("/api/mcqs", payload, true);
    }

    resetForm();
    await reloadMcqs();
  }

  function startEdit(mcq: Mcq) {
    setEditingId(mcq.id);
    setForm({
      question: mcq.question,
      options: defaultOptions.map((o) => {
        const match = mcq.options.find((opt) => opt.label === o.label);
        return { label: o.label, text: match?.text ?? "" };
      }),
      correctLabel: mcq.correctLabel,
      reason: mcq.reason,
    });
  }

  async function remove(id: number) {
    if (!confirm("Delete this MCQ?")) return;
    await apiDelete(`/api/mcqs/${id}`);
    if (editingId === id) resetForm();
    await reloadMcqs();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Manage MCQs</h1>
      <p className="mt-2 text-muted">
        Chapter quiz questions shown on public chapter pages. KaTeX math supported with $...$.
      </p>

      <div className="mt-6 max-w-xl">
        <select
          value={chapterId}
          onChange={(e) => {
            setChapterId(Number(e.target.value) || "");
            resetForm();
          }}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
        >
          <option value="">Select chapter…</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.boardSlug} / {c.classSlug} / {c.subjectSlug} — {c.title}
            </option>
          ))}
        </select>
      </div>

      {selectedChapter && (
        <>
          <form onSubmit={saveMcq} className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
              {editingId ? "Edit MCQ" : "Add MCQ"}
            </h2>
            <textarea
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="Question (e.g. Which is a rational number?)"
              className="min-h-20 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              required
            />
            <div className="grid gap-2 sm:grid-cols-2">
              {form.options.map((option, index) => (
                <div key={option.label} className="flex gap-2">
                  <span className="mt-2 w-6 text-sm font-bold text-accent">{option.label}</span>
                  <input
                    value={option.text}
                    onChange={(e) => {
                      const options = [...form.options];
                      options[index] = { ...option, text: e.target.value };
                      setForm({ ...form, options });
                    }}
                    placeholder={`Option ${option.label}`}
                    className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
                  />
                </div>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-muted">
                Correct answer
                <select
                  value={form.correctLabel}
                  onChange={(e) => setForm({ ...form, correctLabel: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
                >
                  {["A", "B", "C", "D"].map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <textarea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Explanation shown after quiz submit"
              className="min-h-16 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
            />
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
                {editingId ? "Save changes" : "Add MCQ"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 space-y-2">
            {mcqs.length === 0 ? (
              <p className="text-sm text-muted">No MCQs for this chapter yet.</p>
            ) : (
              mcqs.map((mcq) => (
                <div key={mcq.id} className="rounded-xl border border-border bg-card px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{mcq.question}</p>
                      <p className="mt-2 text-xs text-muted">
                        {mcq.options.map((o) => `${o.label}. ${o.text}`).join(" • ")}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-accent">Answer: {mcq.correctLabel}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(mcq)}
                        className="text-xs font-semibold text-accent"
                      >
                        Edit
                      </button>
                      <button type="button" onClick={() => remove(mcq.id)} className="text-xs font-semibold text-red-600">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
