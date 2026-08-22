import { apiFetch } from "@/lib/api-client";
import { BooksList, type BookItem } from "@/components/content/books-list";

async function getBooks() {
  try {
    return await apiFetch<BookItem[]>("/api/books");
  } catch {
    return [];
  }
}

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <BooksList books={books} />
      </div>
    </section>
  );
}
