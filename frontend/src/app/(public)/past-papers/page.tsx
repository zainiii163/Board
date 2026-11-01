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
  searchParams: Promise<{ board?: string; year?: string; type?: string; class?: string }>;
}) {
  const { board, year, type, class: classSlug } = await searchParams;
  const papers = await getPastPapers();
  const useFbiseExplorer = !board || board === "fbise";

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:p-8 dark:border-border dark:bg-card">
        {useFbiseExplorer ? (
          <FbisePastPapersExplorer papers={papers} initialClass={classSlug} />
        ) : (
          <PastPapersList papers={papers} initialBoard={board} initialYear={year} initialType={type} />
        )}
      </div>
    </section>
  );
}
