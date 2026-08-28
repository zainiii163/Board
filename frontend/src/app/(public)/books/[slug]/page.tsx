import Link from "next/link";
import { notFound } from "next/navigation";

import { apiFetchOrNull } from "@/lib/api-client";
import { CoverArt } from "@/components/portal/cover-art";
import { ResourceCard } from "@/components/portal/resource-card";
import { ResourceActions } from "@/components/portal/resource-actions";
import { PdfViewer } from "@/components/content/pdf-viewer";
import { AdBanner } from "@/components/portal/ad-banner";
import {
  type PortalCategory,
  type PortalResource,
  type PortalTrailNode,
} from "@/components/portal/portal-types";

type ResourceDetail = {
  resource: PortalResource;
  category: Pick<PortalCategory, "id" | "slug" | "name" | "nameUr" | "icon" | "gradient"> | null;
  trail: PortalTrailNode[];
  related: PortalResource[];
};

export const dynamic = "force-dynamic";

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await apiFetchOrNull<ResourceDetail>(`/api/resources/${slug}`);
  if (!data) notFound();

  const { resource, category, trail, related } = data;
  const addedDate = new Date(resource.addedAt).toLocaleDateString();

  const chips = [
    resource.classLabel,
    resource.board,
    resource.subject,
    resource.pages ? `${resource.pages} pages` : null,
    resource.sizeLabel && resource.sizeLabel !== "N/A" ? resource.sizeLabel : null,
  ].filter(Boolean);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-muted" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-accent">
            Home
          </Link>
          <span>/</span>
          <Link href="/categories" className="transition hover:text-accent">
            Categories
          </Link>
          {trail.map((node) => (
            <span key={node.slug} className="inline-flex items-center gap-1.5">
              <span>/</span>
              <Link href={`/categories/${node.slug}`} className="transition hover:text-accent">
                {node.name}
              </Link>
            </span>
          ))}
          <span>/</span>
          <span className="text-foreground">{resource.title}</span>
        </nav>
      </div>

      {/* Header card */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="mx-auto w-56 overflow-hidden rounded-2xl border border-border shadow-lg lg:mx-0 lg:w-full">
            <CoverArt title={resource.title} gradient={category?.gradient} className="aspect-[4/5] h-full w-full" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
              {category?.name ?? resource.subject}
            </p>
            <h1 className="mt-2 font-serif text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              {resource.title}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {resource.author} • Added on {addedDate}
            </p>

            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-card px-3 py-1 text-xs font-bold text-foreground ring-1 ring-border"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}

            <ResourceActions slug={resource.slug} fileUrl={resource.fileUrl} downloads={resource.downloads} />

            <p className="mt-6 text-sm leading-relaxed text-muted">{resource.description}</p>
          </div>
        </div>
      </section>

      {/* Ad — above reader */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AdBanner size="leaderboard" className="mx-auto" />
      </div>

      {/* PDF reader */}
      {resource.fileUrl && (
        <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
            <div id="pdf-reader">
              <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Read Online</h2>
              <PdfViewer url={resource.fileUrl} title={resource.title} />
            </div>
          </div>
        </section>
      )}

      {/* Ad — after reader */}
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <AdBanner size="inline" className="mx-auto" />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">Related Resources</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {related.map((r) => (
              <ResourceCard key={r.id} resource={r} categoryName={category?.name} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}