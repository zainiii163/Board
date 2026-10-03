"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  FileText,
  GraduationCap,
  Library,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";

import { useLocale } from "@/lib/locale-context";
import { ACADEMIC_YEAR, NAV_BOARDS } from "@/lib/constants";
import { POPOVER_SPRING } from "@/components/motion/hover-card";

type Kind = "board" | "class" | "chapter" | "paper" | "resource";

type Suggestion = {
  key: string;
  label: string;
  meta: string;
  href: string;
  kind: Kind;
};

type SearchResponse = {
  results?: {
    title: string;
    board: string;
    className: string;
    subject: string;
    path: string;
    type: string;
  }[];
  resources?: { slug: string; title: string; subject: string; board: string | null }[];
};

const EXTRA_BOARD_SLUGS = ["apsacs", "kpk", "sindh", "o-level", "a-level"];

const BOARD_INDEX = [...new Set([...NAV_BOARDS.map((b) => b.slug), ...EXTRA_BOARD_SLUGS])].map((slug) => ({
  slug,
  title: NAV_BOARDS.find((b) => b.slug === slug)?.label ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));

const QUICK_FILTERS = [
  { label: "9th Class", href: "/fbise/9", icon: GraduationCap },
  { label: "10th Class", href: "/fbise/10", icon: GraduationCap },
  { label: "1st Year", href: "/fbise/11", icon: GraduationCap },
  { label: "Past Papers", href: "/past-papers", icon: FileText },
];

const KIND_ICON: Record<Kind, typeof BookOpen> = {
  board: GraduationCap,
  class: Library,
  chapter: BookOpen,
  paper: FileText,
  resource: Library,
};

function localSuggestions(query: string): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: Suggestion[] = [];

  for (const board of BOARD_INDEX) {
    const slug = board.slug.toLowerCase();
    const title = board.title.toLowerCase();
    if (slug.includes(q) || title.includes(q)) {
      out.push({ key: `board-${board.slug}`, label: board.title, meta: "Board", href: `/${board.slug}`, kind: "board" });
    }
  }

  const digits = query.match(/\d+/);
  if (digits) {
    const num = parseInt(digits[0], 10);
    if (num >= 1 && num <= 12) {
      for (const board of BOARD_INDEX.slice(0, 6)) {
        out.push({
          key: `class-${board.slug}-${num}`,
          label: `Class ${num}`,
          meta: board.title,
          href: board.slug === "apsacs" ? `/apsacs/class-${num}` : `/${board.slug}/${num}`,
          kind: "class",
        });
      }
    }
  }

  return out.slice(0, 6);
}

export function HeroSearch() {
  const { tr } = useLocale();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [remote, setRemote] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const local = useMemo(() => localSuggestions(query), [query]);
  const suggestions = useMemo(() => {
    const seen = new Set<string>();
    const remoteVisible = query.trim().length >= 2 ? remote : [];
    return [...local, ...remoteVisible]
      .filter((s) => {
        if (seen.has(s.key)) return false;
        seen.add(s.key);
        return true;
      })
      .slice(0, 8);
  }, [local, remote, query]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = (await res.json()) as SearchResponse;
        const items: Suggestion[] = [];
        for (const r of data.results ?? []) {
          items.push({
            key: `${r.type}-${r.path}`,
            label: r.title,
            meta: [r.board, r.className, r.subject].filter(Boolean).join(" • "),
            href: r.path,
            kind: r.type === "paper" ? "paper" : "chapter",
          });
        }
        for (const r of data.resources ?? []) {
          items.push({
            key: `res-${r.slug}`,
            label: r.title,
            meta: [r.board, r.subject].filter(Boolean).join(" • ") || "Resource",
            href: `/books/${r.slug}`,
            kind: "resource",
          });
        }
        setRemote(items.slice(0, 6));
      } catch {
        /* aborted or offline — keep local suggestions */
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const go = useCallback((href: string) => {
    setOpen(false);
    inputRef.current?.blur();
    router.push(href);
  }, [router]);

  const submit = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    const target = activeIndex >= 0 ? suggestions[activeIndex] : undefined;
    if (target) go(target.href);
    else go(`/search?q=${encodeURIComponent(q)}`);
  }, [activeIndex, go, query, suggestions]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (suggestions.length ? (i + 1) % suggestions.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (suggestions.length ? (i - 1 + suggestions.length) % suggestions.length : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#4338CA] via-[#4F46E5] to-[#7C3AED] text-white dark:from-[#1E1B4B] dark:via-[#312E81] dark:to-[#0B0B14]">
      {/* Ambient orbs + grid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full bg-white/15 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/20 blur-3xl animate-float-slow" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, white 1.2px, transparent 1.2px)", backgroundSize: "22px 22px" }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-[11px] font-bold backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {ACADEMIC_YEAR} — free resources for every board
        </motion.div>

        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance font-serif text-3xl font-black leading-[1.1] drop-shadow-[0_2px_18px_rgba(15,23,42,0.25)] sm:text-4xl lg:text-5xl"
        >
          {tr("portalHeroTitle")}
        </motion.h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base"
        >
          {tr("portalHeroDesc")}
        </motion.p>

        {/* Instant search */}
        <motion.div
          ref={boxRef}
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-8 max-w-2xl"
        >
          <div className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4">
            <Search className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIndex(-1); }}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              type="search"
              role="combobox"
              aria-expanded={open && suggestions.length > 0}
              aria-controls="hero-suggestions"
              aria-autocomplete="list"
              placeholder={tr("portalSearchPlaceholder")}
              className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/60 sm:text-lg"
            />
            {loading ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-white/70" aria-hidden="true" />
            ) : (
              <kbd className="hidden shrink-0 rounded-md border border-white/25 bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70 sm:block">
                /
              </kbd>
            )}
          </div>

          <AnimatePresence>
            {open && suggestions.length > 0 && (
              <motion.ul
                id="hero-suggestions"
                role="listbox"
                initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
                transition={POPOVER_SPRING}
                className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-border bg-card p-1.5 text-left shadow-lift"
              >
                {suggestions.map((s, i) => {
                  const Icon = KIND_ICON[s.kind];
                  return (
                    <li key={s.key}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={i === activeIndex}
                        onMouseEnter={() => setActiveIndex(i)}
                        onClick={() => go(s.href)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                          i === activeIndex ? "bg-accent/10" : "hover:bg-accent/5"
                        }`}
                      >
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-foreground">{s.label}</span>
                          <span className="block truncate text-xs text-muted">{s.meta}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
                <li className="border-t border-border/70 px-3 py-2">
                  <button
                    type="button"
                    onClick={submit}
                    className="flex w-full items-center justify-between text-xs font-semibold text-accent"
                  >
                    <span>See all results for “{query.trim()}”</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick filters */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          {QUICK_FILTERS.map((chip) => {
            const Icon = chip.icon;
            return (
              <Link
                key={chip.href + chip.label}
                href={chip.href}
                className="pressable inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {chip.label}
              </Link>
            );
          })}
        </motion.div>

        {/* Glass stat strip */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3"
        >
          {[
            { value: "8+", label: "Boards" },
            { value: "500+", label: "Chapters" },
            { value: "100%", label: "Free" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl px-3 py-3.5 text-center">
              <p className="font-serif text-xl font-black text-white sm:text-2xl">{stat.value}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70 sm:text-[11px]">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
