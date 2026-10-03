"use client";

import Link from "next/link";
import Image from "next/image";
import { Download, FileText } from "lucide-react";

import { useLocale } from "@/lib/locale-context";
import { CoverArt } from "@/components/portal/cover-art";
import { HoverCard } from "@/components/motion/hover-card";
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
    <HoverCard className="h-full" lift={5}>
      <article
        className={`group glass-card flex h-full flex-col overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-lift animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
      >
        <Link
          href={`/books/${resource.slug}`}
          className="relative block aspect-[4/5] overflow-hidden bg-slate-200"
          aria-label={resource.title}
        >
          {resource.coverUrl ? (
            <Image
              src={resource.coverUrl}
              alt={resource.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          ) : (
            <CoverArt title={resource.title} className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {hot && (
            <span className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-lg">
              {tr("hotBadge")}
            </span>
          )}
          <span className="absolute bottom-2 right-2 inline-flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-slate-950/70 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Download className="h-4 w-4" aria-hidden="true" />
          </span>
        </Link>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
            {categoryName ?? resource.subject}
          </p>
          <Link
            href={`/books/${resource.slug}`}
            className="line-clamp-2 text-[15px] font-bold leading-snug text-foreground transition-colors duration-300 hover:text-accent"
          >
            {resource.title}
          </Link>
          <p className="text-xs text-muted">
            {resource.board ? `${resource.board} · ` : ""}
            {tr("addedBy")} {resource.author}
          </p>
          <div className="mt-auto flex items-center justify-between pt-2 text-xs font-semibold text-muted">
            <span className="inline-flex items-center gap-1 transition-colors duration-300 group-hover:text-accent">
              <Download className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
              {formatCount(resource.downloads)} {tr("downloadsLabel")}
            </span>
            <span className="inline-flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              {resource.pages} {tr("pagesLabel")}
            </span>
          </div>
        </div>
      </article>
    </HoverCard>
  );
}
