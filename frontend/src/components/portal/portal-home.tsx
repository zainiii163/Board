"use client";

import Link from "next/link";

import { useLocale } from "@/lib/locale-context";
import { CategoryCard } from "@/components/portal/category-card";
import { ResourceCard } from "@/components/portal/resource-card";
import { AdBanner } from "@/components/portal/ad-banner";
import { type PortalCategory, type PortalResource, type PortalStats } from "@/components/portal/portal-types";

type Props = {
  categories: PortalCategory[];
  stats: PortalStats | null;
  latest: PortalResource[] | null;
  trending: PortalResource[] | null;
  categoryNameById: Record<string, string>;
};

export function PortalHome({ categories, stats, latest, trending, categoryNameById }: Props) {
  const { tr } = useLocale();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-accent to-emerald-600 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            BoardNotes Study Portal
          </p>
          <h1 className="font-serif text-2xl font-bold leading-tight text-white sm:whitespace-nowrap sm:text-3xl lg:text-4xl">
            {tr("portalHeroTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            {tr("portalHeroDesc")}
          </p>

          {stats && (
            <dl className="mt-6 grid max-w-sm grid-cols-3 gap-4">
              {[
                { value: stats.books.toLocaleString(), label: tr("portalStatBooks") },
                { value: String(stats.categories), label: tr("portalStatCategories") },
                { value: String(stats.users), label: tr("portalStatUsers") },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="text-xl font-black sm:text-2xl">{s.value}</dt>
                  <dd className="mt-0.5 text-[10px] font-medium text-white/75">{s.label}</dd>
                </div>
              ))}
            </dl>
          )}

          <form
            action="/search"
            className="mt-6 flex max-w-lg items-center gap-2 rounded-full bg-white p-1 shadow-lg"
          >
            <svg
              viewBox="0 0 24 24"
              className="ml-3 h-4 w-4 shrink-0 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              name="q"
              placeholder={tr("portalSearchPlaceholder")}
              className="w-full bg-transparent px-2 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="rounded-full bg-accent px-5 py-2 text-xs font-bold text-white transition hover:opacity-90"
            >
              {tr("startSearching")}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                {c.icon} {c.name}
              </Link>
            ))}
          </div>
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
            <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">{tr("browseCategories")}</h2>
            <p className="mt-1 text-sm text-muted">{tr("browseCategoriesDesc")}</p>
          </div>
          <Link
            href="/categories"
            className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 text-sm font-bold text-accent transition hover:bg-accent/20"
          >
            {tr("viewAll")}
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((c) => (
            <CategoryCard key={c.slug} category={c} />
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
              <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">{tr("latestResources")}</h2>
              <p className="mt-1 text-sm text-muted">{tr("justAdded")}</p>
            </div>
            <Link
              href="/books"
              className="shrink-0 rounded-full border border-border px-5 py-2 text-sm font-bold text-foreground transition hover:bg-card"
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
          <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">{tr("trendingResources")}</h2>
          <p className="mt-1 text-sm text-muted">{tr("downloadsLabel")}</p>
        </div>
        {(trending?.length ?? 0) > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {trending!.slice(0, 10).map((r) => (
              <ResourceCard key={r.id} resource={r} categoryName={categoryNameById[String(r.categoryId)]} />
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-accent to-emerald-700 px-8 py-12 text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">{tr("uploadShare")}</h2>
              <p className="mt-2 max-w-md text-sm text-white/80">{tr("uploadDesc")}</p>
            </div>
            <Link
              href="/upload"
              className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-accent shadow-sm transition hover:opacity-90"
            >
              {tr("uploadTitle")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}