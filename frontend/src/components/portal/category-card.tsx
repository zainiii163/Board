"use client";

import Link from "next/link";

import { useLocale } from "@/lib/locale-context";
import { type PortalCategory } from "@/components/portal/portal-types";

const HOVER_GLOW: Record<string, string> = {
  "from-sky-500": "group-hover:shadow-sky-200/50",
  "from-emerald-500": "group-hover:shadow-emerald-200/50",
  "from-red-500": "group-hover:shadow-red-200/50",
  "from-rose-500": "group-hover:shadow-rose-200/50",
  "from-fuchsia-500": "group-hover:shadow-fuchsia-200/50",
  "from-violet-500": "group-hover:shadow-violet-200/50",
  "from-amber-500": "group-hover:shadow-amber-200/50",
  "from-cyan-500": "group-hover:shadow-cyan-200/50",
  "from-indigo-500": "group-hover:shadow-indigo-200/50",
  "from-blue-500": "group-hover:shadow-blue-200/50",
  "from-purple-500": "group-hover:shadow-purple-200/50",
  "from-teal-500": "group-hover:shadow-teal-200/50",
  "from-orange-500": "group-hover:shadow-orange-200/50",
  "from-yellow-400": "group-hover:shadow-yellow-200/50",
};

function getGlow(gradient: string) {
  for (const [key, value] of Object.entries(HOVER_GLOW)) {
    if (gradient.includes(key)) return value;
  }
  return "group-hover:shadow-accent/20";
}

export function CategoryCard({ category, index = 0 }: { category: PortalCategory; index?: number }) {
  const { tr } = useLocale();
  const glow = getGlow(category.gradient);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${glow} animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.03]`} />

      <span
        className={`relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} text-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg`}
      >
        {category.icon}
      </span>

      <span className="relative text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
        {category.children ? `${category.children.length} ${tr("resourcesCount")}` : "PDF"}
      </span>

      <h3 className="relative text-lg font-bold leading-tight text-foreground transition-colors duration-200 group-hover:text-accent">
        {category.name}
      </h3>

      {category.children && category.children.length > 0 && (
        <div className="relative flex flex-wrap gap-1.5">
          {category.children.slice(0, 4).map((child) => (
            <span key={child.slug} className="rounded-full bg-background px-2 py-0.5 text-[11px] font-medium text-muted transition-colors duration-200 group-hover:bg-accent/5 group-hover:text-accent">
              {child.name}
            </span>
          ))}
        </div>
      )}

      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r transition-all duration-500 group-hover:w-full group-hover:from-accent to-emerald-400" />
    </Link>
  );
}
