"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useLocale } from "@/lib/locale-context";
import { getApiBaseUrl } from "@/lib/api-client";
import { BadgePercent, Smartphone, Target, Zap } from "lucide-react";
import { CategoryCard } from "@/components/portal/category-card";
import { HoverCard } from "@/components/motion/hover-card";
import { Reveal } from "@/components/motion/reveal";
import { HeroSlider, type HeroSlide } from "@/components/portal/hero-slider";
import { ResourceCard } from "@/components/portal/resource-card";
import { AdBanner } from "@/components/portal/ad-banner";
import { BoardCoverSections, type HomeBoardSection } from "@/components/portal/board-cover-sections";
import { type PortalCategory, type PortalResource } from "@/components/portal/portal-types";

type Props = {
  categories: PortalCategory[];
  latest: PortalResource[] | null;
  trending: PortalResource[] | null;
  categoryNameById: Record<string, string>;
  boardSections: HomeBoardSection[];
};

export function PortalHome({ categories, latest, trending, categoryNameById, boardSections }: Props) {
  const { tr } = useLocale();

  // Hero slides: real book covers where available, branded gradients otherwise.
  const slides = useMemo<HeroSlide[]>(() => {
    // Cover URLs come from the API and are often root-relative (served by the
    // backend), so they must be resolved before use in a CSS background.
    const absolute = (url: string | null) => {
      if (!url) return null;
      if (url.startsWith("http")) return url;
      return `${getApiBaseUrl()}${url.startsWith("/") ? url : `/${url}`}`;
    };

    const fromCovers = (latest ?? [])
      .filter((r) => r.coverUrl)
      .slice(0, 4)
      .map((r) => ({
        id: `res-${r.id}`,
        title: r.title,
        href: `/books/${r.slug}`,
        image: absolute(r.coverUrl),
      }));

    const fallbacks: HeroSlide[] = boardSections.slice(0, 3).map((b) => ({
      id: `board-${b.slug}`,
      title: `${b.title} — classes ${b.classNumbers.slice(0, 4).join(", ")}`,
      href: `/${b.slug}`,
      image: null,
    }));

    return [...fromCovers, ...fallbacks].slice(0, 4);
  }, [latest, boardSections]);

  return (
    <div>
      {/* ─── Hero — compact auto-rotating banner ─── */}
      <HeroSlider slides={slides} />

      {/* ─── Board cover sections (Study++ style) ─── */}
      <BoardCoverSections sections={boardSections} />

      {/* ─── Categories ─── */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-block h-6 w-1 rounded-full bg-gradient-to-b from-accent to-accent-2" aria-hidden="true" />
                <h2 className="font-serif text-2xl font-black text-foreground sm:text-3xl">{tr("browseCategories")}</h2>
              </div>
              <p className="text-sm text-muted">{tr("browseCategoriesDesc")}</p>
            </div>
            <Link
              href="/categories"
              className="pressable shrink-0 rounded-xl border border-accent/40 bg-accent/10 px-5 py-2 text-sm font-bold text-accent transition-all duration-300 hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/20"
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
      </Reveal>

      {/* ─── Latest Resources ─── */}
      <Reveal>
        <section className="border-y border-border bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-block h-6 w-1 rounded-full bg-gradient-to-b from-accent to-accent-2" aria-hidden="true" />
                  <h2 className="font-serif text-2xl font-black text-foreground sm:text-3xl">{tr("latestResources")}</h2>
                </div>
                <p className="text-sm text-muted">{tr("justAdded")}</p>
              </div>
              <Link
                href="/books"
                className="pressable shrink-0 rounded-xl border border-border px-5 py-2 text-sm font-bold text-foreground transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/20"
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
      </Reveal>

      {/* ─── Trending ─── */}
      <Reveal>
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
      </Reveal>

      {/* ─── Why BoardNotes Section ─── */}
      <Reveal>
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
              { icon: Target, title: "Board Aligned", desc: "Notes strictly aligned with your board's latest syllabus", tint: "from-accent/12 to-accent-2/12", ring: "border-accent/30" },
              { icon: Zap, title: "Instant Access", desc: "Download PDFs instantly — no signup, no waiting", tint: "from-amber-500/12 to-orange-500/12", ring: "border-amber-500/30" },
              { icon: Smartphone, title: "Study Anywhere", desc: "Works perfectly on mobile, tablet, and desktop", tint: "from-sky-500/12 to-blue-500/12", ring: "border-sky-500/30" },
              { icon: BadgePercent, title: "100% Free", desc: "All notes, papers, and solutions — completely free", tint: "from-fuchsia-500/12 to-pink-500/12", ring: "border-fuchsia-500/30" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <HoverCard key={item.title} lift={8}>
                  <div className={`glass-card h-full rounded-2xl border ${item.ring} bg-gradient-to-br ${item.tint} p-6 text-center`}>
                    <span className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-lg shadow-accent/25 transition-transform duration-300">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mb-1 text-base font-bold text-foreground">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-muted">{item.desc}</p>
                  </div>
                </HoverCard>
              );
            })}
          </div>
        </div>
      </section>
      </Reveal>

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

      {/* ─── Ads — below all primary educational content ─── */}
      <div className="mx-auto max-w-6xl space-y-4 px-4 pb-6 sm:px-6 lg:px-8">
        <AdBanner size="inline" />
        <AdBanner size="banner" className="mx-auto" />
      </div>

      {/* ─── Upload CTA ─── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="cta-gradient relative overflow-hidden rounded-3xl px-8 py-12 text-white transition-shadow duration-500 hover:shadow-2xl hover:shadow-accent/20 sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl animate-float" />
            <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-fuchsia-300/10 blur-3xl animate-float-slow" />
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
