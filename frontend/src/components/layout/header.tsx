"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";

import { ThemeToggle } from "@/lib/theme-context";
import { useLocale } from "@/lib/locale-context";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api-client";
import type { NavCategory } from "@/components/portal/portal-types";
import { BoardsMenu } from "@/components/layout/boards-menu";
import { WHATSAPP_CHANNEL_URL } from "@/lib/constants";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.83c2.16 0 4.19.84 5.72 2.37a8.04 8.04 0 0 1 2.37 5.72c0 4.46-3.63 8.08-8.09 8.08-1.49 0-2.94-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.03 8.03 0 0 1-1.24-4.28c0-4.46 3.63-8.08 8.09-8.08Zm-2.85 4.02c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1 0 1.23.9 2.43 1.03 2.6.13.17 1.77 2.71 4.3 3.8 2.1.9 2.53.72 2.99.68.46-.05 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.17-.46-.29-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.17-.28.19-.52.06-.24-.12-1-.37-1.9-1.17-.7-.62-1.17-1.39-1.31-1.63-.16-.24-.02-.37.12-.49.13-.13.28-.35.42-.53.14-.17.19-.29.28-.49.1-.19.05-.36-.02-.5-.06-.13-.52-1.28-.73-1.76-.16-.4-.36-.37-.54-.38h-.46Z" />
    </svg>
  );
}

const STATIC_DROPDOWNS: { label: string; groups: { heading?: string; items: { label: string; href: string }[] }[] }[] = [
  {
    label: "Text Books",
    groups: [
      { heading: "Pakistani Boards", items: [
        { label: "Federal Board", href: "/categories/textbooks/fbise" },
        { label: "Punjab Board", href: "/categories/textbooks/punjab" },
        { label: "Sindh Board", href: "/categories/textbooks/sindh" },
        { label: "Balochistan Board", href: "/categories/textbooks/balochistan" },
        { label: "KPK Board", href: "/categories/textbooks/kpk" },
        { label: "O/A Level", href: "/categories/textbooks/oa-level" },
      ]},
      { heading: "International", items: [
        { label: "Oxford", href: "/categories/textbooks/oxford" },
        { label: "Cambridge", href: "/categories/textbooks/cambridge" },
      ]},
    ],
  },
  {
    label: "Notes",
    groups: [
      { heading: "Pakistani Boards", items: [
        { label: "Federal Board", href: "/categories/notes/fbise" },
        { label: "Punjab Board", href: "/categories/notes/punjab" },
        { label: "Sindh Board", href: "/categories/notes/sindh" },
        { label: "Balochistan Board", href: "/categories/notes/balochistan" },
        { label: "KPK Board", href: "/categories/notes/kpk" },
        { label: "O/A Level", href: "/categories/notes/oa-level" },
      ]},
      { heading: "International", items: [
        { label: "Cambridge International", href: "/categories/notes/cambridge" },
        { label: "Pearson Edexcel", href: "/categories/notes/pearson" },
        { label: "OxfordAQA", href: "/categories/notes/oxfordaqa" },
        { label: "City & Guilds", href: "/categories/notes/city-guilds" },
        { label: "International Baccalaureate", href: "/categories/notes/ib" },
      ]},
    ],
  },
  {
    label: "Pairing Schemes",
    groups: [
      { items: [
        { label: "9th", href: "/categories/pairing-schemes/9th" },
        { label: "10th", href: "/categories/pairing-schemes/10th" },
        { label: "1st Year", href: "/categories/pairing-schemes/1st-year" },
        { label: "2nd Year", href: "/categories/pairing-schemes/2nd-year" },
      ]},
    ],
  },
  {
    label: "Results",
    groups: [
      { items: [
        { label: "Top Position Holders", href: "/categories/results-news/top-position-holders" },
        { label: "Result Gazette", href: "/categories/results-news/result-gazette" },
        { label: "Board Notifications", href: "/categories/results-news/board-notifications" },
        { label: "Date Sheets", href: "/categories/results-news/date-sheets" },
        { label: "Admission & Exams Schedules", href: "/categories/results-news/admission-schedules" },
        { label: "Rechecking/Supplementary", href: "/categories/results-news/rechecking" },
      ]},
    ],
  },
  {
    label: "Past Papers",
    groups: [
      { items: [
        { label: "9th", href: "/categories/model-papers/9th" },
        { label: "10th", href: "/categories/model-papers/10th" },
        { label: "1st Year", href: "/categories/model-papers/1st-year" },
        { label: "2nd Year", href: "/categories/model-papers/2nd-year" },
      ]},
    ],
  },
  {
    label: "Guess Papers",
    groups: [
      { items: [
        { label: "9th", href: "/categories/guess-papers/9th" },
        { label: "10th", href: "/categories/guess-papers/10th" },
        { label: "1st Year", href: "/categories/guess-papers/1st-year" },
        { label: "2nd Year", href: "/categories/guess-papers/2nd-year" },
      ]},
    ],
  },
  {
    label: "Test",
    groups: [
      { items: [
        { label: "9th", href: "/categories/test/9th" },
        { label: "10th", href: "/categories/test/10th" },
        { label: "1st Year", href: "/categories/test/1st-year" },
        { label: "2nd Year", href: "/categories/test/2nd-year" },
      ]},
    ],
  },
  {
    label: "Tuition",
    groups: [
      { items: [
        { label: "Malik Shahid (Maths)", href: "/tuition#malik-shahid" },
        { label: "Online Academy Classes", href: "/tuition#online-classes" },
        { label: "Find a Tutor", href: "/tuition#find-tutor" },
        { label: "Tuition Request", href: "/tuition#request" },
        { label: "Become a Tutor", href: "/tuition#become-tutor" },
      ]},
    ],
  },
];

