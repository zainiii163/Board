"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

import { apiAuthFetch, apiPatch, apiDelete, apiFetch } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";
import { type PortalResource } from "@/components/portal/portal-types";

type ResourcesPage = { resources: PortalResource[]; total: number };
type CatInfo = { id: number; slug: string; name: string; nameUr: string; icon: string; parentId: number | null };

const PAGE_SIZE = 50;

export default function ManageResourcesPage() {
  const { tr } = useLocale();
  const [resources, setResources] = useState<PortalResource[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [categories, setCategories] = useState<CatInfo[]>([]);
  const [filterCat, setFilterCat] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async (catSlug?: string, searchVal?: string, pageNum?: number) => {
    const url = `/api/resources?limit=${PAGE_SIZE}&sort=latest&offset=${((pageNum ?? 1) - 1) * PAGE_SIZE}${catSlug ? `&category=${catSlug}` : ""}${searchVal ? `&search=${encodeURIComponent(searchVal)}` : ""}`;
    const data = await apiAuthFetch<ResourcesPage>(url);
    setResources(data.resources);
    setTotal(data.total);
  }, []);

  useEffect(() => {
    apiFetch<{ categories: CatInfo[] }>("/api/portal/categories")
      .then((d: { categories: CatInfo[] }) => setCategories(d.categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
    load(filterCat || undefined, debouncedSearch || undefined, 1);
  }, [filterCat, debouncedSearch, load]);

  useEffect(() => {
    load(filterCat || undefined, debouncedSearch || undefined, page);
  }, [page, load, filterCat, debouncedSearch]);

  async function toggleStatus(resource: PortalResource) {
    setBusyId(resource.id);
    try {
      await apiPatch(`/api/resources/${resource.id}`, {
        status: resource.status === "published" ? "draft" : "published",
      });
      await load(filterCat || undefined, debouncedSearch || undefined, page);
    } finally {
      setBusyId(null);
    }
  }

  async function remove(resource: PortalResource) {
    if (!confirm(`Delete "${resource.title}"?`)) return;
    setBusyId(resource.id);
    try {
      await apiDelete(`/api/resources/${resource.id}`);
      await load(filterCat || undefined, debouncedSearch || undefined, page);
    } finally {
      setBusyId(null);
    }
  }

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const topLevel = categories.filter((c) => c.parentId === null);

  function toggleSelectAll() {
    if (selected.size === resources.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(resources.map((r) => r.id)));
    }
  }

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function bulkAction(action: "publish" | "unpublish") {
    if (selected.size === 0) return;
    setBulkBusy(true);
    try {
      const status = action === "publish" ? "published" : "draft";
      await Promise.all(
        Array.from(selected).map((id) =>
          apiPatch(`/api/resources/${id}`, { status })
        )
      );
      setSelected(new Set());
      await load(filterCat || undefined, debouncedSearch || undefined, page);
    } finally {
      setBulkBusy(false);
    }
  }

  function getPageNumbers(): (number | "...")[] {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-black text-foreground">Resources</h1>
          <p className="mt-2 text-sm text-muted">
            {total} resources in the catalog. Publish, unpublish or remove community uploads.
          </p>
        </div>
        <Link href="/upload" className="rounded-full bg-gradient-to-r from-accent to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md">
          + Upload resource
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/60 transition focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground transition focus:border-accent focus:outline-none"
        >
          <option value="">All Categories</option>
          {topLevel.map((cat) => {
            const childCount = categories.filter((c) => c.parentId === cat.id).length;
            return (
              <optgroup key={cat.slug} label={`${cat.icon} ${cat.name}${childCount > 0 ? ` (${childCount + 1})` : ""}`}>
                <option value={cat.slug}>{cat.icon} {cat.name}</option>
                {categories.filter((c) => c.parentId === cat.id).map((child) => (
                  <option key={child.slug} value={child.slug}>{child.icon} {child.name}</option>
                ))}
              </optgroup>
            );
          })}
        </select>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-4 py-2 animate-fade-in">
            <span className="text-sm font-semibold text-accent">{selected.size} selected</span>
            <button type="button" disabled={bulkBusy} onClick={() => bulkAction("publish")}
              className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50">
              Publish
            </button>
            <button type="button" disabled={bulkBusy} onClick={() => bulkAction("unpublish")}
              className="rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50">
              Unpublish
            </button>
            <button type="button" onClick={() => setSelected(new Set())}
              className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted transition hover:text-foreground">
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-bold uppercase tracking-wider text-muted">
              <th className="py-3 pr-3 w-10">
                <input
                  type="checkbox"
                  checked={resources.length > 0 && selected.size === resources.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-border accent-accent cursor-pointer"
                />
              </th>
              <th className="py-3 pr-3">Title</th>
              <th className="py-3 pr-3">Category</th>
              <th className="py-3 pr-3">Subject</th>
              <th className="py-3 pr-3">Downloads</th>
              <th className="py-3 pr-3">Status</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource, idx) => {
              const catInfo = catMap[resource.categoryId];
              return (
                <tr key={resource.id}
                  className={`border-b border-border/60 align-middle transition-colors hover:bg-accent/5 ${idx % 2 === 0 ? "bg-background/30" : "bg-card/30"}`}>
                  <td className="py-3 pr-3 w-10">
                    <input
                      type="checkbox"
                      checked={selected.has(resource.id)}
                      onChange={() => toggleSelect(resource.id)}
                      className="h-4 w-4 rounded border-border accent-accent cursor-pointer"
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <p className="max-w-xs truncate font-semibold text-foreground">{resource.title}</p>
                    <p className="text-xs text-muted">{resource.board ?? "—"}</p>
                  </td>
                  <td className="py-3 pr-3">
                    <span className="text-xs font-medium text-muted">
                      {catInfo ? `${catInfo.icon} ${catInfo.name}` : `#${resource.categoryId}`}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-xs text-muted">{resource.subject}</td>
                  <td className="py-3 pr-3 text-muted">{resource.downloads.toLocaleString()}</td>
                  <td className="py-3 pr-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      resource.status === "published"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                    }`}>
                      {resource.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/books/${resource.slug}`} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent/10">View</Link>
                      <button type="button" disabled={busyId === resource.id} onClick={() => toggleStatus(resource)}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-background disabled:opacity-50">
                        {resource.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button type="button" disabled={busyId === resource.id} onClick={() => remove(resource)}
                        className="rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {resources.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl opacity-40">📭</div>
            <p className="mt-4 text-lg font-semibold text-foreground">No resources found</p>
            <p className="mt-1 text-sm text-muted">{search ? "Try a different search term" : "Upload your first resource to get started"}</p>
            {!search && (
              <Link href="/upload" className="mt-4 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:shadow-md">
                + Upload resource
              </Link>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1">
          <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition hover:text-foreground disabled:opacity-40">
            ← Prev
          </button>
          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`dots-${i}`} className="px-2 text-muted">…</span>
            ) : (
              <button key={p} type="button" onClick={() => setPage(p)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  page === p
                    ? "bg-accent text-white"
                    : "border border-border text-muted hover:text-foreground hover:border-accent"
                }`}>
                {p}
              </button>
            )
          )}
          <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition hover:text-foreground disabled:opacity-40">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
