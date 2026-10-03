"use client";

import Link from "next/link";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  Compass,
  FileText,
  GraduationCap,
  LayoutGrid,
  LogOut,
  Menu,
  MoreHorizontal,
  Search,
  Sparkles,
  Upload,
  User,
  X,
} from "lucide-react";

import { useLocale } from "@/lib/locale-context";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/lib/theme-context";
import { NAV_BOARDS, NAV_CLASSES, APSACS_CLASSES, boardShortName } from "@/lib/constants";
import { POPOVER_SPRING } from "@/components/motion/hover-card";

type DropdownItem = { label: string; href: string };
type DropdownGroup = { heading?: string; items: DropdownItem[] };
type DropdownDef = { label: string; groups: DropdownGroup[]; icon?: typeof BookOpen; soon?: boolean };

const BOARDS_ITEM: DropdownDef = {
  label: "Boards",
  icon: GraduationCap,
  groups: [
    { heading: "Pakistani Boards", items: [
      { label: "Federal Board", href: "/fbise" },
      { label: "Punjab Board", href: "/punjab" },
      { label: "KPK Board", href: "/kpk" },
      { label: "Sindh Board", href: "/sindh" },
      { label: "APSACS", href: "/apsacs" },
    ]},
    { heading: "International", items: [
      { label: "Oxford Board", href: "/oxford" },
      { label: "Cambridge Board", href: "/cambridge" },
      { label: "O Level", href: "/o-level" },
      { label: "A Level", href: "/a-level" },
    ]},
  ],
};

const OTHER_NAV_ITEMS: DropdownDef[] = [
  { label: "Pairing Schemes", icon: LayoutGrid, groups: [
    { items: [
      { label: "9th", href: "/categories/9th-class-pairing-schemes" },
      { label: "10th", href: "/categories/10th-class-pairing-schemes" },
      { label: "1st Year", href: "/categories/1st-year-pairing-schemes" },
      { label: "2nd Year", href: "/categories/2nd-year-pairing-schemes" },
    ]},
  ]},
  { label: "Past Papers", icon: FileText, groups: [
    { items: [
      { label: "All Past Papers", href: "/past-papers" },
    ]},
    { heading: "Pakistani Boards", items: [
      { label: "9th", href: "/categories/9th-class-model-papers" },
      { label: "10th", href: "/categories/10th-class-model-papers" },
      { label: "1st Year", href: "/categories/1st-year-model-papers" },
      { label: "2nd Year", href: "/categories/2nd-year-model-papers" },
    ]},
    { heading: "International", items: [
      { label: "Cambridge IGCSE", href: "/categories/cambridge-intl-notes" },
      { label: "O Level", href: "/o-level" },
      { label: "A Level", href: "/a-level" },
      { label: "Pearson Edexcel", href: "/categories/pearson-edexcel-notes" },
      { label: "OxfordAQA", href: "/categories/oxford-notes" },
      { label: "City & Guilds", href: "/categories/city-guilds-notes" },
      { label: "IB", href: "/categories/ib-notes" },
    ]},
  ]},
  { label: "Test Generator", icon: Sparkles, groups: [
    { items: [
      { label: "9th Class Tests", href: "/categories/9th-class-tests" },
      { label: "10th Class Tests", href: "/categories/10th-class-tests" },
      { label: "1st Year Tests", href: "/categories/1st-year-tests" },
      { label: "2nd Year Tests", href: "/categories/2nd-year-tests" },
      { label: "Generate a Test", href: "/test-generator" },
      { label: "MCQ Practice", href: "/online-quizzes" },
    ]},
  ]},
  { label: "Tuition", icon: User, groups: [
    { items: [
      { label: "Malik Shahid (Maths)", href: "/tuition" },
      { label: "Online Academy Classes", href: "/categories/online-academy-classes" },
      { label: "Find a Tutor", href: "/categories/find-tutor" },
      { label: "Tuition Request", href: "/categories/tuition-request" },
      { label: "Become a Tutor", href: "/categories/become-tutor" },
    ]},
  ]},
];

const KNOWN_BOARD_SLUGS = new Set<string>([
  ...NAV_BOARDS.map((b) => b.slug),
  "apsacs",
  "kpk",
  "sindh",
  "o-level",
  "a-level",
]);

/** Lower-priority menus that collapse into "More" on narrow desktops. */
const SECONDARY_LABELS = new Set(["Pairing Schemes", "Tuition"]);

function classHref(boardSlug: string, num: number): string {
  if (boardSlug === "apsacs") return `/apsacs/class-${num}`;
  return `/${boardSlug}/${num}`;
}

