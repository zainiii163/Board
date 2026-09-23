"use client";

import Link from "next/link";

import { useLocale } from "@/lib/locale-context";
import { type PortalCategory } from "@/components/portal/portal-types";

export function CategoryCard({ category, index = 0 }: { category: PortalCategory; index?: number }) {
  const { tr } = useLocale();

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-xl transition group-hover:border-accent/40 group-hover:bg-accent/10">
        {category.icon}
      </span>

      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
        {category.children ? `${category.children.length} ${tr("resourcesCount")}` : "PDF"}
      </span>

      <h3 className="text-lg font-bold leading-tight text-foreground transition-colors duration-200 group-hover:text-accent">
        {category.name}
      </h3>

      {category.children && category.children.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {category.children.slice(0, 4).map((child) => (
            <span
              key={child.slug}
              className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium text-muted transition group-hover:text-foreground/80"
            >
              {child.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
