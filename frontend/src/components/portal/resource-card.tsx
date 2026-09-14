"use client";

import Link from "next/link";

import { useLocale } from "@/lib/locale-context";
import { CoverArt } from "@/components/portal/cover-art";
import { type PortalResource } from "@/components/portal/portal-types";

function formatCount(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

export function ResourceCard({
  resource,
  categoryName,
  hot = false,
  index = 0,
}: {
  resource: PortalResource;
  categoryName?: string;
  hot?: boolean;
  index?: number;
}) {
  const { tr } = useLocale();

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5 animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}>
      <Link
        href={`/books/${resource.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-slate-200"
        aria-label={resource.title}
      >
        <CoverArt title={resource.title} className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {hot && (
          <span className="absolute left-2 top-2 rounded bg-gradient-to-r from-red-500 to-orange-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-lg">
            {tr("hotBadge")}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
          {categoryName ?? resource.subject}
        </p>
        <Link
          href={`/books/${resource.slug}`}
          className="line-clamp-2 text-[15px] font-bold leading-snug text-foreground transition-colors duration-200 hover:text-accent"
        >
          {resource.title}
        </Link>
        <p className="text-xs text-muted">
          {resource.board ? `${resource.board} • ` : ""}
          {tr("addedBy")} {resource.author}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs font-semibold text-muted">
          <span className="inline-flex items-center gap-1 transition-colors duration-200 group-hover:text-accent">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M7 10l5 5 5-5" />
              <path d="M12 15V3" />
            </svg>
            {formatCount(resource.downloads)} {tr("downloadsLabel")}
          </span>
          <span>
            {resource.pages} {tr("pagesLabel")} • {resource.sizeLabel}
          </span>
        </div>
      </div>
    </article>
  );
}
