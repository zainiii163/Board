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

/**
 * Compact hero content: eyebrow, headline, instant search with live autocomplete
 * and quick-filter chips. Rendered inside <HeroSlider>.
 */
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

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      inputRef.current?.blur();
      router.push(href);
    },
    [router],
  );

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
    <div className="mx-auto max-w-3xl">
      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-bold backdrop-blur-md"
      >
        {ACADEMIC_YEAR} · free resources for every board
      </motion.p>

      <motion.h1
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="text-balance font-serif text-2xl font-black leading-[1.15] drop-shadow-[0_2px_14px_rgba(15,23,42,0.25)] sm:text-3xl lg:text-4xl"
      >
        {tr("portalHeroTitle")}
      </motion.h1>

      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-2 hidden max-w-2xl text-sm leading-relaxed text-white/85 sm:block"
      >
        {tr("portalHeroDesc")}
      </motion.p>

      {/* Instant search */}
      <motion.div
        ref={boxRef}
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto mt-5 max-w-2xl"
      >
        <div className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3">
          <Search className="h-4.5 w-4.5 shrink-0 text-accent" aria-hidden="true" />
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
            className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/60"
          />
          {loading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-white/70" aria-hidden="true" />
          ) : (
            <kbd className="hidden shrink-0 rounded-md border border-white/25 bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/70 sm:block">
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
              className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-border bg-card p-1.5 text-left shadow-lift"
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
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                        i === activeIndex ? "bg-accent/10" : "hover:bg-accent/5"
                      }`}
                    >
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
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
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 flex flex-wrap items-center justify-center gap-2"
      >
        {QUICK_FILTERS.map((chip) => {
          const Icon = chip.icon;
          return (
            <Link
              key={chip.href + chip.label}
              href={chip.href}
              className="pressable inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20"
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {chip.label}
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
