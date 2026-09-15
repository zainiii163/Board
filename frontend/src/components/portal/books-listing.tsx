"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";
import { ResourceCard } from "@/components/portal/resource-card";
import { type PortalCategory, type PortalResource } from "@/components/portal/portal-types";

const PAGE_SIZE = 24;

type Props = {
  initialResources: PortalResource[];
  initialTotal: number;
  categories: PortalCategory[];
};

export function BooksListing({ initialResources, initialTotal, categories }: Props) {
  const { tr } = useLocale();
  const [filter, setFilter] = useState({ category: "", subcategory: "", sort: "latest", page: 1 });
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState(initialResources);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          limit: String(PAGE_SIZE),
          offset: String((filter.page - 1) * PAGE_SIZE),
          sort: filter.sort,
        });
        const useCat = filter.subcategory || filter.category;
        if (useCat) params.set("category", useCat);
        if (searchQuery) params.set("q", searchQuery);
        const data = await apiFetch<{ resources: PortalResource[]; total: number }>(`/api/resources?${params}`);
        if (!cancelled) { setResources(data.resources); setTotal(data.total); }
      } catch {
        if (!cancelled) { setResources([]); setTotal(0); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [filter.category, filter.subcategory, filter.sort, filter.page, searchQuery]);

  const categoryNameById = Object.fromEntries(categories.map((c) => [String(c.id), c.name]));

  const selectedTopCat = categories.find((c) => c.slug === filter.category);

  const selectClass =
    "rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground outline-none transition focus:border-accent";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label={tr("filterCategory")}
          className={selectClass}
          value={filter.category}
          onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value, subcategory: "", page: 1 }))}
        >
          <option value="">{tr("allResourcesLabel")}</option>
          {categories.filter((c) => c.parentId === null).map((c) => (
            <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
          ))}
        </select>

        {selectedTopCat?.children && (
          <select
            aria-label="Subcategory"
            className={selectClass}
            value={filter.subcategory}
            onChange={(e) => setFilter((f) => ({ ...f, subcategory: e.target.value, page: 1 }))}
          >
            <option value="">All {selectedTopCat.name}</option>
            {selectedTopCat.children.map((child) => (
              <option key={child.slug} value={child.slug}>{child.icon} {child.name}</option>
            ))}
          </select>
        )}

        <select
          aria-label="Sort"
          className={selectClass}
          value={filter.sort}
          onChange={(e) => setFilter((f) => ({ ...f, sort: e.target.value, page: 1 }))}
        >
          <option value="latest">{tr("sortLatest")}</option>
          <option value="popular">{tr("sortPopular")}</option>
          <option value="a-z">{tr("sortAZ")}</option>
        </select>

        <input
          type="text"
          placeholder={tr("searchPlaceholder") ?? "Search resources…"}
          className={selectClass}
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setFilter((f) => ({ ...f, page: 1 })); }}
        />

        <p className="text-sm font-semibold text-muted">
          {total} {tr("resourcesCount")}
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      )}

      {!loading && resources.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {resources.map((r) => (
              <ResourceCard key={r.id} resource={r} categoryName={categoryNameById[String(r.categoryId)]} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                disabled={filter.page <= 1}
                onClick={() => setFilter((f) => ({ ...f, page: f.page - 1 }))}
                className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-card disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (filter.page <= 4) {
                  pageNum = i + 1;
                } else if (filter.page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = filter.page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setFilter((f) => ({ ...f, page: pageNum }))}
                    className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                      filter.page === pageNum
                        ? "bg-accent text-white"
                        : "border border-border text-foreground hover:bg-card"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                type="button"
                disabled={filter.page >= totalPages}
                onClick={() => setFilter((f) => ({ ...f, page: f.page + 1 }))}
                className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-card disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && <p className="text-sm text-muted">{tr("emptyResults")}</p>
      )}
    </div>
  );
}