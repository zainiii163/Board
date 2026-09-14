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

  const NavDropdown = ({ c, label, slug, customItems }: { c: NavCategory | undefined; label: string; slug: string; customItems?: Array<{ label: string; href?: string; group?: string; soon?: boolean }> }) => (
    <div className="relative" onMouseEnter={() => openDropdown(slug)} onMouseLeave={() => scheduleClose()}>
      <button type="button" className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-foreground transition hover:bg-accent/10 hover:text-accent whitespace-nowrap">
        {label}
        <svg viewBox="0 0 24 24" className={`h-2.5 w-2.5 transition-transform ${dropdownSlug === slug ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {dropdownSlug === slug && (
        <div className="absolute left-1/2 top-full z-30 mt-1 min-w-64 -translate-x-1/2 rounded-xl border border-border bg-card p-3 shadow-xl"
          onMouseEnter={clearClose} onMouseLeave={() => scheduleClose()}>
          {customItems ? (
            <div className="space-y-3">
              {customItems.map((item, idx) => (
                item.group ? (
                  <div key={idx}>
                    <div className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-muted">{item.group}</div>
                    <div className="space-y-0.5">
                      {customItems.filter(i => i.group === item.group).map((groupItem, groupIdx) => (
                        <Link key={groupIdx} href={groupItem.href || "#"} onClick={() => setDropdownSlug(null)}
                          className="block rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground transition hover:bg-accent/10 hover:text-accent">
                          {groupItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : !item.group && (
                  <Link key={idx} href={item.href || "#"} onClick={() => setDropdownSlug(null)}
                    className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground transition hover:bg-accent/10 hover:text-accent">
                    {item.label}
                    {item.soon && <span className="rounded bg-amber-100 px-1 py-0.5 text-[8px] font-bold uppercase text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">Soon</span>}
                  </Link>
                )
              ))}
            </div>
          ) : c && c.children && c.children.length > 0 ? (
            <>
              {c.children.map((ch) => (
                <Link key={ch.slug} href={`/categories/${ch.slug}`} onClick={() => setDropdownSlug(null)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground transition hover:bg-accent/10 hover:text-accent">
                  <span className="text-sm">{ch.icon}</span>{ch.name}
                </Link>
              ))}
              <Link href={`/categories/${slug}`} onClick={() => setDropdownSlug(null)}
                className="mt-1 block rounded-lg bg-accent/10 px-2.5 py-1.5 text-center text-[11px] font-bold text-accent">View All →</Link>
            </>
          ) : null}
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
        <div className="hidden items-center gap-0 lg:flex overflow-x-auto">
          <NavDropdown 
            label="Text Books" 
            slug="textbooks" 
            customItems={[
              { group: "Group 1", label: "Federal Board", href: "/categories/federal-board" },
              { group: "Group 1", label: "Punjab Board", href: "/categories/punjab-board" },
              { group: "Group 1", label: "Sindh Board", href: "/categories/sindh-board" },
              { group: "Group 1", label: "Balochistan Board", href: "/categories/balochistan-board" },
              { group: "Group 1", label: "KPK Board", href: "/categories/kpk-board" },
              { group: "Group 1", label: "O/A level", href: "/categories/o-a-level" },
              { group: "Group 2", label: "Oxford", href: "/categories/oxford" },
              { group: "Group 2", label: "Cambridge", href: "/categories/cambridge" },
            ]}
          />
          <NavDropdown 
            label="Notes" 
            slug="notes" 
            customItems={[
              { group: "Group 1", label: "Federal Board", href: "/categories/federal-board-notes" },
              { group: "Group 1", label: "Punjab Board", href: "/categories/punjab-board-notes" },
              { group: "Group 1", label: "Sindh Board", href: "/categories/sindh-board-notes" },
              { group: "Group 1", label: "Balochistan Board", href: "/categories/balochistan-board-notes" },
              { group: "Group 1", label: "KPK Board", href: "/categories/kpk-board-notes" },
              { group: "Group 1", label: "O/A level", href: "/categories/o-a-level-notes" },
              { group: "Group 2", label: "Cambridge International Education", href: "/categories/cambridge-international" },
              { group: "Group 2", label: "Pearson Edexcel", href: "/categories/pearson-edexcel" },
              { group: "Group 2", label: "OxfordAQA", href: "/categories/oxford-aqa" },
              { group: "Group 2", label: "City & Guilds", href: "/categories/city-guilds" },
              { group: "Group 2", label: "International Baccalaureate (IBO)", href: "/categories/ibo" },
            ]}
          />
          <NavDropdown 
            label="Online Quizzes" 
            slug="online-quizzes" 
            customItems={[
              { label: "Coming Soon", soon: true },
            ]}
          />
          <NavDropdown 
            label="Pairing Schemes" 
            slug="pairing-schemes" 
            customItems={[
              { label: "9th", href: "/categories/pairing-9th" },
              { label: "10th", href: "/categories/pairing-10th" },
              { label: "1st Year", href: "/categories/pairing-1st-year" },
              { label: "2nd Year", href: "/categories/pairing-2nd-year" },
            ]}
          />
          <NavDropdown 
            label="Result & Board News" 
            slug="results-news" 
            customItems={[
              { label: "Top Position Holders", href: "/categories/top-position-holders" },
              { label: "Result Gazette", href: "/categories/result-gazette" },
              { label: "Board Notifications", href: "/categories/board-notifications" },
              { label: "Date Sheets", href: "/categories/date-sheets" },
              { label: "Admission & Exams Schedules", href: "/categories/admission-exams" },
              { label: "Rechecking/Supplementary Information", href: "/categories/rechecking-supplementary" },
            ]}
          />
          <NavDropdown 
            label="Model & Past Papers" 
            slug="model-papers" 
            customItems={[
              { label: "9th", href: "/categories/model-9th" },
              { label: "10th", href: "/categories/model-10th" },
              { label: "1st Year", href: "/categories/model-1st-year" },
              { label: "2nd Year", href: "/categories/model-2nd-year" },
            ]}
          />
          <NavDropdown 
            label="Guess Paper & Important Topic" 
            slug="guess-papers" 
            customItems={[
              { label: "9th", href: "/categories/guess-9th" },
              { label: "10th", href: "/categories/guess-10th" },
              { label: "1st Year", href: "/categories/guess-1st-year" },
              { label: "2nd Year", href: "/categories/guess-2nd-year" },
            ]}
          />
          <NavDropdown 
            label="Test" 
            slug="test" 
            customItems={[
              { label: "9th", href: "/categories/test-9th" },
              { label: "10th", href: "/categories/test-10th" },
              { label: "1st Year", href: "/categories/test-1st-year" },
              { label: "2nd Year", href: "/categories/test-2nd-year" },
            ]}
          />
          <NavDropdown 
            label="Tuition" 
            slug="tuition" 
            customItems={[
              { label: "Malik Shahid (Maths Teacher)", href: "/categories/malik-shahid" },
              { label: "Online Academy Classes", href: "/categories/online-academy" },
              { label: "Find a Tutor", href: "/categories/find-tutor" },
              { label: "Tuition Request", href: "/categories/tuition-request" },
              { label: "Become a Tutor", href: "/categories/become-tutor" },
            ]}
          />
          <NavDropdown 
            label="Whiteboard" 
            slug="whiteboard" 
            customItems={[
              { label: "Coming Soon", soon: true },
            ]}
          />
          <NavDropdown 
            label="Test Generator" 
            slug="test-generator" 
            customItems={[
              { label: "Coming Soon", soon: true },
            ]}
          />
        </div>

        {/* Desktop right */}
        <div className="hidden items-center gap-1 md:flex">
          {/* Compact search bar */}
          <form action="/search" className="flex items-center gap-1 rounded-full border border-border bg-card px-2 py-1">
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3 shrink-0 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              name="q"
              placeholder="Search..."
              className="w-24 bg-transparent px-1 py-0.5 text-[10px] text-foreground outline-none placeholder:text-muted focus:w-32 transition-all"
            />
          </form>
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
            <ThemeToggle />
          </div>

          <MobileMenuSection title="Text Books" items={[
            { group: "Group 1", label: "Federal Board", href: "/categories/federal-board" },
            { group: "Group 1", label: "Punjab Board", href: "/categories/punjab-board" },
            { group: "Group 1", label: "Sindh Board", href: "/categories/sindh-board" },
            { group: "Group 1", label: "Balochistan Board", href: "/categories/balochistan-board" },
            { group: "Group 1", label: "KPK Board", href: "/categories/kpk-board" },
            { group: "Group 1", label: "O/A level", href: "/categories/o-a-level" },
            { group: "Group 2", label: "Oxford", href: "/categories/oxford" },
            { group: "Group 2", label: "Cambridge", href: "/categories/cambridge" },
          ]} onLink={() => setMenuOpen(false)} />
          <MobileMenuSection title="Notes" items={[
            { group: "Group 1", label: "Federal Board", href: "/categories/federal-board-notes" },
            { group: "Group 1", label: "Punjab Board", href: "/categories/punjab-board-notes" },
            { group: "Group 1", label: "Sindh Board", href: "/categories/sindh-board-notes" },
            { group: "Group 1", label: "Balochistan Board", href: "/categories/balochistan-board-notes" },
            { group: "Group 1", label: "KPK Board", href: "/categories/kpk-board-notes" },
            { group: "Group 1", label: "O/A level", href: "/categories/o-a-level-notes" },
            { group: "Group 2", label: "Cambridge International Education", href: "/categories/cambridge-international" },
            { group: "Group 2", label: "Pearson Edexcel", href: "/categories/pearson-edexcel" },
            { group: "Group 2", label: "OxfordAQA", href: "/categories/oxford-aqa" },
            { group: "Group 2", label: "City & Guilds", href: "/categories/city-guilds" },
            { group: "Group 2", label: "International Baccalaureate (IBO)", href: "/categories/ibo" },
          ]} onLink={() => setMenuOpen(false)} />
          <MobileMenuSection title="Online Quizzes" items={[{ label: "Coming Soon", soon: true }]} onLink={() => setMenuOpen(false)} />
          <MobileMenuSection title="Pairing Schemes" items={[
            { label: "9th", href: "/categories/pairing-9th" },
            { label: "10th", href: "/categories/pairing-10th" },
            { label: "1st Year", href: "/categories/pairing-1st-year" },
            { label: "2nd Year", href: "/categories/pairing-2nd-year" },
          ]} onLink={() => setMenuOpen(false)} />
          <MobileMenuSection title="Result & Board News" items={[
            { label: "Top Position Holders", href: "/categories/top-position-holders" },
            { label: "Result Gazette", href: "/categories/result-gazette" },
            { label: "Board Notifications", href: "/categories/board-notifications" },
            { label: "Date Sheets", href: "/categories/date-sheets" },
            { label: "Admission & Exams Schedules", href: "/categories/admission-exams" },
            { label: "Rechecking/Supplementary Information", href: "/categories/rechecking-supplementary" },
          ]} onLink={() => setMenuOpen(false)} />
          <MobileMenuSection title="Model & Past Papers" items={[
            { label: "9th", href: "/categories/model-9th" },
            { label: "10th", href: "/categories/model-10th" },
            { label: "1st Year", href: "/categories/model-1st-year" },
            { label: "2nd Year", href: "/categories/model-2nd-year" },
          ]} onLink={() => setMenuOpen(false)} />
          <MobileMenuSection title="Guess Paper & Important Topic" items={[
            { label: "9th", href: "/categories/guess-9th" },
            { label: "10th", href: "/categories/guess-10th" },
            { label: "1st Year", href: "/categories/guess-1st-year" },
            { label: "2nd Year", href: "/categories/guess-2nd-year" },
          ]} onLink={() => setMenuOpen(false)} />
          <MobileMenuSection title="Test" items={[
            { label: "9th", href: "/categories/test-9th" },
            { label: "10th", href: "/categories/test-10th" },
            { label: "1st Year", href: "/categories/test-1st-year" },
            { label: "2nd Year", href: "/categories/test-2nd-year" },
          ]} onLink={() => setMenuOpen(false)} />
          <MobileMenuSection title="Tuition" items={[
            { label: "Malik Shahid (Maths Teacher)", href: "/tuition/malik-shahid" },
            { label: "Online Academy Classes", href: "/tuition/online-academy" },
            { label: "Find a Tutor", href: "/tuition/find-tutor" },
            { label: "Tuition Request", href: "/tuition/request" },
            { label: "Become a Tutor", href: "/tuition/become-tutor" },
          ]} onLink={() => setMenuOpen(false)} />
          <MobileMenuSection title="Whiteboard" items={[{ label: "Coming Soon", soon: true }]} onLink={() => setMenuOpen(false)} />
          <MobileMenuSection title="Test Generator" items={[{ label: "Coming Soon", soon: true }]} onLink={() => setMenuOpen(false)} />

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

function MobileMenuSection({ title, items, onLink }: { title: string; items: Array<{ label: string; href?: string; soon?: boolean; group?: string }>; onLink: () => void }) {
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
          {items.some(item => item.group) ? (
            <div className="space-y-3">
              {items.filter(item => item.group).map((item, idx) => (
                <div key={idx}>
                  <div className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-muted">{item.group}</div>
                  <div className="space-y-0.5">
                    {items.filter(i => i.group === item.group).map((groupItem, groupIdx) => (
                      <Link key={groupIdx} href={groupItem.href || "#"} onClick={onLink}
                        className="block rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground transition hover:bg-accent/10 hover:text-accent">
                        {groupItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            items.map((item, idx) => (
              <Link key={idx} href={item.href || "#"} onClick={onLink}
                className="flex items-center justify-between rounded-lg px-3 py-1.5 text-[13px] font-medium text-foreground transition hover:bg-accent/10 hover:text-accent">
                {item.label}
                {item.soon && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">Soon</span>}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}