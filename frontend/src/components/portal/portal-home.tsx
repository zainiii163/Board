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
        <div className="relative mx-auto max-w-6xl px-4 py-2 sm:px-6 lg:px-8 lg:py-3">
          <p className="mb-1.5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            BoardNotes Study Portal
          </p>
          <h1 className="font-serif text-xl font-bold leading-tight sm:text-2xl lg:text-3xl xl:text-4xl xl:whitespace-nowrap">
            {tr("portalHeroTitle")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            {tr("portalHeroDesc")}
          </p>

          {stats && (
            <dl className="mt-6 grid max-w-lg grid-cols-3 gap-4">
              {[
                { value: stats.books.toLocaleString(), label: tr("portalStatBooks") },
                { value: String(stats.categories), label: tr("portalStatCategories") },
                { value: String(stats.users), label: tr("portalStatUsers") },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="text-xl font-black sm:text-2xl">{s.value}</dt>
                  <dd className="mt-1 text-[10px] font-medium text-white/75">{s.label}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                {c.icon} {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ad — below hero */}
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
        <AdBanner size="leaderboard" className="mx-auto" />
      </div>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">{tr("categories")}</h2>
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

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/923001234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition hover:bg-green-600 hover:scale-110"
        aria-label="Contact us on WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}