function buildBoardNav(boardSlug: string): DropdownDef {
  if (boardSlug === "apsacs") {
    return {
      label: boardShortName("apsacs"),
      icon: GraduationCap,
      groups: [
        { heading: "Classes", items: APSACS_CLASSES.map((n) => ({ label: `Class ${n}`, href: classHref("apsacs", n) })) },
        { items: [
          { label: "All APSACS", href: "/apsacs" },
          { label: "MCQ Practice", href: "/online-quizzes" },
          { label: "Test Generator", href: "/test-generator" },
        ]},
      ],
    };
  }
  if (boardSlug === "o-level" || boardSlug === "a-level") {
    const label = boardShortName(boardSlug);
    const years = boardSlug === "o-level"
      ? [{ label: "Year 10", href: "/o-level#year-10" }, { label: "Year 11", href: "/o-level#year-11" }]
      : [{ label: "Year 12 · AS", href: "/a-level#year-12" }, { label: "Year 13 · A Level", href: "/a-level#year-13" }];
    return {
      label,
      icon: Compass,
      groups: [
        { heading: "Years", items: years },
        { items: [
          { label: `All ${label}`, href: `/${boardSlug}` },
          { label: "MCQ Practice", href: "/online-quizzes" },
          { label: "Test Generator", href: "/test-generator" },
        ]},
      ],
    };
  }
  const label = boardShortName(boardSlug);
  return {
    label,
    icon: BookOpen,
    groups: [
      { heading: "Notes", items: NAV_CLASSES.map((n) => ({ label: `Class ${n}`, href: classHref(boardSlug, n) })) },
      { heading: "Books", items: NAV_CLASSES.map((n) => ({ label: `Class ${n}`, href: `${classHref(boardSlug, n)}?view=books` })) },
      { items: [
        { label: `All ${label}`, href: `/${boardSlug}` },
        { label: "MCQ Practice", href: "/online-quizzes" },
        { label: "Test Generator", href: "/test-generator" },
      ]},
    ],
  };
}

/* ── Desktop dropdown ─────────────────────────────────────────── */

/**
 * Panel is rendered in a portal on <body> and positioned with `fixed`
 * coordinates measured from its trigger. The glass navbar uses
 * `backdrop-filter`, which turns it into the containing block for BOTH
 * `absolute` and `fixed` descendants — an in-tree panel would be offset from
 * the wrong element and get clipped, so it escapes to the body instead.
 */
