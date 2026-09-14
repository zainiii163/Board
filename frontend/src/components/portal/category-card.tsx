"use client";

import Link from "next/link";

import { useLocale } from "@/lib/locale-context";
import { type PortalCategory } from "@/components/portal/portal-types";

const GLOW_MAP: Record<string, { glow: string; bg: string; border: string; badge: string; tag: string }> = {
  "from-sky-500":    { glow: "group-hover:shadow-sky-200/60 dark:group-hover:shadow-sky-500/20", bg: "bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30", border: "border-sky-200/60 dark:border-sky-800/30", badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300", tag: "border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300" },
  "from-emerald-500": { glow: "group-hover:shadow-emerald-200/60 dark:group-hover:shadow-emerald-500/20", bg: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30", border: "border-emerald-200/60 dark:border-emerald-800/30", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300", tag: "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300" },
  "from-red-500":    { glow: "group-hover:shadow-red-200/60 dark:group-hover:shadow-red-500/20", bg: "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30", border: "border-red-200/60 dark:border-red-800/30", badge: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300", tag: "border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300" },
  "from-rose-500":   { glow: "group-hover:shadow-rose-200/60 dark:group-hover:shadow-rose-500/20", bg: "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30", border: "border-rose-200/60 dark:border-rose-800/30", badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300", tag: "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300" },
  "from-fuchsia-500": { glow: "group-hover:shadow-fuchsia-200/60 dark:group-hover:shadow-fuchsia-500/20", bg: "bg-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-950/30 dark:to-purple-950/30", border: "border-fuchsia-200/60 dark:border-fuchsia-800/30", badge: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/50 dark:text-fuchsia-300", tag: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-600 dark:border-fuchsia-800 dark:bg-fuchsia-950/50 dark:text-fuchsia-300" },
  "from-violet-500": { glow: "group-hover:shadow-violet-200/60 dark:group-hover:shadow-violet-500/20", bg: "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30", border: "border-violet-200/60 dark:border-violet-800/30", badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300", tag: "border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300" },
  "from-amber-500":  { glow: "group-hover:shadow-amber-200/60 dark:group-hover:shadow-amber-500/20", bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30", border: "border-amber-200/60 dark:border-amber-800/30", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300", tag: "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300" },
  "from-cyan-500":   { glow: "group-hover:shadow-cyan-200/60 dark:group-hover:shadow-cyan-500/20", bg: "bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30", border: "border-cyan-200/60 dark:border-cyan-800/30", badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300", tag: "border-cyan-200 bg-cyan-50 text-cyan-600 dark:border-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300" },
  "from-indigo-500": { glow: "group-hover:shadow-indigo-200/60 dark:group-hover:shadow-indigo-500/20", bg: "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30", border: "border-indigo-200/60 dark:border-indigo-800/30", badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300", tag: "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300" },
  "from-blue-500":   { glow: "group-hover:shadow-blue-200/60 dark:group-hover:shadow-blue-500/20", bg: "bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30", border: "border-blue-200/60 dark:border-blue-800/30", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300", tag: "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300" },
  "from-purple-500": { glow: "group-hover:shadow-purple-200/60 dark:group-hover:shadow-purple-500/20", bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30", border: "border-purple-200/60 dark:border-purple-800/30", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300", tag: "border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300" },
  "from-teal-500":   { glow: "group-hover:shadow-teal-200/60 dark:group-hover:shadow-teal-500/20", bg: "bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30", border: "border-teal-200/60 dark:border-teal-800/30", badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300", tag: "border-teal-200 bg-teal-50 text-teal-600 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300" },
  "from-orange-500": { glow: "group-hover:shadow-orange-200/60 dark:group-hover:shadow-orange-500/20", bg: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30", border: "border-orange-200/60 dark:border-orange-800/30", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300", tag: "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-300" },
  "from-yellow-400": { glow: "group-hover:shadow-yellow-200/60 dark:group-hover:shadow-yellow-500/20", bg: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30", border: "border-yellow-200/60 dark:border-yellow-800/30", badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300", tag: "border-yellow-200 bg-yellow-50 text-yellow-600 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300" },
};

const DEFAULT_STYLE = {
  glow: "group-hover:shadow-accent/20",
  bg: "bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30",
  border: "border-teal-200/60 dark:border-teal-800/30",
  badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
  tag: "border-teal-200 bg-teal-50 text-teal-600 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300",
};

function getStyle(gradient: string) {
  for (const [key, value] of Object.entries(GLOW_MAP)) {
    if (gradient.includes(key)) return value;
  }
  return DEFAULT_STYLE;
}

export function CategoryCard({ category, index = 0 }: { category: PortalCategory; index?: number }) {
  const { tr } = useLocale();
  const s = getStyle(category.gradient);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border ${s.border} ${s.bg} p-5 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl ${s.glow} animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
    >
      {/* Top-right decorative blob */}
      <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${category.gradient} opacity-[0.08] blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-[0.15]`} />

      {/* Icon */}
      <span
        className={`relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} text-2xl text-white shadow-md transition-all duration-400 group-hover:scale-110 group-hover:shadow-lg group-hover:rotate-3`}
      >
        {category.icon}
      </span>

      {/* Resource count badge */}
      <span className={`relative inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors duration-200 ${s.badge}`}>
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
            <span key={child.slug} className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all duration-300 group-hover:shadow-sm ${s.tag}`}>
              {child.name}
            </span>
          ))}
        </div>
      )}

      {/* Bottom animated accent line */}
      <span className={`absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r ${category.gradient} transition-all duration-700 ease-out group-hover:w-full rounded-full`} />
    </Link>
  );
}
