"use client";

import Link from "next/link";

import { useLocale } from "@/lib/locale-context";
import { CategoryCard } from "@/components/portal/category-card";
import { ResourceCard } from "@/components/portal/resource-card";
import { AdBanner } from "@/components/portal/ad-banner";
import { type PortalCategory, type PortalResource } from "@/components/portal/portal-types";

type Props = {
  categories: PortalCategory[];
  latest: PortalResource[] | null;
  trending: PortalResource[] | null;
  categoryNameById: Record<string, string>;
};

export function PortalHome({ categories, latest, trending, categoryNameById }: Props) {
  const { tr } = useLocale();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-accent to-emerald-600 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <h1 className="animate-fade-in-up font-serif text-lg font-bold leading-tight text-white sm:whitespace-nowrap sm:text-xl lg:text-2xl">
            {tr("portalHeroTitle")}
          </h1>
          <p className="animate-fade-in-up stagger-1 mt-1 max-w-xl text-xs leading-relaxed text-white/85 sm:text-sm">
            {tr("portalHeroDesc")}
          </p>
        </div>
      </section>

      {/* Ad — below hero */}
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <AdBanner size="leaderboard" className="mx-auto" />
      </div>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="animate-fade-in-up font-serif text-2xl font-bold text-foreground sm:text-3xl">{tr("browseCategories")}</h2>
            <p className="animate-fade-in-up stagger-1 mt-1 text-sm text-muted">{tr("browseCategoriesDesc")}</p>
          </div>
          <Link
            href="/categories"
            className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 text-sm font-bold text-accent transition-all duration-300 hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/20"
          >
            {tr("viewAll")}
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((c, i) => (
            <CategoryCard key={c.slug} category={c} index={i} />
          ))}
        </div>
      </section>

      {/* Ad — mid content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AdBanner size="inline" />
      </div>

      {/* Latest */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="animate-fade-in-up font-serif text-2xl font-bold text-foreground sm:text-3xl">{tr("latestResources")}</h2>
              <p className="animate-fade-in-up stagger-1 mt-1 text-sm text-muted">{tr("justAdded")}</p>
            </div>
            <Link
              href="/books"
              className="shrink-0 rounded-full border border-border px-5 py-2 text-sm font-bold text-foreground transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/20"
            >
              {tr("viewAll")} →
            </Link>
          </div>
          {(latest?.length ?? 0) > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {latest!.map((r, i) => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  categoryName={categoryNameById[String(r.categoryId)]}
                  hot={i < 1}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">{tr("noResourcesYet")}</p>
          )}
        </div>
      </section>

      {/* Ad — between sections */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AdBanner size="banner" className="mx-auto" />
      </div>

      {/* Trending */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="animate-fade-in-up font-serif text-2xl font-bold text-foreground sm:text-3xl">{tr("trendingResources")}</h2>
          <p className="animate-fade-in-up stagger-1 mt-1 text-sm text-muted">{tr("downloadsLabel")}</p>
        </div>
        {(trending?.length ?? 0) > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {trending!.slice(0, 10).map((r, i) => (
              <ResourceCard key={r.id} resource={r} categoryName={categoryNameById[String(r.categoryId)]} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">{tr("noResourcesYet")}</p>
        )}
      </section>

      {/* Ad — before CTA */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AdBanner size="mobile-banner" className="mx-auto" />
      </div>

      {/* Upload CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-accent to-emerald-700 px-8 py-12 text-white transition-shadow duration-500 hover:shadow-2xl hover:shadow-accent/20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="animate-fade-in-up font-serif text-2xl font-bold sm:text-3xl">{tr("uploadShare")}</h2>
              <p className="animate-fade-in-up stagger-1 mt-2 max-w-md text-sm text-white/80">{tr("uploadDesc")}</p>
            </div>
            <Link
              href="/upload"
              className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-accent shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20"
            >
              {tr("uploadTitle")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
