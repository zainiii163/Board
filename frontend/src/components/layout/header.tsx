"use client";

import Link from "next/link";
import { useState, useRef, useCallback, useEffect } from "react";

import { ThemeToggle } from "@/lib/theme-context";
import { useLocale } from "@/lib/locale-context";
import { useAuth } from "@/lib/auth-context";
import { BoardsMenu } from "@/components/layout/boards-menu";

type DropdownItem = { label: string; href: string };
type DropdownGroup = { heading?: string; items: DropdownItem[] };
type DropdownDef = { label: string; groups: DropdownGroup[]; soon?: boolean };

const ALL_NAV: DropdownDef[] = [
  {
    label: "Text Books",
    groups: [
      { heading: "Pakistani Boards", items: [
        { label: "Federal Board", href: "/categories/federal-text-books" },
        { label: "Punjab Board", href: "/categories/punjab-text-books" },
        { label: "Sindh Board", href: "/categories/sindh-text-books" },
        { label: "Balochistan Board", href: "/categories/balochistan-text-books" },
        { label: "KPK Board", href: "/categories/kpk-text-books" },
        { label: "O/A Level", href: "/categories/textbooks" },
      ]},
      { heading: "International", items: [
        { label: "Oxford", href: "/categories/oxford-text-books" },
        { label: "Cambridge", href: "/categories/cambridge-text-books" },
      ]},
    ],
  },
  {
    label: "Notes",
    groups: [
      { heading: "Pakistani Boards", items: [
        { label: "Federal Board", href: "/categories/federal-board-notes" },
        { label: "Punjab Board", href: "/categories/punjab-board-notes" },
        { label: "Sindh Board", href: "/categories/sindh-board-notes" },
        { label: "Balochistan Board", href: "/categories/balochistan-board-notes" },
        { label: "KPK Board", href: "/categories/kpk-board-notes" },
        { label: "O/A Level", href: "/categories/notes" },
      ]},
      { heading: "International", items: [
        { label: "Cambridge International", href: "/categories/cambridge-intl-notes" },
        { label: "Pearson Edexcel", href: "/categories/pearson-edexcel-notes" },
        { label: "OxfordAQA", href: "/categories/aqa-notes" },
        { label: "City & Guilds", href: "/categories/city-guilds-notes" },
        { label: "International Baccalaureate", href: "/categories/ib-notes" },
      ]},
    ],
  },
  { label: "Online Quizzes", groups: [], soon: true },
  {
    label: "Pairing",
    groups: [
      { items: [
        { label: "9th", href: "/categories/9th-class-pairing-schemes" },
        { label: "10th", href: "/categories/10th-class-pairing-schemes" },
        { label: "1st Year", href: "/categories/1st-year-pairing-schemes" },
        { label: "2nd Year", href: "/categories/2nd-year-pairing-schemes" },
      ]},
    ],
  },
  {
    label: "Results",
    groups: [
      { items: [
        { label: "Top Position Holders", href: "/categories/top-position-holders" },
        { label: "Result Gazette", href: "/categories/result-gazettes" },
        { label: "Board Notifications", href: "/categories/board-news-info" },
        { label: "Date Sheets", href: "/categories/date-sheets" },
        { label: "Admission & Exams Schedules", href: "/categories/admission-exam-schedules" },
        { label: "Rechecking/Supplementary", href: "/categories/board-news-info" },
      ]},
    ],
  },
  {
    label: "Past Papers",
    groups: [
      { items: [
        { label: "9th", href: "/categories/9th-class-model-papers" },
        { label: "10th", href: "/categories/10th-class-model-papers" },
        { label: "1st Year", href: "/categories/1st-year-model-papers" },
        { label: "2nd Year", href: "/categories/2nd-year-model-papers" },
      ]},
    ],
  },
  {
    label: "Guess Papers",
    groups: [
      { items: [
        { label: "9th", href: "/categories/9th-class-guess-papers" },
        { label: "10th", href: "/categories/10th-class-guess-papers" },
        { label: "1st Year", href: "/categories/1st-year-guess-papers" },
        { label: "2nd Year", href: "/categories/2nd-year-guess-papers" },
      ]},
    ],
  },
  {
    label: "Test",
    groups: [
      { items: [
        { label: "9th", href: "/categories/9th-class-tests" },
        { label: "10th", href: "/categories/10th-class-tests" },
        { label: "1st Year", href: "/categories/1st-year-tests" },
        { label: "2nd Year", href: "/categories/2nd-year-tests" },
      ]},
    ],
  },
  {
    label: "Tuition",
    groups: [
      { items: [
        { label: "Malik Shahid (Maths Teacher)", href: "/tuition" },
        { label: "Online Academy Classes", href: "/categories/online-academy-classes" },
        { label: "Find a Tutor", href: "/categories/find-tutor" },
        { label: "Tuition Request", href: "/categories/tuition-request" },
        { label: "Become a Tutor", href: "/categories/become-tutor" },
      ]},
    ],
  },
  { label: "Whiteboard", groups: [], soon: true },
  { label: "Test Generator", groups: [], soon: true },
];

