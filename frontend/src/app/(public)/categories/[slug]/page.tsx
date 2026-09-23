import Link from "next/link";
import { notFound } from "next/navigation";

import { apiFetchOrNull } from "@/lib/api-client";
import { ResourceCard } from "@/components/portal/resource-card";
import { CoverArt } from "@/components/portal/cover-art";
import { AdBanner } from "@/components/portal/ad-banner";
import {
  type PortalCategory,
  type PortalResource,
  type PortalTrailNode,
} from "@/components/portal/portal-types";

type CategoryDetail = {
  category: PortalCategory;
  trail: PortalTrailNode[];
  children: PortalCategory[];
  siblings: PortalCategory[];
  resources: PortalResource[];
  total: number;
};

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await apiFetchOrNull<CategoryDetail>(`/api/categories/${slug}`);
  if (!data) notFound();

  const { category, trail, children, siblings, resources } = data;

  return (
    <div>
      {/* Category header */}
      <section className={`bg-gradient-to-br ${category.gradient} text-white`}>
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-12 sm:px-6 lg:px-8 lg:flex-row lg:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-5xl backdrop-blur">
            {category.icon}
          </div>
          <div className="min-w-0">
            <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs font-bold text-white/70" aria-label="Breadcrumb">
              <Link href="/categories" className="transition hover:text-white">
                Home
              </Link>
              {trail.map((node) => (
                <span key={node.slug} className="inline-flex items-center gap-1.5">
                  <span>/</span>
                  <Link href={`/categories/${node.slug}`} className="transition hover:text-white">
                    {node.name}
                  </Link>
                </span>
              ))}
            </nav>
            <h1 className="font-serif text-3xl font-bold sm:text-4xl">{category.name}</h1>
            <p className="mt-2 text-sm font-semibold text-white/80">{data.total} PDFs to download</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Child categories */}
        {children.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Sub-categories</h2>
            <div className="flex flex-wrap gap-2">
              {children.map((child) => (
                <Link
                  key={child.slug}
                  href={`/categories/${child.slug}`}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
                >
                  {child.icon} {child.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sibling quick nav */}
        {siblings.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Also in this section</h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/categories/${s.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition hover:border-accent"
                >
                  <CoverArt title={s.name} gradient={s.gradient} className="h-12 w-9 rounded-lg" />
                  <span className="min-w-0 text-sm font-semibold text-foreground">{s.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-serif text-xl font-bold text-foreground">
            {category.name} — {resources.length} resources
          </h2>
        </div>
        {resources.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {resources.map((r) => (
              <ResourceCard key={r.id} resource={r} categoryName={category.name} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No resources here yet.</p>
        )}

        {/* Ad — bottom only */}
        <div className="mt-10">
          <AdBanner size="leaderboard" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}