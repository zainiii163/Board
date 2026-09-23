import Link from "next/link";
import { notFound } from "next/navigation";

import { apiFetchOrNull } from "@/lib/api-client";
import { ResourceCard } from "@/components/portal/resource-card";
import { AdBanner } from "@/components/portal/ad-banner";
import {
  type PortalCategory,
  type PortalResource,
  type PortalTrailNode,
} from "@/components/portal/portal-types";
import { BOARD_TEXTBOOK_CATEGORY } from "@/lib/constants";

type CategoryDetail = {
  category: PortalCategory;
  trail: PortalTrailNode[];
  children: PortalCategory[];
  siblings: PortalCategory[];
  resources: PortalResource[];
  total: number;
};

const BOARD_BOOK_SLUGS = new Set(Object.values(BOARD_TEXTBOOK_CATEGORY));

function isBoardBookCategory(slug: string): boolean {
  return BOARD_BOOK_SLUGS.has(slug) || slug.endsWith("-text-books");
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await apiFetchOrNull<CategoryDetail>(`/api/categories/${slug}`);
  if (!data) notFound();

  const { category, trail, children, siblings, resources } = data;
  // On board textbook pages, don't cross-link to other boards.
  const showSiblings = !isBoardBookCategory(category.slug);

  return (
    <div>
      {/* Category header — simple */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-muted" aria-label="Breadcrumb">
            <Link href="/categories" className="transition hover:text-accent">
              Home
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
            <span className="text-foreground">{category.name}</span>
          </nav>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-2xl">
                  {category.icon}
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Category</p>
                  <h1 className="mt-0.5 font-serif text-3xl font-black text-foreground sm:text-4xl">{category.name}</h1>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted">{data.total} PDFs to download</p>
            </div>
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

        {/* Sibling quick nav — hidden on board textbook pages */}
        {showSiblings && siblings.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Also in this section</h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/categories/${s.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition hover:border-accent"
                >
                  <span className="inline-flex h-10 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-sm">
                    {s.icon}
                  </span>
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