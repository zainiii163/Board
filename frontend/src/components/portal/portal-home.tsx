"use client";

import Link from "next/link";

import { useLocale } from "@/lib/locale-context";
import { ACADEMIC_YEAR } from "@/lib/constants";
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
      {/* ─── Hero — simple ─── */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-bold text-muted">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              {ACADEMIC_YEAR} — Free study resources for all boards
            </div>
            <h1 className="font-serif text-xl font-black leading-tight text-foreground sm:text-2xl lg:text-3xl">
              {tr("portalHeroTitle")}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              {tr("portalHeroDesc")}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                {tr("browseCategories")}
              </Link>
              <Link
                href="/books"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition hover:border-accent hover:text-accent"
              >
                {tr("books")} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-block h-6 w-1 rounded-full bg-accent" />
              <h2 className="font-serif text-2xl font-black text-foreground sm:text-3xl">{tr("browseCategories")}</h2>
            </div>
            <p className="text-sm text-muted">{tr("browseCategoriesDesc")}</p>
          </div>
          <Link
            href="/categories"
            className="shine-on-hover shrink-0 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 text-sm font-bold text-accent transition-all duration-300 hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/20"
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

      {/* ─── Latest Resources ─── */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-block h-6 w-1 rounded-full bg-accent" />
                <h2 className="font-serif text-2xl font-black text-foreground sm:text-3xl">{tr("latestResources")}</h2>
              </div>
              <p className="text-sm text-muted">{tr("justAdded")}</p>
            </div>
            <Link
              href="/books"
              className="shine-on-hover shrink-0 rounded-full border border-border px-5 py-2 text-sm font-bold text-foreground transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/20"
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

      {/* ─── Trending ─── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-block h-6 w-1 rounded-full bg-orange-500" />
            <h2 className="font-serif text-2xl font-black text-foreground sm:text-3xl">{tr("trendingResources")}</h2>
          </div>
          <p className="text-sm text-muted">{tr("downloadsLabel")}</p>
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

      {/* ─── Why BoardNotes Section ─── */}
      <section className="bg-gradient-to-b from-background via-accent/[0.03] to-background border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="inline-block h-6 w-1 rounded-full bg-accent" />
              <h2 className="font-serif text-2xl font-black text-foreground sm:text-3xl">Why BoardNotes?</h2>
              <span className="inline-block h-6 w-1 rounded-full bg-accent" />
            </div>
            <p className="mx-auto max-w-md text-sm text-muted">Everything you need to ace your exams — in one place</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🎯", title: "Board Aligned", desc: "Notes strictly aligned with your board's latest syllabus", bg: "bg-gradient-to-br from-teal-50 to-emerald-50", darkBg: "dark:from-teal-950/40 dark:to-emerald-950/40", iconBg: "bg-gradient-to-br from-teal-500 to-emerald-500", border: "border-teal-200/60 dark:border-teal-800/40", hoverBorder: "hover:border-teal-400" },
              { icon: "⚡", title: "Instant Access", desc: "Download PDFs instantly — no signup, no waiting", bg: "bg-gradient-to-br from-amber-50 to-orange-50", darkBg: "dark:from-amber-950/40 dark:to-orange-950/40", iconBg: "bg-gradient-to-br from-amber-500 to-orange-500", border: "border-amber-200/60 dark:border-amber-800/40", hoverBorder: "hover:border-amber-400" },
              { icon: "📱", title: "Study Anywhere", desc: "Works perfectly on mobile, tablet, and desktop", bg: "bg-gradient-to-br from-sky-50 to-blue-50", darkBg: "dark:from-sky-950/40 dark:to-blue-950/40", iconBg: "bg-gradient-to-br from-sky-500 to-blue-500", border: "border-sky-200/60 dark:border-sky-800/40", hoverBorder: "hover:border-sky-400" },
              { icon: "💯", title: "100% Free", desc: "All notes, papers, and solutions — completely free", bg: "bg-gradient-to-br from-purple-50 to-pink-50", darkBg: "dark:from-purple-950/40 dark:to-pink-950/40", iconBg: "bg-gradient-to-br from-purple-500 to-pink-500", border: "border-purple-200/60 dark:border-purple-800/40", hoverBorder: "hover:border-purple-400" },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`card-hover group relative overflow-hidden rounded-2xl border ${item.border} ${item.bg} ${item.darkBg} p-6 text-center transition-all duration-500 ${item.hoverBorder} animate-fade-in-up stagger-${i + 1}`}
              >
                <span className={`relative mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconBg} text-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                  {item.icon}
                </span>
                <h3 className="relative mb-1 text-base font-bold text-foreground transition-colors duration-200 group-hover:text-accent">{item.title}</h3>
                <p className="relative text-xs leading-relaxed text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad — before CTA */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AdBanner size="mobile-banner" className="mx-auto" />
      </div>

      {/* ─── SEO Content Block ─── */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
          <h2 className="mb-3 font-serif text-xl font-bold text-foreground sm:text-2xl">Complete Learning Support for Pakistani Students</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted">
            BoardNotes provides free, high-quality study resources for students across Pakistan and international boards. From Class 5 to 2nd Year, access textbooks, notes, solved exercises, past papers, pairing schemes, and guess papers — all organized by board, class, and subject.
          </p>
          <p className="mb-4 text-sm leading-relaxed text-muted">
            Our content covers Federal Board (FBISE), Punjab Board, Sindh Board, KPK Board, Balochistan Board, APSACS, as well as international curricula including Cambridge, Oxford, Pearson Edexcel, and IB. Every resource is curated by experienced educators and verified for accuracy.
          </p>
          <p className="text-sm leading-relaxed text-muted">
            Whether you are a student preparing for board exams, a teacher looking for structured lesson materials, or a parent supporting your child&apos;s education — BoardNotes has everything you need in one place. Download PDFs instantly, read online, and track your progress with our free platform.
          </p>
        </div>
      </section>

      {/* ─── Upload CTA ─── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="cta-gradient relative overflow-hidden rounded-3xl px-8 py-12 text-white transition-shadow duration-500 hover:shadow-2xl hover:shadow-accent/20 sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl animate-float" />
            <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl animate-float-slow" />
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }} />
          </div>
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-2xl font-black sm:text-3xl">{tr("uploadShare")}</h2>
              <p className="mt-2 max-w-md text-sm text-white/80">{tr("uploadDesc")}</p>
            </div>
            <Link
              href="/upload"
              className="shine-on-hover shrink-0 rounded-full bg-white px-8 py-4 text-sm font-black text-accent shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20"
            >
              {tr("uploadTitle")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export { PortalHome as HomeLanding };
