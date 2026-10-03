"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { HeroSearch } from "@/components/portal/hero-search";

export type HeroSlide = {
  id: string;
  title: string;
  subtitle?: string;
  href?: string;
  /** Absolute or app-relative image URL used behind the slide. */
  image?: string | null;
};

const AUTOPLAY_MS = 6000;

/**
 * Compact hero banner: crossfading background slides that rotate automatically,
 * with the search experience overlaid so it stays reachable on every slide.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = slides.length;
  const safeIndex = count > 0 ? index % count : 0;

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  // Auto-rotation (skipped for reduced-motion users and while hovered/paused).
  useEffect(() => {
    if (reduceMotion || paused || count <= 1) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused, count]);

  const active = useMemo(() => (count ? slides[safeIndex] : null), [count, safeIndex, slides]);

  return (
    <section
      aria-label="Featured"
      className="relative isolate bg-gradient-to-br from-[#312E81] via-[#4338CA] to-[#6D28D9] text-white dark:from-[#1E1B4B] dark:via-[#312E81] dark:to-[#0B0B14]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background slides ─────────────────────────────────────── */}
      {/* Clipped here (not on <section>) so the search suggestions can spill below the banner. */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            aria-hidden={i !== safeIndex}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: i === safeIndex ? 1 : 0 }}
          >
            {slide.image ? (
              <>
                {/* Portrait book covers are blurred so they read as ambience, not a stretched photo */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    filter: "blur(10px) saturate(140%)",
                    transform: i === safeIndex && !reduceMotion ? "scale(1.12)" : "scale(1.06)",
                    transition: "transform 8s ease-out, filter 1s ease",
                  }}
                />
                {/* Brand wash keeps the headline readable while the photo stays visible */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#312E81]/78 via-[#4338CA]/68 to-[#6D28D9]/62" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/80 via-[#1E1B4B]/25 to-transparent" />
              </>
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.16) 0%, transparent 55%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.12) 0%, transparent 50%)",
                }}
              />
            )}
          </div>
        ))}
        {/* Fine dot texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, white 1.2px, transparent 1.2px)", backgroundSize: "22px 22px" }}
        />
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-4xl px-4 py-10 text-center sm:px-6 sm:py-12 lg:px-8">
        <HeroSearch />
      </div>

      {/* ── Slide controls ────────────────────────────────────────── */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(safeIndex - 1)}
            aria-label="Previous slide"
            className="pressable absolute left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25 sm:inline-flex"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(safeIndex + 1)}
            aria-label="Next slide"
            className="pressable absolute right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25 sm:inline-flex"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === safeIndex}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === safeIndex ? "w-7 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Active slide caption */}
      {count > 1 && active?.href && (
        <Link
          href={active.href}
          className="absolute bottom-3 right-4 z-10 hidden max-w-[45%] truncate rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md transition hover:bg-white/20 md:block"
        >
          {active.title}
        </Link>
      )}
    </section>
  );
}