function NavDropdown({
  item,
  isOpen,
  onOpen,
  onClose,
  onFocused,
}: {
  item: DropdownDef;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onFocused: () => void;
}) {
  const slug = item.label.toLowerCase().replace(/[^a-z]/g, "-");
  const reduceMotion = useReducedMotion();
  const Icon = item.icon;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const measure = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const panelWidth = Math.min(320, window.innerWidth - 32);
    setPos({
      top: Math.min(r.bottom + 8, window.innerHeight - 80),
      left: Math.max(16, Math.min(r.left, window.innerWidth - panelWidth - 16)),
    });
  }, []);

  // Keep the panel glued to its trigger while scrolling or resizing.
  useEffect(() => {
    if (!isOpen) return;
    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [isOpen, measure]);

  if (item.soon) {
    return (
      <Link href={`/${slug}`} className="pressable flex items-center gap-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold transition hover:text-accent">
        {item.label}
        <span className="rounded bg-amber-300/90 px-1 py-px text-[7px] font-bold uppercase leading-none text-amber-950">Soon</span>
      </Link>
    );
  }

  const handleEnter = () => {
    measure();
    onOpen();
  };

  return (
    <div className="relative shrink-0" onMouseEnter={handleEnter} onMouseLeave={onClose}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`pressable focus-ring flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-2 text-[13px] font-semibold transition lg:text-sm ${
          isOpen ? "bg-accent/10 text-accent" : "text-foreground/80 hover:bg-accent/5 hover:text-accent"
        }`}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
        {item.label}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="inline-flex">
          <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </motion.span>
      </button>

      {isOpen &&
        pos &&
        typeof document !== "undefined" &&
        createPortal(
          // AnimatePresence lives *inside* the portal so its direct child is the
          // motion element — otherwise the enter animation never runs and the
          // panel stays stuck at opacity 0.
          <AnimatePresence>
            <motion.div
              /* Opacity is intentionally absent from `initial`: the panel must be
                 visible even if the spring never runs. */
              initial={reduceMotion ? false : { y: -6, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6, scale: 0.97 }}
              transition={POPOVER_SPRING}
              style={{ top: pos.top, left: pos.left }}
              className={`fixed z-[70] max-h-[70vh] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-card p-2 shadow-lift ${
                item.groups.length > 1 ? "w-80" : "w-64"
              }`}
              onMouseEnter={onFocused}
              onMouseLeave={onClose}
            >
              {item.groups.map((g, gi) => (
                <div key={gi}>
                  {g.heading && (
                    <div className="mb-1 mt-2 px-3 text-[11px] font-bold uppercase tracking-wider text-accent">{g.heading}</div>
                  )}
                  {g.items.map((itm) => (
                    <Link
                      key={itm.href}
                      href={itm.href}
                      onClick={onClose}
                      className="block whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-accent/10 hover:text-accent"
                    >
                      {itm.label}
                    </Link>
                  ))}
                  {gi < item.groups.length - 1 && <div className="my-2 border-t border-border/60" />}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

/* ── Header ───────────────────────────────────────────────────── */

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownSlug, setDropdownSlug] = useState<string | null>(null);
  const { user, loading, isStaff, signOut } = useAuth();
  const { tr, locale } = useLocale();
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();

  const activeBoard = useMemo(() => {
    const first = (pathname ?? "/").split("/").filter(Boolean)[0];
    return first && KNOWN_BOARD_SLUGS.has(first) ? first : null;
  }, [pathname]);

  const navItems = useMemo<DropdownDef[]>(
    () => [BOARDS_ITEM, ...(activeBoard ? [buildBoardNav(activeBoard)] : []), ...OTHER_NAV_ITEMS],
    [activeBoard],
  );

  // Lower-priority menus collapse into a single "More" dropdown on narrow desktops
  // so the bar never overflows (and never pushes the page sideways).
  const primaryItems = useMemo(
    () => navItems.filter((i) => !SECONDARY_LABELS.has(i.label)),
    [navItems],
  );
  const secondaryItems = useMemo(
    () => navItems.filter((i) => SECONDARY_LABELS.has(i.label)),
    [navItems],
  );
  const moreItem: DropdownDef = useMemo(
    () => ({
      label: "More",
      icon: MoreHorizontal,
      groups: secondaryItems.map((i) => ({ heading: i.label, items: i.groups.flatMap((g) => g.items) })),
    }),
    [secondaryItems],
  );

  const clearClose = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  const scheduleClose = useCallback((ms = 200) => {
    clearClose();
    closeTimer.current = setTimeout(() => setDropdownSlug(null), ms);
  }, [clearClose]);

  return (
    <>
      <header className="sticky top-0 z-40 print:hidden">
        <div className="glass-bar border-b border-border/70 shadow-soft">
          <nav
            className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8"
            aria-label="Main navigation"
          >
            {/* Logo */}
            <Link href="/" className="group flex shrink-0 items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-sm font-black text-white shadow-md shadow-accent/30 transition-transform duration-300 group-hover:scale-105">
                B
              </span>
              <span className="hidden font-serif text-lg font-black tracking-tight lg:block">
                <span className="text-gradient">BoardNotes</span>
              </span>
            </Link>

            {/* Desktop nav — scrolls internally instead of widening the page */}
            <div className="scrollbar-none hidden min-w-0 flex-1 items-center gap-0.5 overflow-x-auto lg:flex">
              {primaryItems.map((item) => (
                <NavDropdown
                  key={item.label}
                  item={item}
                  isOpen={dropdownSlug === item.label.toLowerCase().replace(/[^a-z]/g, "-")}
                  onOpen={() => { clearClose(); setDropdownSlug(item.label.toLowerCase().replace(/[^a-z]/g, "-")); }}
                  onClose={() => scheduleClose()}
                  onFocused={clearClose}
                />
              ))}
              {/* Secondary menus: inline on wide screens, collapsed below xl */}
              <div className="hidden items-center gap-0.5 xl:flex">
                {secondaryItems.map((item) => (
                  <NavDropdown
                    key={item.label}
                    item={item}
                    isOpen={dropdownSlug === item.label.toLowerCase().replace(/[^a-z]/g, "-")}
                    onOpen={() => { clearClose(); setDropdownSlug(item.label.toLowerCase().replace(/[^a-z]/g, "-")); }}
                    onClose={() => scheduleClose()}
                    onFocused={clearClose}
                  />
                ))}
              </div>
              {secondaryItems.length > 0 && (
                <div className="xl:hidden">
                  <NavDropdown
                    item={moreItem}
                    isOpen={dropdownSlug === "more"}
                    onOpen={() => { clearClose(); setDropdownSlug("more"); }}
                    onClose={() => scheduleClose()}
                    onFocused={clearClose}
                  />
                </div>
              )}
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
              {/* Search */}
              <Link
                href="/search"
                aria-label={tr("search")}
                className="pressable focus-ring hidden h-9 w-9 items-center justify-center rounded-xl border border-border bg-card/60 text-foreground/80 backdrop-blur-md transition hover:border-accent/50 hover:bg-accent/10 hover:text-accent sm:inline-flex"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </Link>

              <ThemeToggle />

              {/* Upload CTA — label only when there is room */}
              <Link
                href="/upload"
                className="pressable focus-ring inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-accent to-accent-2 px-3 py-2 text-sm font-bold text-white shadow-md shadow-accent/25 transition hover:shadow-lg hover:shadow-accent/40 sm:px-4"
              >
                <Upload className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="hidden xl:inline">{tr("uploadTitle")}</span>
              </Link>

              {/* Auth */}
              {!loading && user ? (
                <div className="hidden items-center gap-1.5 lg:flex">
                  {isStaff && (
                    <Link href="/admin" className="pressable whitespace-nowrap rounded-xl px-2.5 py-2 text-[13px] font-semibold text-foreground/80 transition hover:bg-accent/10 hover:text-accent">
                      {tr("admin")}
                    </Link>
                  )}
                  <Link
                    href="/account"
                    className="pressable inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card/60 text-foreground/80 backdrop-blur-md transition hover:border-accent/50 hover:text-accent"
                    aria-label={user.name}
                  >
                    <span className="text-xs font-black">{user.name.slice(0, 1).toUpperCase()}</span>
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="pressable focus-ring hidden whitespace-nowrap rounded-xl bg-foreground px-3.5 py-2 text-[13px] font-bold text-background transition hover:opacity-90 lg:inline-flex"
                >
                  {tr("signUp")}
                </Link>
              )}

              {/* Mobile trigger */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label={tr("openMenu")}
                className="pressable focus-ring inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card/60 text-foreground backdrop-blur-md transition hover:border-accent/50 hover:text-accent lg:hidden"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={reduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduceMotion ? undefined : { x: "100%" }}
              transition={POPOVER_SPRING}
              className="glass-bar fixed right-0 top-0 z-50 flex h-full w-[86%] max-w-sm flex-col border-l border-border shadow-lift lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
                <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2.5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-sm font-black text-white shadow-md shadow-accent/30">
                    B
                  </span>
                  <span className="font-serif text-lg font-black">
                    <span className="text-gradient">BoardNotes</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label={tr("closeMenu")}
                  className="pressable focus-ring inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-foreground transition hover:border-accent/50 hover:text-accent"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                <form action="/search" role="search" className="glass-field mb-5 flex items-center gap-2 rounded-xl px-3 py-2.5">
                  <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  <input
                    name="q"
                    autoComplete="off"
                    placeholder={locale === "ur" ? "تلاش…" : "Search notes, books, papers…"}
                    aria-label={tr("search")}
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
                  />
                </form>

                <nav className="space-y-5" aria-label="Mobile navigation">
                  {navItems.map((item) => {
                    const Icon = item.icon ?? LayoutGrid;
                    return (
                      <div key={item.label}>
                        <p className="mb-2 flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                          {item.label}
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {item.groups.flatMap((g) => g.items).map((itm) => (
                            <Link
                              key={itm.href}
                              href={itm.href}
                              onClick={() => setDrawerOpen(false)}
                              className="rounded-xl border border-border/70 bg-card/50 px-3 py-2.5 text-sm font-medium text-foreground transition hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
                            >
                              {itm.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-border/70 px-4 py-4">
                {!loading && user ? (
                  <div className="space-y-2">
                    <Link
                      href="/account"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-3 text-sm font-semibold text-foreground"
                    >
                      <User className="h-4 w-4" aria-hidden="true" />
                      {user.name}
                    </Link>
                    {isStaff && (
                      <Link
                        href="/admin"
                        onClick={() => setDrawerOpen(false)}
                        className="block rounded-xl bg-accent/10 px-4 py-3 text-center text-sm font-bold text-accent"
                      >
                        {tr("admin")}
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => { signOut(); setDrawerOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-muted"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      {tr("signOut")}
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="pressable block rounded-xl bg-gradient-to-r from-accent to-accent-2 px-4 py-3 text-center text-sm font-bold text-white shadow-md shadow-accent/25"
                  >
                    {tr("signUp")}
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
