import { apiFetch } from "@/lib/api-client";
import { FbisePastPapersExplorer } from "@/components/content/fbise-past-papers-explorer";
import { PastPapersList, type PastPaperItem } from "@/components/content/past-papers-list";

// Papers change whenever staff add one in the admin, so never serve this from cache.
export const dynamic = "force-dynamic";

async function getPastPapers() {
  try {
    return await apiFetch<PastPaperItem[]>("/api/past-papers");
  } catch {
    return [];
  }
}

export default async function PastPapersPage({
  searchParams,
}: {
  searchParams: Promise<{ board?: string; year?: string; type?: string }>;
}) {
  const { board, year, type } = await searchParams;
  const papers = await getPastPapers();
  const useFbiseExplorer = !board || board === "fbise";

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-border dark:bg-card">
        {useFbiseExplorer ? <FbisePastPapersExplorer papers={papers} /> : <PastPapersList papers={papers} initialBoard={board} initialYear={year} initialType={type} />}
      </div>
    </section>
  );
}
