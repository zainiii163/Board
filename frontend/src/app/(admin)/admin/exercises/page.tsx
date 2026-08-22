"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch, apiDelete, apiPost } from "@/lib/api-client";

type Chapter = { id: number; title: string; boardSlug: string; classSlug: string; subjectSlug: string; slug: string };
type Exercise = { id: number; chapterId: number; slug: string; title: string; questionCount: number };

export default function ManageExercisesPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterId, setChapterId] = useState<number | "">("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    apiAuthFetch<Chapter[]>("/api/chapters").then(setChapters).catch(() => setChapters([]));
  }, []);

  useEffect(() => {
    if (!chapterId) return;
    apiAuthFetch<Exercise[]>(`/api/exercises?chapterId=${chapterId}`).then(setExercises).catch(() => setExercises([]));
  }, [chapterId]);

  async function createExercise(e: React.FormEvent) {
    e.preventDefault();
    if (!chapterId) return;
    await apiPost("/api/exercises", { chapterId, title }, true);
    setTitle("");
    const data = await apiAuthFetch<Exercise[]>(`/api/exercises?chapterId=${chapterId}`);
    setExercises(data);
  }

  async function remove(id: number) {
    await apiDelete(`/api/exercises/${id}`);
    if (chapterId) {
      const data = await apiAuthFetch<Exercise[]>(`/api/exercises?chapterId=${chapterId}`);
      setExercises(data);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Manage Exercises</h1>
      <p className="mt-2 text-muted">Add exercises under a chapter.</p>

      <div className="mt-6">
        <label className="text-sm font-medium text-foreground">Select chapter</label>
        <select value={chapterId} onChange={(e) => setChapterId(Number(e.target.value) || "")} className="mt-2 w-full max-w-md rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground">
          <option value="">Choose chapter…</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>{c.title} ({c.boardSlug}/{c.classSlug}/{c.subjectSlug})</option>
          ))}
        </select>
      </div>

      {chapterId && (
        <>
          <form onSubmit={createExercise} className="mt-6 flex gap-2">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Exercise title e.g. Exercise 1.2" className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
            <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">Add</button>
          </form>

          <div className="mt-6 space-y-2">
            {exercises.map((ex) => (
              <div key={ex.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                <div>
                  <p className="font-semibold text-foreground">{ex.title}</p>
                  <p className="text-xs text-muted">{ex.questionCount} questions • /{ex.slug}</p>
                </div>
                <button type="button" onClick={() => remove(ex.id)} className="text-xs font-semibold text-red-600">Delete</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
