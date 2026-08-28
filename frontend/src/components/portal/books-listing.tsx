"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

import { apiFetch } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";
import { ResourceCard } from "@/components/portal/resource-card";
import { type PortalCategory, type PortalResource } from "@/components/portal/portal-types";

const PAGE_SIZE = 24;

type Filter = {
  category: string;
  subcategory: string;
  sort: string;
  page: number;
};

type Props = {
  initialResources: PortalResource[];
  initialTotal: number;
  categories: PortalCategory[];
};

export function BooksListing({ initialResources, initialTotal, categories }: Props) {
  const { tr } = useLocale();
  const [filter, setFilter] = useState<Filter>({ category: "", subcategory: "", sort: "latest", page: 1 });
  const [resources, setResources] = useState(initialResources);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchResources = useCallback(async (cat: string, subcat: string, sort: string, page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "120", sort });
      const useCat = subcat || cat;
      if (useCat) params.set("category", useCat);
      const data = await apiFetch<{ resources: PortalResource[]; total: number }>(`/api/resources?${params}`);
      setResources(data.resources);
      setTotal(data.total);
    } catch {
      setResources([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources(filter.category, filter.subcategory, filter.sort, filter.page);
  }, [filter.category, filter.subcategory, filter.sort, fetchResources]);

  const categoryNameById = useMemo(
    () => Object.fromEntries(categories.map((c) => [String(c.id), c.name])),
    [categories],
  );

  const selectedTopCat = useMemo(
    () => categories.find((c) => c.slug === filter.category),
    [categories, filter.category, categories],
  );

  const paginatedResources = useMemo(() => {
    const start = (filter.page - 1) * PAGE_SIZE;
    return resources.slice(start, start + PAGE_SIZE);
  }, [resources, filter.page]);

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

        {selectedTopCat && (selectedTopCat as unknown as { children?: PortalCategory[] }).children && (
          <select
            aria-label="Subcategory"
            className={selectClass}
            value={filter.subcategory}
            onChange={(e) => setFilter((f) => ({ ...f, subcategory: e.target.value, page: 1 }))}
          >
            <option value="">All {selectedTopCat.name}</option>
            {(selectedTopCat as unknown as { children?: PortalCategory[] }).children?.map((child: PortalCategory) => (
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

        <p className="text-sm font-semibold text-muted">
          {total} {tr("resourcesCount")}
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      )}

      {!loading && paginatedResources.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {paginatedResources.map((r) => (
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