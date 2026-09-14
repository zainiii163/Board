"use client";

import Link from "next/link";

import { useLocale } from "@/lib/locale-context";
import { type PortalCategory } from "@/components/portal/portal-types";

const HOVER_GLOW: Record<string, string> = {
  "from-sky-500": "group-hover:shadow-sky-200/60 dark:group-hover:shadow-sky-500/20",
  "from-emerald-500": "group-hover:shadow-emerald-200/60 dark:group-hover:shadow-emerald-500/20",
  "from-red-500": "group-hover:shadow-red-200/60 dark:group-hover:shadow-red-500/20",
  "from-rose-500": "group-hover:shadow-rose-200/60 dark:group-hover:shadow-rose-500/20",
  "from-fuchsia-500": "group-hover:shadow-fuchsia-200/60 dark:group-hover:shadow-fuchsia-500/20",
  "from-violet-500": "group-hover:shadow-violet-200/60 dark:group-hover:shadow-violet-500/20",
  "from-amber-500": "group-hover:shadow-amber-200/60 dark:group-hover:shadow-amber-500/20",
  "from-cyan-500": "group-hover:shadow-cyan-200/60 dark:group-hover:shadow-cyan-500/20",
  "from-indigo-500": "group-hover:shadow-indigo-200/60 dark:group-hover:shadow-indigo-500/20",
  "from-blue-500": "group-hover:shadow-blue-200/60 dark:group-hover:shadow-blue-500/20",
  "from-purple-500": "group-hover:shadow-purple-200/60 dark:group-hover:shadow-purple-500/20",
  "from-teal-500": "group-hover:shadow-teal-200/60 dark:group-hover:shadow-teal-500/20",
  "from-orange-500": "group-hover:shadow-orange-200/60 dark:group-hover:shadow-orange-500/20",
  "from-yellow-400": "group-hover:shadow-yellow-200/60 dark:group-hover:shadow-yellow-500/20",
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
      className={`group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl ${glow} animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
    >
      {/* Hover gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.05]`} />

      {/* Top-right decorative corner gradient */}
      <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${category.gradient} opacity-[0.06] blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-[0.12]`} />

      {/* Icon */}
      <span
        className={`relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} text-2xl text-white shadow-md transition-all duration-400 group-hover:scale-110 group-hover:shadow-lg group-hover:rotate-3`}
      >
        {category.icon}
      </span>

      {/* Resource count badge */}
      <span className="relative inline-flex items-center gap-1 rounded-full bg-accent/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-accent transition-colors duration-200 group-hover:bg-accent/15">
        {category.children ? `${category.children.length} ${tr("resourcesCount")}` : "PDF"}
      </span>

      {/* Title */}
      <h3 className="relative text-lg font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-accent">
        {category.name}
      </h3>

      {/* Children tags */}
      {category.children && category.children.length > 0 && (
        <div className="relative flex flex-wrap gap-1.5">
          {category.children.slice(0, 4).map((child) => (
            <span key={child.slug} className="rounded-full border border-border/60 bg-background/80 px-2.5 py-0.5 text-[11px] font-medium text-muted transition-all duration-300 group-hover:border-accent/30 group-hover:bg-accent/5 group-hover:text-accent">
              {child.name}
            </span>
          ))}
        </div>
      )}

      {/* Bottom animated accent line */}
      <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-accent to-emerald-400 transition-all duration-700 ease-out group-hover:w-full rounded-full" />
    </Link>
  );
}
