"use client";

import Link from "next/link";
import { useState, useRef, useCallback } from "react";

import { useLocale } from "@/lib/locale-context";
import { useAuth } from "@/lib/auth-context";
import { BoardsMenu } from "@/components/layout/boards-menu";

type DropdownItem = { label: string; href: string };
type DropdownGroup = { heading?: string; items: DropdownItem[] };
type DropdownDef = { label: string; groups: DropdownGroup[]; soon?: boolean };

const NAV_ITEMS: DropdownDef[] = [
  { label: "Text Books", groups: [
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
  ]},
  { label: "Notes", groups: [
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
  ]},
  { label: "Online Quizzes", groups: [], soon: true },
  { label: "Pairing", groups: [
    { items: [
      { label: "9th", href: "/categories/9th-class-pairing-schemes" },
      { label: "10th", href: "/categories/10th-class-pairing-schemes" },
      { label: "1st Year", href: "/categories/1st-year-pairing-schemes" },
      { label: "2nd Year", href: "/categories/2nd-year-pairing-schemes" },
    ]},
  ]},
  { label: "Results", groups: [
    { items: [
      { label: "Top Position Holders", href: "/categories/top-position-holders" },
      { label: "Result Gazette", href: "/categories/result-gazettes" },
      { label: "Board Notifications", href: "/categories/board-news-info" },
      { label: "Date Sheets", href: "/categories/date-sheets" },
      { label: "Admission & Exams Schedules", href: "/categories/admission-exam-schedules" },
      { label: "Rechecking/Supplementary", href: "/categories/board-news-info" },
    ]},
  ]},
  { label: "Past Papers", groups: [
    { items: [
      { label: "9th", href: "/categories/9th-class-model-papers" },
      { label: "10th", href: "/categories/10th-class-model-papers" },
      { label: "1st Year", href: "/categories/1st-year-model-papers" },
      { label: "2nd Year", href: "/categories/2nd-year-model-papers" },
    ]},
  ]},
  { label: "Guess Papers", groups: [
    { items: [
      { label: "9th", href: "/categories/9th-class-guess-papers" },
      { label: "10th", href: "/categories/10th-class-guess-papers" },
      { label: "1st Year", href: "/categories/1st-year-guess-papers" },
      { label: "2nd Year", href: "/categories/2nd-year-guess-papers" },
    ]},
  ]},
  { label: "Test", groups: [
    { items: [
      { label: "9th", href: "/categories/9th-class-tests" },
      { label: "10th", href: "/categories/10th-class-tests" },
      { label: "1st Year", href: "/categories/1st-year-tests" },
      { label: "2nd Year", href: "/categories/2nd-year-tests" },
    ]},
  ]},
  { label: "Tuition", groups: [
    { items: [
      { label: "Malik Shahid (Maths)", href: "/tuition" },
      { label: "Online Academy Classes", href: "/categories/online-academy-classes" },
      { label: "Find a Tutor", href: "/categories/find-tutor" },
      { label: "Tuition Request", href: "/categories/tuition-request" },
      { label: "Become a Tutor", href: "/categories/become-tutor" },
    ]},
  ]},
  { label: "Whiteboard", groups: [], soon: true },
  { label: "Test Generator", groups: [], soon: true },
];

const MOBILE_BOARDS = [
  { slug: "fbise", label: "Federal Board" },
  { slug: "punjab", label: "Punjab Board" },
  { slug: "sindh", label: "Sindh Board" },
  { slug: "balochistan", label: "Balochistan Board" },
  { slug: "kpk", label: "KPK Board" },
  { slug: "oxford", label: "Oxford Board" },
  { slug: "cambridge", label: "Cambridge Board" },
];