const COMING_SOON = [
  { label: "Online Quizzes", href: "/online-quizzes" },
  { label: "Whiteboard", href: "/whiteboard" },
  { label: "Test Generator", href: "/test-generator" },
];

type DropdownProps = {
  label: string;
  groups: { heading?: string; items: { label: string; href: string }[] }[];
  activeSlug: string | null;
  onOpen: (slug: string) => void;
  onClose: () => void;
  onFocused: () => void;
  setDropdownSlug: (slug: string | null) => void;
};

function HoverDropdown({ label, groups, activeSlug, onOpen, onClose, onFocused, setDropdownSlug }: DropdownProps) {
  const slug = label.toLowerCase().replace(/[^a-z]/g, "-");
  const isOpen = activeSlug === slug;

  return (
    <div className="relative" onMouseEnter={() => onOpen(slug)} onMouseLeave={onClose}>
      <button type="button" className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-foreground transition hover:bg-accent/10 hover:text-accent whitespace-nowrap">
        {label}
        <svg viewBox="0 0 24 24" className={`h-2.5 w-2.5 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {isOpen && (
        <div
          className="absolute left-1/2 top-full z-30 mt-1 w-56 -translate-x-1/2 rounded-xl border border-border bg-card p-2 shadow-xl"
          onMouseEnter={onFocused}
          onMouseLeave={onClose}
        >
          {groups.map((g, gi) => (
            <div key={gi}>
              {g.heading && (
                <div className="mb-1 mt-1 px-2.5 text-[9px] font-bold uppercase tracking-wider text-muted">{g.heading}</div>
              )}
              {g.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDropdownSlug(null)}
                  className="block rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground transition hover:bg-accent/10 hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
              {gi < groups.length - 1 && <div className="my-1 border-t border-border" />}
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
  const { tr, locale, toggleLocale } = useLocale();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearClose = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  const scheduleClose = useCallback((ms = 150) => {
    clearClose();
    closeTimer.current = setTimeout(() => setDropdownSlug(null), ms);
  }, [clearClose]);

  const openDropdown = useCallback((slug: string) => { clearClose(); setDropdownSlug(slug); }, [clearClose]);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur print:hidden">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-1 px-3 py-2 sm:px-5 lg:px-8" aria-label="Main">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white">B</span>
          <span className="hidden font-serif text-lg font-bold text-foreground sm:block">BoardNotes</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0 xl:flex">
          <BoardsMenu />
          {STATIC_DROPDOWNS.map((dd) => (
            <HoverDropdown
              key={dd.label}
              label={dd.label}
              groups={dd.groups}
              activeSlug={dropdownSlug}
              onOpen={openDropdown}
              onClose={() => scheduleClose()}
              onFocused={clearClose}
              setDropdownSlug={setDropdownSlug}
            />
          ))}
          {/* Coming Soon items */}
          {COMING_SOON.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-foreground transition hover:bg-accent/10 hover:text-accent whitespace-nowrap"
            >
              {item.label}
              <span className="rounded bg-amber-100 px-1 py-0.5 text-[8px] font-bold uppercase text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">Soon</span>
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden items-center gap-1 lg:flex">
          {/* Compact search bar */}
          <form
            action="/search"
            role="search"
            className="mr-1 hidden items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 md:flex"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              name="q"
              autoComplete="off"
              placeholder={locale === "ur" ? "تلاش…" : "Search…"}
              aria-label={tr("search")}
              className="w-20 bg-transparent text-[11px] font-medium text-foreground outline-none placeholder:text-muted focus:w-28 xl:w-28 transition-all"
            />
          </form>
          {/* Lang toggle */}
          <button type="button" onClick={toggleLocale}
            className="rounded-lg px-2 py-1.5 text-[12px] font-semibold text-muted transition hover:text-foreground" title="Toggle language">
            {locale === "en" ? "اردو" : "EN"}
          </button>
          <ThemeToggle />

          {!loading && user ? (
            <>
              {isStaff && <Link href="/admin" className="rounded-lg px-2 py-1.5 text-[12px] font-semibold text-accent transition hover:bg-accent/10">Admin</Link>}
              <Link href="/account" className="rounded-full border border-border px-3 py-1.5 text-[12px] font-semibold text-foreground transition hover:bg-card">{user.name.split(" ")[0]}</Link>
            </>
          ) : (
            <Link href="/login" className="rounded-full bg-accent px-4 py-1.5 text-[12px] font-bold text-white shadow-sm transition hover:opacity-90">{tr("signUp")}</Link>
          )}

          {/* Join WhatsApp CTA */}
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={tr("joinWhatsApp")}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-1.5 text-[12px] font-bold text-white shadow-sm transition hover:opacity-90"
          >
            <WhatsAppIcon />
            Join WhatsApp
          </a>
        </div>

        {/* Mobile hamburger */}
        <button type="button" onClick={() => setMenuOpen((o) => !o)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
          aria-label={menuOpen ? tr("closeMenu") : tr("openMenu")}>
          <span className="flex flex-col gap-1" aria-hidden="true">
            <span className={`h-0.5 w-4 bg-current transition-transform ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`h-0.5 w-4 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-4 bg-current transition-transform ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-card px-4 py-4 lg:hidden">
          {/* Search */}
          <form action="/search" role="search" className="mb-3 flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              name="q"
              autoComplete="off"
              placeholder={tr("portalSearchPlaceholder")}
              aria-label={tr("search")}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
            />
          </form>

          <div className="mb-1 mt-3 flex items-center gap-2">
            <button type="button" onClick={toggleLocale}
              className="rounded-lg border border-border px-2.5 py-1.5 text-[12px] font-semibold text-muted transition hover:text-foreground">
              {locale === "en" ? "اردو" : "EN"}
            </button>
            <ThemeToggle />
          </div>

          {/* Boards quick links */}
          <div className="mb-1 mt-3 px-1 text-[10px] font-bold uppercase tracking-wider text-muted">{tr("boards")}</div>
          <div className="grid grid-cols-2 gap-1">
            {[
              { slug: "fbise", label: "Federal Board" },
              { slug: "punjab", label: "Punjab Board" },
              { slug: "sindh", label: "Sindh Board" },
              { slug: "balochistan", label: "Balochistan Board" },
              { slug: "kpk", label: "KPK Board" },
              { slug: "oxford", label: "Oxford Board" },
              { slug: "cambridge", label: "Cambridge Board" },
            ].map((b) => (
              <Link key={b.slug} href={`/${b.slug}`} onClick={() => setMenuOpen(false)}
                className="rounded-lg border border-border px-3 py-2 text-[13px] font-semibold text-foreground transition hover:bg-accent/10 hover:text-accent">
                {b.label}
              </Link>
            ))}
          </div>

          {/* Static mobile sections */}
          {STATIC_DROPDOWNS.map((dd) => (
            <MobileSection key={dd.label} title={dd.label} groups={dd.groups} onLink={() => setMenuOpen(false)} />
          ))}

          <div className="mb-1 mt-3 px-1 text-[10px] font-bold uppercase tracking-wider text-muted">Coming Soon</div>
          {COMING_SOON.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent/10 hover:text-accent">
              {item.label}
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">Soon</span>
            </Link>
          ))}

          <div className="mt-3 border-t border-border pt-3">
            {!loading && user ? (
              <div className="flex flex-col gap-1.5">
                <Link href="/account" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium">{user.name}</Link>
                {isStaff && <Link href="/admin" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-accent">{tr("admin")}</Link>}
                <button type="button" onClick={() => { signOut(); setMenuOpen(false); }} className="rounded-lg px-3 py-2 text-left text-sm font-medium text-muted">{tr("signOut")}</button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-full bg-accent px-5 py-2.5 text-center text-sm font-bold text-white">{tr("signUp")} / {tr("signIn")}</Link>
              </div>
            )}
            <Link href="/upload" onClick={() => setMenuOpen(false)} className="mt-2 block rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-center text-sm font-bold text-accent">{tr("uploadTitle")}</Link>
            <a
              href={WHATSAPP_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-center text-sm font-bold text-white"
            >
              <WhatsAppIcon />
              {tr("joinWhatsApp")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileSection({ title, groups, onLink }: { title: string; groups: { heading?: string; items: { label: string; href: string }[] }[]; onLink: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-0.5">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-accent/10">
        {title}
        <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 text-muted transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="ml-3 pb-1">
          {groups.map((g, gi) => (
            <div key={gi}>
              {g.heading && <div className="mb-1 mt-1 text-[9px] font-bold uppercase tracking-wider text-muted">{g.heading}</div>}
              {g.items.map((item) => (
                <Link key={item.href} href={item.href} onClick={onLink}
                  className="block rounded-lg px-3 py-1.5 text-[13px] font-medium text-foreground transition hover:bg-accent/10 hover:text-accent">
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
