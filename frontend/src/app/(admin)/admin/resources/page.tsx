"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

import { apiAuthFetch, apiDelete, apiPatch, apiFetch } from "@/lib/api-client";
import { useLocale } from "@/lib/locale-context";
import { type PortalResource } from "@/components/portal/portal-types";

type ResourcesPage = { resources: PortalResource[]; total: number };
type CatInfo = { id: number; slug: string; name: string; nameUr: string; icon: string; parentId: number | null };

export default function ManageResourcesPage() {
  const { tr } = useLocale();
  const [resources, setResources] = useState<PortalResource[]>([]);
  const [total, setTotal] = useState(0);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [categories, setCategories] = useState<CatInfo[]>([]);
  const [filterCat, setFilterCat] = useState("");

  const load = useCallback(async (catSlug?: string) => {
    const url = `/api/resources?limit=200&sort=latest${catSlug ? `&category=${catSlug}` : ""}`;
    const data = await apiAuthFetch<ResourcesPage>(url);
    setResources(data.resources);
    setTotal(data.total);
  }, []);

  useEffect(() => {
    load();
    apiFetch<{ categories: CatInfo[] }>("/api/portal/categories")
      .then((d) => setCategories(d.categories))
      .catch(() => {});
  }, [load]);

  useEffect(() => {
    load(filterCat || undefined);
  }, [filterCat, load]);

  async function toggleStatus(resource: PortalResource) {
    setBusyId(resource.id);
    try {
      await apiPatch(`/api/resources/${resource.id}`, {
        status: resource.status === "published" ? "draft" : "published",
      });
      await load(filterCat || undefined);
    } finally {
      setBusyId(null);
    }
  }

  async function remove(resource: PortalResource) {
    if (!confirm(`Delete "${resource.title}"?`)) return;
    setBusyId(resource.id);
    try {
      await apiDelete(`/api/resources/${resource.id}`);
      await load(filterCat || undefined);
    } finally {
      setBusyId(null);
    }
  }

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  const topLevel = categories.filter((c) => c.parentId === null);

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Resources</h1>
      <p className="mt-2 text-sm text-muted">
        {total} resources in the catalog. Publish, unpublish or remove community uploads.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground"
        >
          <option value="">All Categories</option>
          {topLevel.map((cat) => (
            <optgroup key={cat.slug} label={`${cat.icon} ${cat.name}`}>
              <option value={cat.slug}>{cat.name}</option>
              {categories.filter((c) => c.parentId === cat.id).map((child) => (
                <option key={child.slug} value={child.slug}>  {child.icon} {child.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <Link href="/upload" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
          + Upload resource
        </Link>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-bold uppercase tracking-wider text-muted">
              <th className="py-3 pr-3">Title</th>
              <th className="py-3 pr-3">Category</th>
              <th className="py-3 pr-3">Subject</th>
              <th className="py-3 pr-3">Downloads</th>
              <th className="py-3 pr-3">Status</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => {
              const catInfo = catMap[resource.categoryId];
              return (
                <tr key={resource.id} className="border-b border-border/60 align-middle">
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
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${
                      resource.status === "published"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                    }`}>
                      {resource.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/books/${resource.slug}`} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-accent">View</Link>
                      <button type="button" disabled={busyId === resource.id} onClick={() => toggleStatus(resource)}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground disabled:opacity-50">
                        {resource.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button type="button" disabled={busyId === resource.id} onClick={() => remove(resource)}
                        className="rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50">
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
          <p className="py-8 text-center text-sm text-muted">{tr("noResourcesYet")}</p>
        )}
      </div>
    </div>
  );
}