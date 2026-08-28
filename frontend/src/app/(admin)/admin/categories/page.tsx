"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { apiFetch, apiAuthFetch } from "@/lib/api-client";

type CatInfo = { id: number; slug: string; name: string; nameUr: string; icon: string; gradient: string; parentId: number | null; order: number };
type ResourceCount = { categoryId: number; count: number };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CatInfo[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    apiFetch<{ categories: CatInfo[] }>("/api/portal/categories")
      .then((d) => setCategories(d.categories))
      .catch(() => {});

    apiAuthFetch<{ resources: { categoryId: number }[]; total: number }>("/api/resources?limit=9999")
      .then((d) => {
        const map: Record<number, number> = {};
        for (const r of d.resources) {
          map[r.categoryId] = (map[r.categoryId] ?? 0) + 1;
        }
        setCounts(map);
      })
      .catch(() => {});
  }, []);

  const topLevel = categories.filter((c) => c.parentId === null);
  const childrenMap = Object.fromEntries(topLevel.map((c) => [c.id, categories.filter((ch) => ch.parentId === c.id)]));

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Categories</h1>
      <p className="mt-2 text-sm text-muted">
        {categories.length} categories total • {Object.values(counts).reduce((a, b) => a + b, 0)} resources across all categories.
      </p>

      <div className="mt-8 space-y-6">
        {topLevel.map((cat) => {
          const kids = childrenMap[cat.id] ?? [];
          const catCount = counts[cat.id] ?? 0;
          const kidTotal = kids.reduce((sum, k) => sum + (counts[k.id] ?? 0), 0);
          const totalForCat = catCount + kidTotal;

          return (
            <div key={cat.id} className="rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h2 className="font-semibold text-foreground">{cat.name}</h2>
                    <p className="text-xs text-muted">{cat.nameUr}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                    {totalForCat} resources
                  </span>
                  <Link href={`/categories/${cat.slug}`} className="text-xs font-semibold text-accent hover:underline">
                    View →
                  </Link>
                </div>
              </div>

              {kids.length > 0 && (
                <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                  {kids.map((kid) => (
                    <div key={kid.id} className="flex items-center justify-between bg-card px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{kid.icon}</span>
                        <span className="text-sm font-medium text-foreground">{kid.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-muted">{counts[kid.id] ?? 0}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}