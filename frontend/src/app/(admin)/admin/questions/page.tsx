"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch, apiDelete, apiPost, apiPut } from "@/lib/api-client";

type Chapter = { id: number; title: string };
type Exercise = { id: number; chapterId: number; title: string };
type Question = {
  id: number;
  exerciseId: number;
  num: number;
  questionText: string;
  questionTextUr?: string;
  marks: number;
  difficulty: string;
  pdfName: string | null;
  steps: { title: string; content: string }[];
  stepsUr?: { title: string; content: string }[];
};

const emptyForm = {
  num: 1,
  questionText: "",
  questionTextUr: "",
  marks: 2,
  difficulty: "Easy",
  pdfName: "",
  stepsJson: '[{"title":"Given","content":""},{"title":"Answer","content":""}]',
  stepsUrJson: "",
};

export default function ManageQuestionsPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterId, setChapterId] = useState<number | "">("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseId, setExerciseId] = useState<number | "">("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    questionText: "",
    questionTextUr: "",
    stepsJson: "",
    stepsUrJson: "",
  });

  useEffect(() => {
    apiAuthFetch<Chapter[]>("/api/chapters").then(setChapters).catch(() => setChapters([]));
  }, []);

  useEffect(() => {
    if (!chapterId) return;
    apiAuthFetch<Exercise[]>(`/api/exercises?chapterId=${chapterId}`).then(setExercises).catch(() => setExercises([]));
  }, [chapterId]);

  useEffect(() => {
    if (!exerciseId) return;
    apiAuthFetch<Question[]>(`/api/questions?exerciseId=${exerciseId}`).then(setQuestions).catch(() => setQuestions([]));
  }, [exerciseId]);

  async function reloadQuestions() {
    if (!exerciseId) return;
    const data = await apiAuthFetch<Question[]>(`/api/questions?exerciseId=${exerciseId}`);
    setQuestions(data);
  }

  async function createQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!exerciseId) return;
    const steps = JSON.parse(form.stepsJson) as { title: string; content: string }[];
    const stepsUr = form.stepsUrJson.trim()
      ? (JSON.parse(form.stepsUrJson) as { title: string; content: string }[])
      : undefined;
    await apiPost(
      "/api/questions",
      {
        exerciseId,
        num: form.num,
        questionText: form.questionText,
        questionTextUr: form.questionTextUr || undefined,
        marks: form.marks,
        difficulty: form.difficulty,
        steps,
        stepsUr,
        pdfName: form.pdfName || null,
      },
      true,
    );
    setForm({ ...emptyForm, num: form.num + 1 });
    await reloadQuestions();
  }

  function startEdit(question: Question) {
    setEditingId(question.id);
    setEditForm({
      questionText: question.questionText,
      questionTextUr: question.questionTextUr ?? "",
      stepsJson: JSON.stringify(question.steps, null, 2),
      stepsUrJson: question.stepsUr ? JSON.stringify(question.stepsUr, null, 2) : "",
    });
  }

  async function saveEdit(id: number) {
    const steps = JSON.parse(editForm.stepsJson) as { title: string; content: string }[];
    const stepsUr = editForm.stepsUrJson.trim()
      ? (JSON.parse(editForm.stepsUrJson) as { title: string; content: string }[])
      : [];
    await apiPut(`/api/questions/${id}`, {
      questionText: editForm.questionText,
      questionTextUr: editForm.questionTextUr,
      steps,
      stepsUr,
    });
    setEditingId(null);
    await reloadQuestions();
  }

  async function remove(id: number) {
    await apiDelete(`/api/questions/${id}`);
    await reloadQuestions();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Manage Questions</h1>
      <p className="mt-2 text-muted">Add questions with step-by-step solutions in English and Urdu (KaTeX supported).</p>

      <div className="mt-6 grid max-w-2xl gap-3 md:grid-cols-2">
        <select value={chapterId} onChange={(e) => { setChapterId(Number(e.target.value) || ""); setExerciseId(""); }} className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground">
          <option value="">Chapter…</option>
          {chapters.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <select value={exerciseId} onChange={(e) => setExerciseId(Number(e.target.value) || "")} className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" disabled={!chapterId}>
          <option value="">Exercise…</option>
          {exercises.map((ex) => <option key={ex.id} value={ex.id}>{ex.title}</option>)}
        </select>
      </div>

      {exerciseId && (
        <>
          <form onSubmit={createQuestion} className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-5">
            <div className="grid gap-3 md:grid-cols-3">
              <input type="number" value={form.num} onChange={(e) => setForm({ ...form, num: Number(e.target.value) })} placeholder="Q#" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
              <input type="number" value={form.marks} onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })} placeholder="Marks" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" />
              <input value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} placeholder="Difficulty" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" />
            </div>
            <textarea value={form.questionText} onChange={(e) => setForm({ ...form, questionText: e.target.value })} placeholder="Question text — English ($...$ for math)" className="min-h-20 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
            <textarea value={form.questionTextUr} onChange={(e) => setForm({ ...form, questionTextUr: e.target.value })} placeholder="Question text — Urdu (optional)" className="min-h-20 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" dir="rtl" />
            <input value={form.pdfName} onChange={(e) => setForm({ ...form, pdfName: e.target.value })} placeholder="PDF filename (optional)" className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" />
            <textarea value={form.stepsJson} onChange={(e) => setForm({ ...form, stepsJson: e.target.value })} placeholder="Steps JSON (English)" className="min-h-24 w-full rounded-xl border border-border px-3 py-2 font-mono text-xs" required />
            <textarea value={form.stepsUrJson} onChange={(e) => setForm({ ...form, stepsUrJson: e.target.value })} placeholder="Steps JSON (Urdu, optional)" className="min-h-24 w-full rounded-xl border border-border px-3 py-2 font-mono text-xs" dir="rtl" />
            <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">Add question</button>
          </form>

          <div className="mt-6 space-y-2">
            {questions.map((q) => (
              <div key={q.id} className="rounded-xl border border-border bg-card px-4 py-3">
                {editingId === q.id ? (
                  <div className="space-y-2">
                    <textarea value={editForm.questionText} onChange={(e) => setEditForm({ ...editForm, questionText: e.target.value })} className="min-h-16 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" />
                    <textarea value={editForm.questionTextUr} onChange={(e) => setEditForm({ ...editForm, questionTextUr: e.target.value })} placeholder="Urdu question" className="min-h-16 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" dir="rtl" />
                    <textarea value={editForm.stepsJson} onChange={(e) => setEditForm({ ...editForm, stepsJson: e.target.value })} className="min-h-24 w-full rounded-xl border border-border px-3 py-2 font-mono text-xs" />
                    <textarea value={editForm.stepsUrJson} onChange={(e) => setEditForm({ ...editForm, stepsUrJson: e.target.value })} placeholder="Urdu steps JSON" className="min-h-24 w-full rounded-xl border border-border px-3 py-2 font-mono text-xs" dir="rtl" />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => saveEdit(q.id)} className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white">Save</button>
                      <button type="button" onClick={() => setEditingId(null)} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">Question {q.num} • {q.marks} marks • {q.difficulty}</p>
                      <p className="mt-1 text-sm text-muted">{q.questionText}</p>
                      {q.questionTextUr && <p className="mt-1 text-sm text-muted" dir="rtl">{q.questionTextUr}</p>}
                      <p className="mt-1 text-xs text-muted">{q.steps.length} steps{q.stepsUr?.length ? ` • ${q.stepsUr.length} Urdu steps` : ""}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(q)} className="text-xs font-semibold text-accent">Edit</button>
                      <button type="button" onClick={() => remove(q.id)} className="text-xs font-semibold text-red-600">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
