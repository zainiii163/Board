import Link from "next/link";

import { apiFetch } from "@/lib/api-client";

type Book = {
  title: string;
  board: string;
  className: string;
  price: string;
};

async function getBooks() {
  try {
    return await apiFetch<Book[]>("/api/books");
  } catch {
    return [];
  }
}

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-black text-slate-900">Books</h1>
        <p className="mt-3 text-slate-600">Textbooks and reference PDFs by board and class.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {books.map((book) => (
            <div key={book.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">{book.board}</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">{book.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{book.className}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-700">
                  {book.price}
                </span>
                <Link href="/fbise/9/mathematics" className="text-sm font-semibold text-sky-700 hover:underline">
                  View notes
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
