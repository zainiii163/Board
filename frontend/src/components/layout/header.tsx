"use client";

import Link from "next/link";
import { useState, useRef, useCallback, useEffect } from "react";

import { ThemeToggle } from "@/lib/theme-context";
import { useLocale } from "@/lib/locale-context";
import { useAuth } from "@/lib/auth-context";
import { BoardsMenu } from "@/components/layout/boards-menu";
import { WHATSAPP_CHANNEL_URL } from "@/lib/constants";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.83c2.16 0 4.19.84 5.72 2.37a8.04 8.04 0 0 1 2.37 5.72c0 4.46-3.63 8.08-8.09 8.08-1.49 0-2.94-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.03 8.03 0 0 1-1.24-4.28c0-4.46 3.63-8.08 8.09-8.08Zm-2.85 4.02c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1 0 1.23.9 2.43 1.03 2.6.13.17 1.77 2.71 4.3 3.8 2.1.9 2.53.72 2.99.68.46-.05 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.17-.46-.29-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.17-.28.19-.52.06-.24-.12-1-.37-1.9-1.17-.7-.62-1.17-1.39-1.31-1.63-.16-.24-.02-.37.12-.49.13-.13.28-.35.42-.53.14-.17.19-.29.28-.49.1-.19.05-.36-.02-.5-.06-.13-.52-1.28-.73-1.76-.16-.4-.36-.37-.54-.38h-.46Z" />
    </svg>
  );
}

type DropdownItem = { label: string; href: string };
type DropdownGroup = { heading?: string; items: DropdownItem[] };
type DropdownDef = { label: string; groups: DropdownGroup[]; soon?: boolean };

const CORE_NAV: DropdownDef[] = [
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
];

