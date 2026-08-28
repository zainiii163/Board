"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";

import { ThemeToggle } from "@/lib/theme-context";
import { useLocale } from "@/lib/locale-context";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api-client";
import type { NavCategory } from "@/components/portal/portal-types";

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

  const NavDropdown = ({ c, label, slug }: { c: NavCategory | undefined; label: string; slug: string }) => (
    <div className="relative" onMouseEnter={() => openDropdown(slug)} onMouseLeave={() => scheduleClose()}>
      <button type="button" className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-foreground transition hover:bg-accent/10 hover:text-accent whitespace-nowrap">
        {label}
        <svg viewBox="0 0 24 24" className={`h-2.5 w-2.5 transition-transform ${dropdownSlug === slug ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {dropdownSlug === slug && c && c.children && c.children.length > 0 && (
        <div className="absolute left-1/2 top-full z-30 mt-1 w-52 -translate-x-1/2 rounded-xl border border-border bg-card p-2 shadow-xl"
          onMouseEnter={clearClose} onMouseLeave={() => scheduleClose()}>
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
          <NavDropdown c={textbooks} label="Text Books" slug="textbooks" />
          <NavDropdown c={notes} label="Notes" slug="notes" />
          <NavDropdown c={pairingSchemes} label="Pairing" slug="pairing-schemes" />
          <NavDropdown c={resultsNews} label="Results" slug="results-news" />
          <NavDropdown c={modelPapers} label="Past Papers" slug="model-papers" />
          <NavDropdown c={guessPapers} label="Guess Papers" slug="guess-papers" />
          <NavDropdown c={test} label="Test" slug="test" />
          <NavDropdown c={tuition} label="Tuition" slug="tuition" />
          {/* More dropdown for coming soon */}
          <div className="relative" ref={moreRef}>
            <button type="button" onClick={() => { setMoreOpen((o) => !o); setDropdownSlug(null); }}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-foreground transition hover:bg-accent/10 hover:text-accent whitespace-nowrap">
              More
              <svg viewBox="0 0 24 24" className={`h-2.5 w-2.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full z-30 mt-1 w-48 rounded-xl border border-border bg-card p-2 shadow-xl">
                {[
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
        </div>

        {/* Mobile hamburger */}
        <button type="button" onClick={() => setMenuOpen((o) => !o)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}>
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
          <div className="mb-3 flex items-center gap-2">
            <button type="button" onClick={toggleLocale}
              className="rounded-lg border border-border px-2.5 py-1.5 text-[12px] font-semibold text-muted transition hover:text-foreground">
              {locale === "en" ? "اردو" : "EN"}
            </button>
            <ThemeToggle />
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