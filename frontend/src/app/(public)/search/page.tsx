import type { SearchResult } from "@/lib/shared-types";

import { SearchPageContent } from "@/components/content/search-page-content";
import { apiFetch } from "@/lib/api-client";
import { AdBanner } from "@/components/portal/ad-banner";
import { type PortalResource } from "@/components/portal/portal-types";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    board?: string;
    class?: string;
    subject?: string;
  }>;
};

export type PortalSearchResource = {
  id: number;
  slug: string;
  title: string;
  subject: string;
  author: string;
  categorySlug: string;
  categoryName: string;
  board: string | null;
  fileUrl: string | null;
  downloads: number;
  addedAt: string;
};

async function getResults(query: string) {
  try {
    const data = await apiFetch<{
      query: string;
      results: SearchResult[];
      resources?: PortalSearchResource[];
    }>(`/api/search?q=${encodeURIComponent(query)}`);
    return data;
  } catch {
    return { query, results: [] as SearchResult[], resources: [] as PortalSearchResource[] };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = String(params.q ?? "").trim();
  const boardFilter = String(params.board ?? "all");
  const classFilter = String(params.class ?? "all");
  const subjectFilter = String(params.subject ?? "all");
  const data = await getResults(query);

  const portalCategoryNames: Record<string, string> = {};
  const portalResources: PortalResource[] = (data.resources ?? []).map((r) => {
    portalCategoryNames[String(r.id)] = r.categoryName;
    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      categoryId: 0,
      board: r.board,
      classLabel: null,
      subject: r.subject,
      author: r.author,
      description: "",
      fileUrl: r.fileUrl,
      coverUrl: null,
      sizeLabel: "PDF",
      pages: 0,
      downloads: r.downloads,
      addedAt: r.addedAt,
      status: "published",
    };
  });

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <SearchPageContent
          query={query}
          boardFilter={boardFilter}
          classFilter={classFilter}
          subjectFilter={subjectFilter}
          results={data.results}
          portalResources={portalResources}
          portalCategoryNames={portalCategoryNames}
        />
      </div>

      <div className="mt-8">
        <AdBanner size="leaderboard" className="mx-auto" />
      </div>
    </section>
  );
}
