import type { SearchResult } from "@boardnotes/shared";

import { SearchPageContent } from "@/components/content/search-page-content";
import { apiFetch } from "@/lib/api-client";

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
      `/api/search?q=${encodeURIComponent(query)}`,
    );
    return data.results;
  } catch {
    return [];
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = String(params.q ?? "").trim();
  const boardFilter = String(params.board ?? "all");
  const classFilter = String(params.class ?? "all");
  const subjectFilter = String(params.subject ?? "all");
  const results = await getResults(query);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <SearchPageContent
          query={query}
          boardFilter={boardFilter}
          classFilter={classFilter}
          subjectFilter={subjectFilter}
          results={results}
        />
      </div>
    </section>
  );
}
