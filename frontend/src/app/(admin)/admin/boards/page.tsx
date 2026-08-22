"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { apiAuthFetch, apiDelete, apiPost, apiPut } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";

type BoardRecord = {
  id: number;
  slug: string;
  title: string;
  classCount: number;
};

export default function ManageBoardsPage() {
  const { tr } = useLocale();
  const [boards, setBoards] = useState<BoardRecord[]>([]);
  const [form, setForm] = useState({ slug: "", title: "" });
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  async function load() {
    const data = await apiAuthFetch<BoardRecord[]>("/api/boards?full=1");
    setBoards(data);
  }

  useEffect(() => {
    load().catch(() => setBoards([]));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (editingSlug) {
      await apiPut(`/api/boards/${editingSlug}`, { title: form.title });
    } else {
      await apiPost("/api/boards", form, true);
    }
    setForm({ slug: "", title: "" });
    setEditingSlug(null);
    await load();
  }

  function startEdit(board: BoardRecord) {
    setEditingSlug(board.slug);
    setForm({ slug: board.slug, title: board.title });
  }

  async function remove(slug: string) {
    if (!confirm("Delete this board? Remove all classes first.")) return;
    await apiDelete(`/api/boards/${slug}`);
    await load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">{tr("boardsSection")}</h1>
      <p className="mt-2 text-muted">Board hubs shown on the public website.</p>

      <form onSubmit={save} className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
          {editingSlug ? tr("editBoard") : tr("addBoard")}
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {!editingSlug && (
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder={tr("boardSlug")}
              className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              required
            />
          )}
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={tr("boardTitle")}
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground md:col-span-2"
            required
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
            {editingSlug ? "Save" : tr("addBoard")}
          </button>
          {editingSlug && (
            <button
              type="button"
              onClick={() => {
                setEditingSlug(null);
                setForm({ slug: "", title: "" });
              }}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {boards.map((board) => (
          <div key={board.slug} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">{board.slug}</p>
            <h2 className="mt-2 text-xl font-bold text-foreground">{board.title}</h2>
            <p className="mt-1 text-sm text-muted">{board.classCount} {tr("classesCount")}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={`/${board.slug}`} className="text-sm font-semibold text-accent hover:underline">
                {tr("viewPublicPage")}
              </Link>
              <button type="button" onClick={() => startEdit(board)} className="text-sm font-semibold text-accent">
                Edit
              </button>
              <button type="button" onClick={() => remove(board.slug)} className="text-sm font-semibold text-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