function Dropdown({ item, isOpen, onOpen, onClose, onFocused }: {
  item: DropdownDef;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onFocused: () => void;
}) {
  const slug = item.label.toLowerCase().replace(/[^a-z]/g, "-");

  if (item.soon) {
    return (
      <Link href={`/${slug}`} className="flex items-center gap-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold text-foreground/80 transition hover:bg-accent/10 hover:text-accent">
        {item.label}
        <span className="rounded bg-amber-100 px-1 py-px text-[7px] font-bold uppercase leading-none text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">Soon</span>
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button type="button" className={`flex items-center gap-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold transition hover:bg-accent/10 hover:text-accent ${isOpen ? "text-accent bg-accent/10" : "text-foreground/80"}`}>
        {item.label}
        <svg viewBox="0 0 24 24" className={`h-2 w-2 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {isOpen && (
        <div className="absolute left-1/2 top-full z-50 mt-1 w-56 -translate-x-1/2 rounded-xl border border-border bg-card p-1.5 shadow-2xl animate-scale-in backdrop-blur-sm" onMouseEnter={onFocused} onMouseLeave={onClose}>
          {item.groups.map((g, gi) => (
            <div key={gi}>
              {g.heading && <div className="mb-0.5 mt-1.5 px-2.5 text-[9px] font-bold uppercase tracking-wider text-muted">{g.heading}</div>}
              {g.items.map((itm) => (
                <Link key={itm.href} href={itm.href} onClick={onClose} className="block rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-foreground transition-all duration-200 hover:bg-accent/10 hover:text-accent hover:pl-3.5">
                  {itm.label}
                </Link>
              ))}
              {gi < item.groups.length - 1 && <div className="my-1 border-t border-border/50" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileSection({ item, onLink }: { item: DropdownDef; onLink: () => void }) {
  const [open, setOpen] = useState(false);
  if (item.soon) {
    return (
      <Link href={`/${item.label.toLowerCase().replace(/[^a-z]/g, "-")}`} onClick={onLink} className="mb-0.5 flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-accent/10">
        {item.label}
        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">Soon</span>
      </Link>
    );
  }
  return (
    <div className="mb-0.5">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-accent/10">
        {item.label}
        <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 text-muted transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="ml-3 pb-1">
          {item.groups.map((g, gi) => (
            <div key={gi}>
              {g.heading && <div className="mb-1 mt-1 text-[9px] font-bold uppercase tracking-wider text-muted">{g.heading}</div>}
              {g.items.map((itm) => (
                <Link key={itm.href} href={itm.href} onClick={onLink} className="block rounded-lg px-3 py-1.5 text-[13px] font-medium text-foreground transition hover:bg-accent/10 hover:text-accent">
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

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownSlug, setDropdownSlug] = useState<string | null>(null);
  const { user, loading, isStaff, signOut } = useAuth();
  const { tr, locale } = useLocale();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearClose = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  const scheduleClose = useCallback((ms = 200) => {
    clearClose();
    closeTimer.current = setTimeout(() => setDropdownSlug(null), ms);
  }, [clearClose]);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur print:hidden">
      <nav className="mx-auto flex w-full max-w-[1400px] items-center px-3 py-1 sm:px-4 lg:px-6" aria-label="Main">
        {/* Logo */}
        <Link href="/" className="mr-2 flex shrink-0 items-center gap-1.5">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white">B</span>
          <span className="hidden font-serif text-base font-bold text-foreground sm:block">BoardNotes</span>
        </Link>

        {/* Boards + all nav items */}
        <div className="hidden items-center gap-0 overflow-visible xl:flex">
          <BoardsMenu />
          {NAV_ITEMS.map((item) => (
            <Dropdown
              key={item.label}
              item={item}
              isOpen={dropdownSlug === item.label.toLowerCase().replace(/[^a-z]/g, "-")}
              onOpen={() => { clearClose(); setDropdownSlug(item.label.toLowerCase().replace(/[^a-z]/g, "-")); }}
              onClose={() => scheduleClose()}
              onFocused={clearClose}
            />
          ))}
        </div>

        {/* Right side — search + auth */}
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <form action="/search" role="search" className="hidden items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 sm:flex focus-within:border-accent transition-colors">
            <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input name="q" autoComplete="off" placeholder={locale === "ur" ? "تلاش…" : "Search…"} aria-label={tr("search")} className="w-14 bg-transparent text-[10.5px] font-medium text-foreground outline-none placeholder:text-muted focus:w-20 transition-all" />
          </form>
          {!loading && user ? (
            <>
              {isStaff && <Link href="/admin" className="hidden rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold text-accent transition hover:bg-accent/10 lg:inline-block">Admin</Link>}
              <Link href="/account" className="hidden rounded-full border border-border px-2 py-0.5 text-[10.5px] font-semibold text-foreground transition hover:bg-card sm:inline-block">{user.name.split(" ")[0]}</Link>
            </>
          ) : (
            <Link href="/login" className="rounded-full bg-accent px-2.5 py-0.5 text-[10.5px] font-bold text-white shadow-sm transition hover:shadow-md hover:shadow-accent/20">{tr("signUp")}</Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button type="button" onClick={() => setMenuOpen((o) => !o)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground xl:hidden" aria-label={menuOpen ? tr("closeMenu") : tr("openMenu")}>
          <span className="flex flex-col gap-1" aria-hidden="true">
            <span className={`h-0.5 w-4 bg-current transition-all ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`h-0.5 w-4 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-4 bg-current transition-all ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-card px-4 py-4 xl:hidden">
          <form action="/search" role="search" className="mb-3 flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input name="q" autoComplete="off" placeholder={tr("portalSearchPlaceholder")} aria-label={tr("search")} className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted" />
          </form>
          <div className="mb-1 mt-3 px-1 text-[10px] font-bold uppercase tracking-wider text-muted">{tr("boards")}</div>
          <div className="grid grid-cols-2 gap-1">
            {MOBILE_BOARDS.map((b) => (
              <Link key={b.slug} href={`/${b.slug}`} onClick={() => setMenuOpen(false)} className="rounded-lg border border-border px-3 py-2 text-[13px] font-semibold text-foreground transition hover:border-accent hover:bg-accent/10 hover:text-accent">
                {b.label}
              </Link>
            ))}
          </div>
          {NAV_ITEMS.map((item) => (
            <MobileSection key={item.label} item={item} onLink={() => setMenuOpen(false)} />
          ))}
          <div className="mt-3 border-t border-border pt-3">
            {!loading && user ? (
              <div className="flex flex-col gap-1.5">
                <Link href="/account" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium">{user.name}</Link>
                {isStaff && <Link href="/admin" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-accent">{tr("admin")}</Link>}
                <button type="button" onClick={() => { signOut(); setMenuOpen(false); }} className="rounded-lg px-3 py-2 text-left text-sm font-medium text-muted">{tr("signOut")}</button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-full bg-accent px-5 py-2.5 text-center text-sm font-bold text-white">{tr("signUp")} / {tr("signIn")}</Link>
            )}
            <Link href="/upload" onClick={() => setMenuOpen(false)} className="mt-2 block rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-center text-sm font-bold text-accent">{tr("uploadTitle")}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
