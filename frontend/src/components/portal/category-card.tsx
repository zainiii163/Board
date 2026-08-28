"use client";

import Link from "next/link";

import { useLocale } from "@/lib/locale-context";
import { type PortalCategory } from "@/components/portal/portal-types";

export function CategoryCard({ category }: { category: PortalCategory }) {
  const { tr } = useLocale();

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span
        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} text-2xl text-white shadow-sm`}
      >
        {category.icon}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
        {category.children ? `${category.children.length} ${tr("resourcesCount")}` : "PDF"}
      </span>
      <h3 className="text-lg font-bold leading-tight text-foreground transition group-hover:text-accent">
        {category.name}
      </h3>
      {category.children && category.children.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {category.children.slice(0, 4).map((child) => (
            <span key={child.slug} className="rounded-full bg-background px-2 py-0.5 text-[11px] font-medium text-muted">
              {child.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}