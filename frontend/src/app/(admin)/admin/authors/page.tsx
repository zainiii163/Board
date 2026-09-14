"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { apiAuthFetch, apiDelete, apiPost, apiPut } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";

type AuthorRecord = {
  id: number;
  slug: string;
  name: string;
  title: string;
  bio: string;
  boards: string[];
  noteCount: number;
};

const emptyForm = { name: "", title: "", bio: "", boards: "FBISE", slug: "" };

export default function ManageAuthorsPage() {
  const { tr } = useLocale();
  const [authors, setAuthors] = useState<AuthorRecord[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  async function load() {
    const data = await apiAuthFetch<AuthorRecord[]>("/api/authors");
    setAuthors(data);
  }

  useEffect(() => {
    apiAuthFetch<AuthorRecord[]>("/api/authors")
      .then(setAuthors)
      .catch(() => setAuthors([]));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const boards = form.boards
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
    const payload = {
      name: form.name,
      title: form.title,
      bio: form.bio,
      boards,
      ...(form.slug.trim() ? { slug: form.slug.trim() } : {}),
    };
    if (editingSlug) {
      await apiPut(`/api/authors/${editingSlug}`, payload);
    } else {
      await apiPost("/api/authors", payload, true);
    }
    setForm(emptyForm);
    setEditingSlug(null);
    await load();
  }

  function startEdit(author: AuthorRecord) {
    setEditingSlug(author.slug);
    setForm({
      name: author.name,
      title: author.title,
      bio: author.bio,
      boards: author.boards.join(", "),
      slug: author.slug,
    });
  }

  async function remove(slug: string) {
    if (!confirm("Delete this author profile?")) return;
    await apiDelete(`/api/authors/${slug}`);
    await load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">{tr("manageAuthors")}</h1>
      <p className="mt-2 text-muted">Contributor profiles shown on /authors.</p>

      <form onSubmit={save} className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
          {editingSlug ? "Edit author" : "Add author"}
        </h2>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Full name"
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          required
        />
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title e.g. Mathematics Teacher"
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          required
        />
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Short bio"
          rows={3}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          required
        />
        <input
          value={form.boards}
          onChange={(e) => setForm({ ...form, boards: e.target.value })}
          placeholder="Boards (comma-separated)"
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
        />
        {!editingSlug && (
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="Slug (optional — auto from name)"
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          />
        )}
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
            {editingSlug ? "Save" : "Add"}
          </button>
          {editingSlug && (
            <button
              type="button"
              onClick={() => {
                setEditingSlug(null);
                setForm(emptyForm);
              }}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {authors.map((author) => (
          <div
            key={author.slug}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-foreground">{author.name}</p>
              <p className="text-sm text-muted">{author.title}</p>
              <p className="mt-1 text-xs text-muted">
                /authors/{author.slug} • {author.noteCount} notes
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/authors/${author.slug}`}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-accent"
              >
                View
              </Link>
              <button
                type="button"
                onClick={() => startEdit(author)}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(author.slug)}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
