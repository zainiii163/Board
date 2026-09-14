"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

function TrustBar() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const items = [
    { icon: "📚", label: "679+", desc: "Resources" },
    { icon: "🏫", label: "11", desc: "Categories" },
    { icon: "📥", label: "Free", desc: "Downloads" },
    { icon: "🔒", label: "Safe", desc: "& Secure" },
  ];

  return (
    <div ref={ref} className="border-b border-border bg-card/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-6 px-4 py-3 sm:gap-10 sm:px-6 sm:py-4 lg:px-8">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={`flex items-center gap-2 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <span className="text-lg sm:text-xl">{item.icon}</span>
            <div>
              <p className="text-xs font-black text-foreground sm:text-sm">{item.label}</p>
              <p className="text-[10px] font-semibold text-muted sm:text-xs">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PortalHome({ categories, latest, trending, categoryNameById }: Props) {
  const { tr } = useLocale();

  return (
    <div>
      {/* ─── Hero Banner ─── */}
      <section className="hero-gradient relative overflow-hidden text-white">
        {/* Floating decorative shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl animate-float" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-emerald-300/15 blur-3xl animate-float-slow" />
          <div className="absolute right-10 top-10 h-40 w-40 rounded-full border border-white/10 animate-spin-slow" />
          <div className="absolute bottom-8 left-[15%] h-24 w-24 rounded-full border border-white/8" />
          {/* Grid dots pattern */}
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <div className="animate-fade-in-up mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              Trusted by 10,000+ Students
            </div>
            <h1 className="animate-fade-in-up stagger-1 font-serif text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
              {tr("portalHeroTitle")}
            </h1>
            <p className="animate-fade-in-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.1)" }}>
              {tr("portalHeroDesc")}
            </p>
            <div className="animate-fade-in-up stagger-3 mt-6 flex flex-wrap gap-3">
              <Link
                href="/categories"
                className="shine-on-hover inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ color: "#0D9488" }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                {tr("browseCategories")}
              </Link>
              <Link
                href="/books"
                className="shine-on-hover inline-flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/70 hover:bg-white/20"
              >
                {tr("books")} →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0 60L48 52C96 44 192 28 288 22C384 16 480 20 576 28C672 36 768 48 864 50C960 52 1056 44 1152 36C1248 28 1344 20 1392 16L1440 12V60H0Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* Trust bar */}
      <TrustBar />

      {/* Ad — below hero */}
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <AdBanner size="leaderboard" className="mx-auto" />
      </div>

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
