"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch, apiDelete, apiPost, apiPut } from "@/lib/api-client";

type Book = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  classSlug: string;
  classTitle: string;
  subjectSlug: string | null;
  subjectTitle: string | null;
  title: string;
  priceLabel: string;
  pdfUrl: string | null;
  notesPath: string | null;
};

const emptyForm = {
  boardSlug: "fbise",
  boardTitle: "Federal Board (FBISE)",
  classSlug: "9",
  classTitle: "Class 9",
  subjectSlug: "mathematics",
  subjectTitle: "Mathematics",
  title: "",
  priceLabel: "Free PDF",
  pdfUrl: "",
  notesPath: "",
};

export default function ManageBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    const data = await apiAuthFetch<Book[]>("/api/books");
    setBooks(data);
  }

  useEffect(() => {
    load().catch(() => setBooks([]));
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      subjectSlug: form.subjectSlug || null,
      subjectTitle: form.subjectTitle || null,
      pdfUrl: form.pdfUrl || null,
      notesPath: form.notesPath || null,
    };
    if (editingId) await apiPut(`/api/books/${editingId}`, payload);
    else await apiPost("/api/books", payload, true);
    resetForm();
    await load();
  }

  function startEdit(book: Book) {
    setEditingId(book.id);
    setForm({
      boardSlug: book.boardSlug,
      boardTitle: book.boardTitle,
      classSlug: book.classSlug,
      classTitle: book.classTitle,
      subjectSlug: book.subjectSlug ?? "",
      subjectTitle: book.subjectTitle ?? "",
      title: book.title,
      priceLabel: book.priceLabel,
      pdfUrl: book.pdfUrl ?? "",
      notesPath: book.notesPath ?? "",
    });
  }

  async function remove(id: number) {
    if (!confirm("Delete this book entry?")) return;
    await apiDelete(`/api/books/${id}`);
    if (editingId === id) resetForm();
    await load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Manage Books</h1>
      <p className="mt-2 text-muted">Textbooks and reference PDFs linked to board/class/subject.</p>

      <form onSubmit={save} className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
          {editingId ? "Edit book" : "Add book"}
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground md:col-span-2" required />
          <input value={form.boardSlug} onChange={(e) => setForm({ ...form, boardSlug: e.target.value })} placeholder="Board slug (fbise)" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
          <input value={form.boardTitle} onChange={(e) => setForm({ ...form, boardTitle: e.target.value })} placeholder="Board title" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
          <input value={form.classSlug} onChange={(e) => setForm({ ...form, classSlug: e.target.value })} placeholder="Class slug (9)" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
          <input value={form.classTitle} onChange={(e) => setForm({ ...form, classTitle: e.target.value })} placeholder="Class title" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" required />
          <input value={form.priceLabel} onChange={(e) => setForm({ ...form, priceLabel: e.target.value })} placeholder="Price label" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" />
          <input value={form.notesPath} onChange={(e) => setForm({ ...form, notesPath: e.target.value })} placeholder="Notes path (/fbise/9/mathematics)" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground md:col-span-2" />
          <input value={form.pdfUrl} onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })} placeholder="PDF URL (from Uploads)" className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground md:col-span-2" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
            {editingId ? "Save" : "Add book"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 space-y-2">
        {books.map((book) => (
          <div key={book.id} className="rounded-xl border border-border bg-card px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{book.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {book.boardTitle} • {book.classTitle} • {book.priceLabel}
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(book)} className="text-xs font-semibold text-accent">Edit</button>
                <button type="button" onClick={() => remove(book.id)} className="text-xs font-semibold text-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
