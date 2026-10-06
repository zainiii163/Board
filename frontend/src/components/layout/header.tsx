"use client";

import Link from "next/link";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  FileText,
  GraduationCap,
  Layers,
  LayoutGrid,
  LogOut,
  Menu,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { useLocale } from "@/lib/locale-context";
import { useAuth } from "@/lib/auth-context";
import { NAV_BOARDS, NAV_CLASSES, APSACS_CLASSES, boardLabel, classLabel } from "@/lib/constants";
import { POPOVER_SPRING } from "@/components/motion/hover-card";

type DropdownItem = { label: string; href: string };
type DropdownGroup = { heading?: string; items: DropdownItem[] };
type DropdownDef = {
  /**
   * Stable identity for the menu. Open/close state and React keys use this instead
   * of the label, so a menu keeps its state (and never collides with a sibling)
   * when its visible title changes — e.g. "Federal Board" turning into "NBF".
   */
  id: string;
  label: string;
  groups: DropdownGroup[];
  icon?: typeof BookOpen;
  soon?: boolean;
};

const BOARDS_ITEM: DropdownDef = {
  id: "boards",
  label: "Boards",
  icon: GraduationCap,
  groups: [
    { heading: "Pakistani Boards", items: [
      { label: "Federal Board", href: "/fbise" },
      { label: "Punjab Board", href: "/punjab" },
      { label: "Lahore Board", href: "/lahore" },
      { label: "D.G. Khan Board", href: "/d-g-khan" },
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

/**
 * Static, always-visible menus. The board-aware "Books & Notes" menu is built
 * separately (see `buildBooksAndNotesNav`) so its id stays constant while its
 * contents follow the active board.
 */
const OTHER_NAV_ITEMS: DropdownDef[] = [
  { id: "pairing-schemes", label: "Pairing Schemes", icon: LayoutGrid, groups: [
    { items: [
      { label: "9th", href: "/categories/9th-class-pairing-schemes" },
      { label: "10th", href: "/categories/10th-class-pairing-schemes" },
      { label: "1st Year", href: "/categories/1st-year-pairing-schemes" },
      { label: "2nd Year", href: "/categories/2nd-year-pairing-schemes" },
    ]},
  ]},
  { id: "past-papers", label: "Past Papers", icon: FileText, groups: [
    { items: [
      { label: "All Past Papers", href: "/past-papers" },
    ]},
    { heading: "Pakistani Boards", items: [
      { label: "Federal Board", href: "/past-papers?board=fbise" },
      { label: "Punjab Board", href: "/past-papers?board=punjab" },
      { label: "KPK Board", href: "/past-papers?board=kpk" },
      { label: "Sindh Board", href: "/past-papers?board=sindh" },
      { label: "APSACS", href: "/past-papers?board=apsacs" },
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
  { id: "test-generator", label: "Test Generator", icon: Sparkles, groups: [
    { items: [
      { label: "9th Class Tests", href: "/categories/9th-class-tests" },
      { label: "10th Class Tests", href: "/categories/10th-class-tests" },
      { label: "1st Year Tests", href: "/categories/1st-year-tests" },
      { label: "2nd Year Tests", href: "/categories/2nd-year-tests" },
      { label: "Generate a Test", href: "/test-generator" },
      { label: "MCQ Practice", href: "/online-quizzes" },
    ]},
  ]},
  { id: "tuition", label: "Tuition", icon: User, groups: [
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
  "kpk",
  "sindh",
  "o-level",
  "a-level",
]);

function classHref(boardSlug: string, num: number): string {
  if (boardSlug === "apsacs") return `/apsacs/class-${num}`;
  return `/${boardSlug}/${num}`;
}

/**
 * The single board-aware menu. Its `id` and label never change — only the group
 * contents follow the active board — so the open/close state cannot leak from one
 * board to the next, and the navbar always shows exactly one "Books & Notes"
 * entry instead of a board menu plus separate Notes/Books menus.
 */
const BOOKS_AND_NOTES_ID = "books-and-notes";

function buildBooksAndNotesNav(activeBoard: string | null): DropdownDef {
  const base = { id: BOOKS_AND_NOTES_ID, label: "Books & Notes", icon: Layers };

  // Neutral pages list every board so the menu is never empty or board-specific.
  if (!activeBoard) {
    return {
      ...base,
      groups: [
        { heading: "Notes — Chapter-wise", items: NAV_BOARDS.map((b) => ({ label: b.label, href: `/${b.slug}` })) },
        { heading: "Books — Official Textbooks", items: NAV_BOARDS.map((b) => ({ label: b.label, href: `/${b.slug}?view=books` })) },
      ],
    };
  }

  if (activeBoard === "apsacs") {
    return {
      ...base,
      groups: [
        { heading: "APSACS — Notes", items: APSACS_CLASSES.map((n) => ({ label: `Class ${n}`, href: classHref("apsacs", n) })) },
        { heading: "APSACS — Books", items: APSACS_CLASSES.map((n) => ({ label: `Class ${n}`, href: `${classHref("apsacs", n)}?view=books` })) },
        { items: [{ label: "All APSACS", href: "/apsacs" }] },
      ],
    };
  }

  if (activeBoard === "o-level" || activeBoard === "a-level") {
    const years = activeBoard === "o-level"
      ? [{ label: "Year 10", href: "/o-level#year-10" }, { label: "Year 11", href: "/o-level#year-11" }]
      : [{ label: "Year 12 · AS", href: "/a-level#year-12" }, { label: "Year 13 · A Level", href: "/a-level#year-13" }];
    return {
      ...base,
      groups: [
        { heading: "Years", items: years },
        { items: [{ label: `All ${boardLabel(activeBoard)}`, href: `/${activeBoard}` }] },
      ],
    };
  }

  const label = boardLabel(activeBoard);
  return {
    ...base,
    groups: [
      { heading: `${label} — Notes`, items: NAV_CLASSES.map((n) => ({ label: classLabel(n), href: classHref(activeBoard, n) })) },
      { heading: `${label} — Books`, items: NAV_CLASSES.map((n) => ({ label: classLabel(n), href: `${classHref(activeBoard, n)}?view=books` })) },
      { items: [
        { label: `All ${label}`, href: `/${activeBoard}` },
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
 *
 * Because it escapes to <body>, the panel is a sibling of the sticky header, so
 * its z-index has to sit ABOVE the header's (see PANEL_Z below) — otherwise it
 * paints underneath the bar and reads as a clipped/bleeding panel.
 */
const PANEL_Z = "z-[200]";

function NavDropdown({
  item,
  isOpen,
  onOpen,
  onClose,
  onFocused,
  activeHref,
}: {
  item: DropdownDef;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onFocused: () => void;
  activeHref?: string;
}) {
  const slug = item.id;
  const reduceMotion = useReducedMotion();
  const Icon = item.icon;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // The panel records which menu it was measured for. A menu can swap its
  // contents while closed (Books & Notes follows the active board), so a
  // measurement for a different `slug` is simply discarded — no effect, no
  // stale coordinates at the old trigger's position.
  const [placement, setPlacement] = useState<{ slug: string; top: number; left: number } | null>(null);

  const measure = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const panelWidth = Math.min(320, window.innerWidth - 32);
    // Hang the panel below the whole navbar, not just the trigger, so it can
    // never overlap the bar it belongs to.
    const headerEl = el.closest("header");
    const anchorBottom = headerEl ? Math.max(headerEl.getBoundingClientRect().bottom, r.bottom) : r.bottom;
    setPlacement({
      slug: item.id,
      top: Math.min(anchorBottom + 8, window.innerHeight - 80),
      left: Math.max(16, Math.min(r.left, window.innerWidth - panelWidth - 16)),
    });
  }, [item.id]);

  const pos = placement?.slug === slug ? placement : null;

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

  // Dismiss on Escape or an outside click/tap — hover alone never closes a panel
  // that was opened by click on touch devices.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [isOpen, onClose]);

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
        onClick={() => (isOpen ? onClose() : handleEnter())}
        className={`pressable focus-ring flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-2 text-[13px] font-semibold transition lg:text-sm ${
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
              key={slug}
              ref={panelRef}
              /* Opacity is intentionally absent from `initial`: the panel must be
                 visible even if the spring never runs. */
              initial={reduceMotion ? false : { y: -6, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6, scale: 0.97 }}
              transition={POPOVER_SPRING}
              style={{ top: pos.top, left: pos.left }}
              className={`fixed ${PANEL_Z} max-h-[70vh] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-card p-2 shadow-lift ${
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
                  {g.items.map((itm) => {
                    const active = activeHref === itm.href;
                    return (
                      <Link
                        key={itm.href}
                        href={itm.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-accent/10 hover:text-accent ${
                          active ? "bg-accent/10 text-accent" : "text-foreground"
                        }`}
                      >
                        {itm.label}
                        {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />}
                      </Link>
                    );
                  })}
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { user, loading, isStaff, signOut } = useAuth();
  const { tr, locale } = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();

  /**
   * Board slug for the current route, or null on neutral pages. This is derived
   * from the URL only, so "Federal Board" can never linger after navigating to a
   * non-board page — there is no stored board state to go stale.
   */
  const activeBoard = useMemo(() => {
    const first = (pathname ?? "/").split("/").filter(Boolean)[0];
    return first && KNOWN_BOARD_SLUGS.has(first) ? first : null;
  }, [pathname]);

  // Fixed set of visible menus: Boards, Books & Notes, Pairing Schemes,
  // Past Papers, Test Generator, Tuitions. Nothing hides behind a "More".
  const navItems = useMemo<DropdownDef[]>(
    () => [BOARDS_ITEM, buildBooksAndNotesNav(activeBoard), ...OTHER_NAV_ITEMS],
    [activeBoard],
  );

  /**
   * Full current URL, so a dropdown entry that differs from the current page only
   * by `?view=books` is still recognised as the active destination.
   */
  const currentUrl = `${pathname ?? "/"}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;

  const boardsHref = activeBoard ? `/${activeBoard}` : undefined;

  /** Destination that should render as "current" inside a given menu. */
  const activeHrefFor = useCallback(
    (item: DropdownDef): string | undefined => {
      if (item.id === BOARDS_ITEM.id) return boardsHref;
      if (item.id === BOOKS_AND_NOTES_ID) {
        if (!activeBoard) return undefined;
        const segments = (pathname ?? "").split("/").filter(Boolean);
        if (segments[0] !== activeBoard) return boardsHref;
        const classNum = parseInt(segments[1] ?? "", 10);
        if (Number.isNaN(classNum)) return boardsHref;
        const wantsBooks = searchParams?.get("view") === "books";
        return `${classHref(activeBoard, classNum)}${wantsBooks ? "?view=books" : ""}`;
      }
      return currentUrl;
    },
    [activeBoard, boardsHref, pathname, searchParams, currentUrl],
  );

  const clearClose = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  const scheduleClose = useCallback((ms = 200) => {
    clearClose();
    closeTimer.current = setTimeout(() => setOpenMenuId(null), ms);
  }, [clearClose]);

  const clearPendingOpen = useCallback(() => {
    if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null; }
  }, []);

  /**
   * Hover-to-switch between menus. The triggers sit in a tight row, so sliding the
   * pointer across the bar passes over every trigger in between — opening on the
   * raw hover event made menus flicker open/closed and re-trigger each other.
   * A menu now opens instantly only when nothing else is open, otherwise the
   * switch waits for the pointer to dwell (and is cancelled if it leaves).
   */
  const hoverOpen = useCallback((id: string) => {
    clearClose();
    clearPendingOpen();
    setOpenMenuId((current) => {
      if (current === id) return current;
      if (current !== null) {
        openTimer.current = setTimeout(() => setOpenMenuId(id), 160);
      } else {
        setOpenMenuId(id);
      }
      return current;
    });
  }, [clearClose, clearPendingOpen]);

  const closeMenu = useCallback(() => {
    clearPendingOpen();
    scheduleClose();
  }, [clearPendingOpen, scheduleClose]);

  // Any navigation (board switch, class switch, view toggle) must not leave a
  // menu open showing the previous page's list. Resetting during render (rather
  // than in an effect) avoids a frame where the stale menu is still on screen.
  const routeKey = `${pathname ?? "/"}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
  const [lastRouteKey, setLastRouteKey] = useState(routeKey);
  if (routeKey !== lastRouteKey) {
    setLastRouteKey(routeKey);
    setOpenMenuId(null);
    setDrawerOpen(false);
  }

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-[100] isolate bg-background print:hidden">
        <div className="glass-bar-solid border-b border-border/70 shadow-soft">
          <nav
            className="mx-auto flex h-16 w-full max-w-[1800px] items-center gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8"
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

            {/* Desktop nav — every menu is a visible trigger, nothing hides in "More" */}
            <div className="scrollbar-none hidden min-w-0 flex-1 items-center gap-0.5 overflow-x-auto lg:flex">
              {navItems.map((item) => (
                <NavDropdown
                  key={item.id}
                  item={item}
                  isOpen={openMenuId === item.id}
                  activeHref={activeHrefFor(item)}
                  onOpen={() => hoverOpen(item.id)}
                  onClose={closeMenu}
                  onFocused={clearClose}
                />
              ))}
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
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
                    className="pressable inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground/80 backdrop-blur-md transition hover:border-accent/50 hover:text-accent"
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
                className="pressable focus-ring inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground backdrop-blur-md transition hover:border-accent/50 hover:text-accent lg:hidden"
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
                    const activeHref = activeHrefFor(item);
                    return (
                      <div key={item.id}>
                        <p className="mb-2 flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                          {item.label}
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {item.groups.flatMap((g) => g.items).map((itm) => {
                            const active = activeHref === itm.href;
                            return (
                              <Link
                                key={`${item.id}:${itm.href}`}
                                href={itm.href}
                                onClick={() => setDrawerOpen(false)}
                                aria-current={active ? "page" : undefined}
                                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                                  active
                                    ? "border-accent bg-accent/10 text-accent"
                                    : "border-border/70 bg-card text-foreground hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
                                }`}
                              >
                                {itm.label}
                              </Link>
                            );
                          })}
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
                      className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
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