const CORE_NAV = ALL_NAV.slice(0, 7);
const MORE_NAV = ALL_NAV.slice(7);

const MOBILE_BOARDS = [
  { slug: "fbise", label: "Federal Board" },
  { slug: "punjab", label: "Punjab Board" },
  { slug: "sindh", label: "Sindh Board" },
  { slug: "balochistan", label: "Balochistan Board" },
  { slug: "kpk", label: "KPK Board" },
  { slug: "oxford", label: "Oxford Board" },
  { slug: "cambridge", label: "Cambridge Board" },
];

function NavDropdown({ item, isOpen, onOpen, onClose, onFocused }: {
  item: DropdownDef;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onFocused: () => void;
}) {
  const slug = item.label.toLowerCase().replace(/[^a-z]/g, "-");

  if (item.soon) {
    return (
      <Link href={`/${slug}`} className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1.5 text-[11px] font-semibold text-foreground transition-all duration-200 hover:bg-accent/10 hover:text-accent">
        {item.label}
        <span className="rounded bg-amber-100 px-1 py-0.5 text-[7px] font-bold uppercase leading-none text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">Soon</span>
      </Link>
    );
  }

  return (
    <div className="relative pb-2" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button type="button" className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-all duration-200 ${isOpen ? "bg-accent/10 text-accent" : "text-foreground hover:bg-accent/10 hover:text-accent"}`}>
        {item.label}
        <svg viewBox="0 0 24 24" className={`h-2.5 w-2.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {isOpen && (
        <div className="absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 rounded-xl border border-border bg-card p-2 shadow-xl animate-scale-in" onMouseEnter={onFocused} onMouseLeave={onClose}>
          {item.groups.map((g, gi) => (
            <div key={gi}>
              {g.heading && <div className="mb-1 mt-1 px-2.5 text-[9px] font-bold uppercase tracking-wider text-muted">{g.heading}</div>}
              {g.items.map((itm) => (
                <Link key={itm.href} href={itm.href} onClick={onClose} className="block rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground transition-all duration-200 hover:bg-accent/10 hover:text-accent hover:translate-x-0.5">
                  {itm.label}
                </Link>
              ))}
              {gi < item.groups.length - 1 && <div className="my-1 border-t border-border" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownSlug, setDropdownSlug] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const { user, loading, isStaff, signOut } = useAuth();
  const { tr, locale } = useLocale();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const clearClose = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  const scheduleClose = useCallback((ms = 200) => {
    clearClose();
    closeTimer.current = setTimeout(() => { setDropdownSlug(null); setMoreOpen(false); }, ms);
  }, [clearClose]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur print:hidden">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-1.5 sm:px-5 lg:px-8" aria-label="Main">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 group/logo">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white transition-transform duration-300 group-hover/logo:scale-110">B</span>
          <span className="hidden font-serif text-lg font-bold text-foreground transition-colors duration-200 group-hover/logo:text-accent sm:block">BoardNotes</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0 overflow-x-auto scrollbar-none xl:flex">
          <BoardsMenu />
          {CORE_NAV.map((item) => (
            <NavDropdown
              key={item.label}
              item={item}
              isOpen={dropdownSlug === item.label.toLowerCase().replace(/[^a-z]/g, "-")}
              onOpen={() => { clearClose(); setDropdownSlug(item.label.toLowerCase().replace(/[^a-z]/g, "-")); }}
              onClose={() => scheduleClose()}
              onFocused={clearClose}
            />
          ))}
          {/* More */}
          <div className="relative pb-2" ref={moreRef} onMouseEnter={() => { clearClose(); setMoreOpen(true); setDropdownSlug(null); }} onMouseLeave={() => scheduleClose()}>
            <button type="button" className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-all duration-200 ${moreOpen ? "bg-accent/10 text-accent" : "text-foreground hover:bg-accent/10 hover:text-accent"}`}>
              More
              <svg viewBox="0 0 24 24" className={`h-2.5 w-2.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full z-50 w-56 rounded-xl border border-border bg-card p-2 shadow-xl animate-scale-in" onMouseEnter={clearClose} onMouseLeave={() => scheduleClose()}>
                {MORE_NAV.map((item) => {
                  const slug = item.label.toLowerCase().replace(/[^a-z]/g, "-");
                  if (item.soon) {
                    return (
                      <Link key={slug} href={`/${slug}`} onClick={() => setMoreOpen(false)} className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground transition-all duration-200 hover:bg-accent/10 hover:text-accent">
                        {item.label}
                        <span className="rounded bg-amber-100 px-1 py-0.5 text-[7px] font-bold uppercase text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">Soon</span>
                      </Link>
                    );
                  }
                  return (
                    <div key={slug} className="relative group/nested">
                      <div className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground cursor-default">
                        {item.label}
                        <svg viewBox="0 0 24 24" className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover/nested:opacity-100" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                      </div>
                      <div className="invisible absolute left-full top-0 ml-1 w-48 rounded-xl border border-border bg-card p-2 shadow-xl group-hover/nested:visible">
                        {item.groups.map((g, gi) => (
                          <div key={gi}>
                            {g.heading && <div className="mb-1 mt-1 px-2 text-[9px] font-bold uppercase tracking-wider text-muted">{g.heading}</div>}
                            {g.items.map((itm) => (
                              <Link key={itm.href} href={itm.href} onClick={() => setMoreOpen(false)} className="block rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground transition-all duration-200 hover:bg-accent/10 hover:text-accent">
                                {itm.label}
                              </Link>
                            ))}
                            {gi < item.groups.length - 1 && <div className="my-1 border-t border-border" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Desktop right */}
        <div className="flex items-center gap-1 shrink-0">
          <form action="/search" role="search" className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 md:flex transition-all duration-300 focus-within:border-accent focus-within:shadow-md focus-within:shadow-accent/10">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input name="q" autoComplete="off" placeholder={locale === "ur" ? "تلاش…" : "Search…"} aria-label={tr("search")} className="w-20 bg-transparent text-[11px] font-medium text-foreground outline-none placeholder:text-muted focus:w-28 transition-all duration-300" />
          </form>
          <ThemeToggle />
          {!loading && user ? (
            <>
              {isStaff && <Link href="/admin" className="hidden rounded-lg px-2 py-1.5 text-[11px] font-semibold text-accent transition-all duration-200 hover:bg-accent/10 lg:inline-block">Admin</Link>}
              <Link href="/account" className="hidden rounded-full border border-border px-3 py-1 text-[11px] font-semibold text-foreground transition-all duration-200 hover:border-accent hover:bg-accent hover:text-white sm:inline-block">{user.name.split(" ")[0]}</Link>
            </>
          ) : (
            <Link href="/login" className="rounded-full bg-accent px-4 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:scale-105">{tr("signUp")}</Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button type="button" onClick={() => setMenuOpen((o) => !o)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground xl:hidden" aria-label={menuOpen ? tr("closeMenu") : tr("openMenu")}>
          <span className="flex flex-col gap-1" aria-hidden="true">
            <span className={`h-0.5 w-4 bg-current transition-all duration-300 ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`h-0.5 w-4 bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-4 bg-current transition-all duration-300 ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-card px-4 py-4 xl:hidden animate-fade-in">
          <form action="/search" role="search" className="mb-3 flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 transition-all duration-300 focus-within:border-accent">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input name="q" autoComplete="off" placeholder={tr("portalSearchPlaceholder")} aria-label={tr("search")} className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted" />
          </form>
          <div className="mb-1 mt-3 flex items-center gap-2">
            <ThemeToggle />
          </div>
          <div className="mb-1 mt-3 px-1 text-[10px] font-bold uppercase tracking-wider text-muted">{tr("boards")}</div>
          <div className="grid grid-cols-2 gap-1">
            {MOBILE_BOARDS.map((b) => (
              <Link key={b.slug} href={`/${b.slug}`} onClick={() => setMenuOpen(false)} className="rounded-lg border border-border px-3 py-2 text-[13px] font-semibold text-foreground transition-all duration-200 hover:border-accent hover:bg-accent/10 hover:text-accent">
                {b.label}
              </Link>
            ))}
          </div>
          {ALL_NAV.map((item) => (
            <MobileSection key={item.label} item={item} onLink={() => setMenuOpen(false)} />
          ))}
          <div className="mt-3 border-t border-border pt-3">
            {!loading && user ? (
              <div className="flex flex-col gap-1.5">
                <Link href="/account" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent/10">{user.name}</Link>
                {isStaff && <Link href="/admin" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-accent transition-all duration-200 hover:bg-accent/10">{tr("admin")}</Link>}
                <button type="button" onClick={() => { signOut(); setMenuOpen(false); }} className="rounded-lg px-3 py-2 text-left text-sm font-medium text-muted transition-all duration-200 hover:bg-red-50 hover:text-red-600">{tr("signOut")}</button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-full bg-accent px-5 py-2.5 text-center text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-accent/20">{tr("signUp")} / {tr("signIn")}</Link>
            )}
            <Link href="/upload" onClick={() => setMenuOpen(false)} className="mt-2 block rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-center text-sm font-bold text-accent transition-all duration-300 hover:bg-accent hover:text-white">{tr("uploadTitle")}</Link>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileSection({ item, onLink }: { item: DropdownDef; onLink: () => void }) {
  const [open, setOpen] = useState(false);

  if (item.soon) {
    return (
      <Link href={`/${item.label.toLowerCase().replace(/[^a-z]/g, "-")}`} onClick={onLink} className="mb-0.5 flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-accent/10">
        {item.label}
        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">Soon</span>
      </Link>
    );
  }

  return (
    <div className="mb-0.5">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-accent/10">
        {item.label}
        <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="ml-3 pb-1 animate-fade-in">
          {item.groups.map((g, gi) => (
            <div key={gi}>
              {g.heading && <div className="mb-1 mt-1 text-[9px] font-bold uppercase tracking-wider text-muted">{g.heading}</div>}
              {g.items.map((itm) => (
                <Link key={itm.href} href={itm.href} onClick={onLink} className="block rounded-lg px-3 py-1.5 text-[13px] font-medium text-foreground transition-all duration-200 hover:bg-accent/10 hover:text-accent hover:translate-x-0.5">
                  {itm.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