const MORE_NAV: DropdownDef[] = [
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

const MOBILE_BOARDS = [
  { slug: "fbise", label: "Federal Board" },
  { slug: "punjab", label: "Punjab Board" },
  { slug: "sindh", label: "Sindh Board" },
  { slug: "balochistan", label: "Balochistan Board" },
  { slug: "kpk", label: "KPK Board" },
  { slug: "oxford", label: "Oxford Board" },
  { slug: "cambridge", label: "Cambridge Board" },
];

const ALL_NAV = [...CORE_NAV, ...MORE_NAV];

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
      <Link href={`/${slug}`} className="nav-link">
        {item.label}
        <span className="soon-badge">Soon</span>
      </Link>
    );
  }

  return (
    <div className="nav-item" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button type="button" className={`nav-link ${isOpen ? "nav-link-active" : ""}`}>
        {item.label}
        <svg viewBox="0 0 24 24" className={`h-2.5 w-2.5 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {isOpen && (
        <div className="dropdown-panel" onMouseEnter={onFocused} onMouseLeave={onClose}>
          {item.groups.map((g, gi) => (
            <div key={gi}>
              {g.heading && <div className="dropdown-heading">{g.heading}</div>}
              {g.items.map((itm) => (
                <Link key={itm.href} href={itm.href} onClick={() => onClose()} className="dropdown-item">
                  {itm.label}
                </Link>
              ))}
              {gi < item.groups.length - 1 && <div className="dropdown-divider" />}
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

  const openDropdown = useCallback((slug: string) => { clearClose(); setDropdownSlug(slug); setMoreOpen(false); }, [clearClose]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{`
        .nav-link {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 6px 8px; border-radius: 6px;
          font-size: 12px; font-weight: 600; white-space: nowrap;
          color: var(--foreground); transition: all 0.15s;
        }
        .nav-link:hover, .nav-link-active { background: var(--accent); background: oklch(from var(--accent) l c h / 0.08); color: var(--accent); }
        .soon-badge {
          background: oklch(0.85 0.15 80); color: oklch(0.45 0.15 75);
          padding: 1px 5px; border-radius: 4px; font-size: 9px; font-weight: 700;
          text-transform: uppercase; line-height: 1.3;
        }
        .nav-item { position: relative; }
        .dropdown-panel {
          position: absolute; left: 50%; top: 100%; transform: translateX(-50%);
          z-index: 50; min-width: 220px; margin-top: 4px;
          background: var(--card); border: 1px solid var(--border);
          border-radius: 12px; padding: 6px; box-shadow: 0 10px 40px oklch(0 0 0 / 0.12);
        }
        .dropdown-heading {
          padding: 4px 10px 2px; font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted);
        }
        .dropdown-item {
          display: block; padding: 6px 10px; border-radius: 8px;
          font-size: 13px; font-weight: 500; color: var(--foreground);
          transition: all 0.12s;
        }
        .dropdown-item:hover { background: oklch(from var(--accent) l c h / 0.08); color: var(--accent); transform: translateX(2px); }
        .dropdown-divider { margin: 4px 0; border-top: 1px solid var(--border); }
        .more-panel {
          position: absolute; right: 0; top: 100%; z-index: 50;
          min-width: 240px; margin-top: 4px;
          background: var(--card); border: 1px solid var(--border);
          border-radius: 12px; padding: 6px; box-shadow: 0 10px 40px oklch(0 0 0 / 0.12);
        }
        .more-panel .dropdown-item:hover .submenu-icon { opacity: 1; }
        .submenu-icon { opacity: 0; transition: opacity 0.15s; }
        .sub-panel {
          position: absolute; left: 100%; top: -6px; margin-left: 4px;
          min-width: 200px; background: var(--card); border: 1px solid var(--border);
          border-radius: 12px; padding: 6px; box-shadow: 0 10px 40px oklch(0 0 0 / 0.12);
          display: none;
        }
        .has-sub:hover .sub-panel { display: block; }
      `}</style>
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur print:hidden">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-1.5 sm:px-5 lg:px-8" aria-label="Main">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2 group/logo">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white transition-transform group-hover/logo:scale-110">B</span>
            <span className="hidden font-serif text-lg font-bold text-foreground group-hover/logo:text-accent transition-colors sm:block">BoardNotes</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-0 xl:flex">
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
            <div className="nav-item" ref={moreRef} onMouseEnter={() => { clearClose(); setMoreOpen(true); setDropdownSlug(null); }} onMouseLeave={() => scheduleClose()}>
              <button type="button" className={`nav-link ${moreOpen ? "nav-link-active" : ""}`}>
                More
                <svg viewBox="0 0 24 24" className={`h-2.5 w-2.5 transition-transform duration-150 ${moreOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              {moreOpen && (
                <div className="more-panel" onMouseEnter={clearClose} onMouseLeave={() => scheduleClose()}>
                  {MORE_NAV.map((item) => {
                    const slug = item.label.toLowerCase().replace(/[^a-z]/g, "-");
                    if (item.soon) {
                      return (
                        <Link key={slug} href={`/${slug}`} onClick={() => setMoreOpen(false)} className="dropdown-item" style={{ justifyContent: "space-between", display: "flex" }}>
                          {item.label}
                          <span className="soon-badge">Soon</span>
                        </Link>
                      );
                    }
                    return (
                      <div key={slug} className="has-sub relative">
                        <div className="dropdown-item" style={{ justifyContent: "space-between", display: "flex", cursor: "default" }}>
                          {item.label}
                          <svg viewBox="0 0 24 24" className="submenu-icon h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                        <div className="sub-panel">
                          {item.groups.map((g, gi) => (
                            <div key={gi}>
                              {g.heading && <div className="dropdown-heading">{g.heading}</div>}
                              {g.items.map((itm) => (
                                <Link key={itm.href} href={itm.href} onClick={() => setMoreOpen(false)} className="dropdown-item">
                                  {itm.label}
                                </Link>
                              ))}
                              {gi < item.groups.length - 1 && <div className="dropdown-divider" />}
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
            <form action="/search" role="search" className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 md:flex focus-within:border-accent transition-colors">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <input name="q" autoComplete="off" placeholder={locale === "ur" ? "تلاش…" : "Search…"} aria-label={tr("search")} className="w-20 bg-transparent text-[11px] font-medium text-foreground outline-none placeholder:text-muted focus:w-28 transition-all" />
            </form>
            <button type="button" onClick={() => {}} className="rounded-lg px-2 py-1.5 text-[11px] font-semibold text-muted transition hover:text-foreground" title="Toggle language">
              {locale === "en" ? "اردو" : "EN"}
            </button>
            <ThemeToggle />
            {!loading && user ? (
              <>
                {isStaff && <Link href="/admin" className="hidden rounded-lg px-2 py-1.5 text-[11px] font-semibold text-accent hover:bg-accent/10 transition lg:inline-block">Admin</Link>}
                <Link href="/account" className="hidden rounded-full border border-border px-3 py-1 text-[11px] font-semibold text-foreground hover:bg-card transition sm:inline-block">{user.name.split(" ")[0]}</Link>
              </>
            ) : (
              <Link href="/login" className="rounded-full bg-accent px-4 py-1.5 text-[11px] font-bold text-white shadow-sm hover:shadow-md hover:shadow-accent/20 transition-all">{tr("signUp")}</Link>
            )}
            <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm hover:shadow-md hover:shadow-[#25D366]/20 transition-all md:inline-flex">
              <WhatsAppIcon />
              Join WhatsApp
            </a>
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
            <div className="mb-1 mt-3 flex items-center gap-2">
              <button type="button" onClick={() => {}} className="rounded-lg border border-border px-2.5 py-1.5 text-[12px] font-semibold text-muted transition hover:text-foreground">{locale === "en" ? "اردو" : "EN"}</button>
              <ThemeToggle />
            </div>
            <div className="mb-1 mt-3 px-1 text-[10px] font-bold uppercase tracking-wider text-muted">{tr("boards")}</div>
            <div className="grid grid-cols-2 gap-1">
              {MOBILE_BOARDS.map((b) => (
                <Link key={b.slug} href={`/${b.slug}`} onClick={() => setMenuOpen(false)} className="rounded-lg border border-border px-3 py-2 text-[13px] font-semibold text-foreground transition hover:border-accent hover:bg-accent/10 hover:text-accent">
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
                  <Link href="/account" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium">{user.name}</Link>
                  {isStaff && <Link href="/admin" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-accent">{tr("admin")}</Link>}
                  <button type="button" onClick={() => { signOut(); setMenuOpen(false); }} className="rounded-lg px-3 py-2 text-left text-sm font-medium text-muted">{tr("signOut")}</button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-full bg-accent px-5 py-2.5 text-center text-sm font-bold text-white">{tr("signUp")} / {tr("signIn")}</Link>
              )}
              <Link href="/upload" onClick={() => setMenuOpen(false)} className="mt-2 block rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-center text-sm font-bold text-accent">{tr("uploadTitle")}</Link>
              <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-center text-sm font-bold text-white">
                <WhatsAppIcon />
                {tr("joinWhatsApp")}
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function MobileSection({ item, onLink }: { item: DropdownDef; onLink: () => void }) {
  const [open, setOpen] = useState(false);

  if (item.soon) {
    return (
      <Link href={`/${item.label.toLowerCase().replace(/[^a-z]/g, "-")}`} onClick={onLink} className="mb-0.5 flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-accent/10">
        {item.label}
        <span className="soon-badge">Soon</span>
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
