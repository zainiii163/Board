import Link from "next/link";

import { apiFetch } from "@/lib/api-client";

type SearchResult = {
  title: string;
  board: string;
  className: string;
  subject: string;
  path: string;
};

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    board?: string;
    class?: string;
    subject?: string;
  }>;
};

async function getResults(query: string) {
  try {
    const data = await apiFetch<{ query: string; results: SearchResult[] }>(
      `/api/search?q=${encodeURIComponent(query || "real")}`,
    );
    return data.results;
  } catch {
    return [];
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = String(params.q ?? "real").trim();
  const boardFilter = String(params.board ?? "all");
  const classFilter = String(params.class ?? "all");
  const subjectFilter = String(params.subject ?? "all");

  const results = await getResults(query);
  const filteredResults = results.filter((result) => {
    const matchesBoard =
      boardFilter === "all" || result.board.toLowerCase() === boardFilter.toLowerCase();
    const matchesClass =
      classFilter === "all" || result.className.toLowerCase().includes(classFilter.toLowerCase());
    const matchesSubject =
      subjectFilter === "all" || result.subject.toLowerCase() === subjectFilter.toLowerCase();

    return matchesBoard && matchesClass && matchesSubject;
  });

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-black text-slate-900">Search</h1>

        <form action="/search" method="get" className="mt-5 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              name="q"
              aria-label="Search resources"
              placeholder="Search chapters, exercises, topics"
              defaultValue={query}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-300"
            />
            <button
              type="submit"
              className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Search
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <select
              name="board"
              defaultValue={boardFilter}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-sky-300"
            >
              <option value="all">Board: All</option>
              <option value="fbise">FBISE</option>
              <option value="punjab">Punjab</option>
              <option value="kpk">KPK</option>
              <option value="sindh">Sindh</option>
            </select>

            <select
              name="class"
              defaultValue={classFilter}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-sky-300"
            >
              <option value="all">Class: All</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>

            <select
              name="subject"
              defaultValue={subjectFilter}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-sky-300"
            >
              <option value="all">Subject: All</option>
              <option value="mathematics">Mathematics</option>
              <option value="chemistry">Chemistry</option>
            </select>
          </div>
        </form>

        <div className="mt-8">
          <p className="mb-4 text-sm text-slate-500">
            Showing {filteredResults.length} result{filteredResults.length === 1 ? "" : "s"} for “{query || "all"}”
          </p>

          {filteredResults.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
              No results found. Try a different keyword or filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredResults.map((result) => (
                <Link
                  key={result.path}
                  href={result.path}
                  className="block rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-sky-50"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-bold text-slate-900">{result.title}</h2>
                    <span className="text-sm text-slate-500">{result.board}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {result.className} • {result.subject}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
