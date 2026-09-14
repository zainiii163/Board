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

type NavDropdownProps = {
  c: NavCategory | undefined;
  label: string;
  slug: string;
  activeSlug: string | null;
  onOpen: (slug: string) => void;
  onClose: () => void;
  onFocused: () => void;
  setDropdownSlug: (slug: string | null) => void;
};

function NavDropdown({ c, label, slug, activeSlug, onOpen, onClose, onFocused, setDropdownSlug }: NavDropdownProps) {
  return (
    <div className="relative" onMouseEnter={() => onOpen(slug)} onMouseLeave={onClose}>
      <button type="button" className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-foreground transition hover:bg-accent/10 hover:text-accent whitespace-nowrap">
        {label}
        <svg viewBox="0 0 24 24" className={`h-2.5 w-2.5 transition-transform ${activeSlug === slug ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {activeSlug === slug && c && c.children && c.children.length > 0 && (
        <div className="absolute left-1/2 top-full z-30 mt-1 w-52 -translate-x-1/2 rounded-xl border border-border bg-card p-2 shadow-xl"
          onMouseEnter={onFocused} onMouseLeave={onClose}>
          {c.children.map((ch) => (
            <Link key={ch.slug} href={`/categories/${ch.slug}`} onClick={() => setDropdownSlug(null)}
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground transition hover:bg-accent/10 hover:text-accent">
              <span className="text-sm">{ch.icon}</span>{ch.name}
            </Link>
          ))}
          <Link href={`/categories/${slug}`} onClick={() => setDropdownSlug(null)}
            className="mt-1 block rounded-lg bg-accent/10 px-2.5 py-1.5 text-center text-[11px] font-bold text-accent">View All →</Link>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [dropdownSlug, setDropdownSlug] = useState<string | null>(null);
  const [navCats, setNavCats] = useState<NavCategory[]>([]);
  const { user, loading, isStaff, signOut } = useAuth();
  const { tr, locale, toggleLocale } = useLocale();
  const moreRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    apiFetch<{ tree: NavCategory[] }>("/api/portal/nav")
      .then((d) => setNavCats(d.tree))
      .catch(() => {});
  }, []);

  const cat = (slug: string) => navCats.find((c) => c.slug === slug);

  const textbooks = cat("textbooks");
  const notes = cat("notes");
  const pairingSchemes = cat("pairing-schemes");
  const resultsNews = cat("results-news");
  const modelPapers = cat("model-papers");
  const guessPapers = cat("guess-papers");
  const test = cat("test");
  const tuition = cat("tuition");

  const clearClose = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  const scheduleClose = useCallback((ms = 150) => {
    clearClose();
    closeTimer.current = setTimeout(() => { setDropdownSlug(null); setMoreOpen(false); }, ms);
  }, [clearClose]);

  const openDropdown = useCallback((slug: string) => { clearClose(); setDropdownSlug(slug); setMoreOpen(false); }, [clearClose]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur print:hidden">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-1 px-3 py-2 sm:px-5 lg:px-8" aria-label="Main">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white">B</span>
          <span className="hidden font-serif text-lg font-bold text-foreground sm:block">BoardNotes</span>
        </Link>

        {/* Desktop nav — core items */}
        <div className="hidden items-center gap-0 xl:flex">
          <BoardsMenu />
          <NavDropdown c={textbooks} label="Text Books" slug="textbooks" activeSlug={dropdownSlug} onOpen={openDropdown} onClose={() => scheduleClose()} onFocused={clearClose} setDropdownSlug={setDropdownSlug} />
          <NavDropdown c={notes} label="Notes" slug="notes" activeSlug={dropdownSlug} onOpen={openDropdown} onClose={() => scheduleClose()} onFocused={clearClose} setDropdownSlug={setDropdownSlug} />
          <NavDropdown c={pairingSchemes} label="Pairing" slug="pairing-schemes" activeSlug={dropdownSlug} onOpen={openDropdown} onClose={() => scheduleClose()} onFocused={clearClose} setDropdownSlug={setDropdownSlug} />
          <NavDropdown c={resultsNews} label="Results" slug="results-news" activeSlug={dropdownSlug} onOpen={openDropdown} onClose={() => scheduleClose()} onFocused={clearClose} setDropdownSlug={setDropdownSlug} />
          <NavDropdown c={modelPapers} label="Past Papers" slug="model-papers" activeSlug={dropdownSlug} onOpen={openDropdown} onClose={() => scheduleClose()} onFocused={clearClose} setDropdownSlug={setDropdownSlug} />
          <NavDropdown c={test} label="Test" slug="test" activeSlug={dropdownSlug} onOpen={openDropdown} onClose={() => scheduleClose()} onFocused={clearClose} setDropdownSlug={setDropdownSlug} />
          {/* More dropdown */}
          <div className="relative" ref={moreRef}>
            <button type="button" onClick={() => { setMoreOpen((o) => !o); setDropdownSlug(null); }}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-foreground transition hover:bg-accent/10 hover:text-accent whitespace-nowrap">
              More
              <svg viewBox="0 0 24 24" className={`h-2.5 w-2.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full z-30 mt-1 w-52 rounded-xl border border-border bg-card p-2 shadow-xl">
                {[
                  { href: "/guess-papers", label: "Guess Papers" },
                  { href: "/tuition", label: "Tuition" },
                  { href: "/online-quizzes", label: "Online Quizzes", soon: true },
                  { href: "/whiteboard", label: "Whiteboard", soon: true },
                  { href: "/test-generator", label: "Test Generator", soon: true },
                ].map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setMoreOpen(false)}
                    className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground transition hover:bg-accent/10 hover:text-accent">
                    {l.label}
                    {l.soon && <span className="rounded bg-amber-100 px-1 py-0.5 text-[8px] font-bold uppercase text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">Soon</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
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
          <Link href="/upload" className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-[12px] font-bold text-accent transition hover:bg-accent/20 hidden sm:inline-flex">{tr("uploadTitle")}</Link>

          {/* Join Our WhatsApp CTA */}
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
              { slug: "oxford", label: "Oxford Board" },
              { slug: "cambridge", label: "Cambridge Board" },
            ].map((b) => (
              <Link key={b.slug} href={`/${b.slug}`} onClick={() => setMenuOpen(false)}
                className="rounded-lg border border-border px-3 py-2 text-[13px] font-semibold text-foreground transition hover:bg-accent/10 hover:text-accent">
                {b.label}
              </Link>
            ))}
          </div>

          <MobileAccordion title="Text Books" c={textbooks} onLink={() => setMenuOpen(false)} />
          <MobileAccordion title="Notes" c={notes} onLink={() => setMenuOpen(false)} />
          <MobileAccordion title="Pairing Schemes" c={pairingSchemes} onLink={() => setMenuOpen(false)} />
          <MobileAccordion title="Result & Board News" c={resultsNews} onLink={() => setMenuOpen(false)} />
          <MobileAccordion title="Model & Past Papers" c={modelPapers} onLink={() => setMenuOpen(false)} />
          <MobileAccordion title="Guess Papers" c={guessPapers} onLink={() => setMenuOpen(false)} />
          <MobileAccordion title="Test" c={test} onLink={() => setMenuOpen(false)} />
          <MobileAccordion title="Tuition" c={tuition} onLink={() => setMenuOpen(false)} />

          <div className="mb-1 mt-3 px-1 text-[10px] font-bold uppercase tracking-wider text-muted">Coming Soon</div>
          {[
            { href: "/online-quizzes", label: "Online Quizzes" },
            { href: "/whiteboard", label: "Whiteboard" },
            { href: "/test-generator", label: "Test Generator" },
          ].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent/10 hover:text-accent">
              {l.label}
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

function MobileAccordion({ title, c, onLink }: { title: string; c: NavCategory | undefined; onLink: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-0.5">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-accent/10">
        {title}
        <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 text-muted transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && c && c.children && (
        <div className="ml-3 pb-1">
          {c.children.map((ch) => (
            <Link key={ch.slug} href={`/categories/${ch.slug}`} onClick={onLink}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium text-foreground transition hover:bg-accent/10 hover:text-accent">
              <span className="text-sm">{ch.icon}</span>{ch.name}
            </Link>
          ))}
          <Link href={`/categories/${c.slug}`} onClick={onLink}
            className="block px-3 py-1.5 text-[11px] font-bold text-accent">View All →</Link>
        </div>
      )}
    </div>
  );
}