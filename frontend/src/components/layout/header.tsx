"use client";

import Link from "next/link";
import { useState } from "react";

import { ThemeToggle } from "@/lib/theme-context";
import { LocaleToggle, useLocale } from "@/lib/locale-context";
import { useAuth } from "@/lib/auth-context";
import { BoardSwitcher } from "@/components/layout/board-switcher";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, isStaff, signOut } = useAuth();
  const { tr } = useLocale();

  const navLinks = [
    { href: "/search", label: tr("search") },
    { href: "/books", label: tr("books") },
    { href: "/past-papers", label: tr("pastPapers") },
    { href: "/formulas", label: tr("formulasHub") },
    { href: "/authors", label: tr("authors") },
    { href: "/about", label: tr("about") },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 pt-4 backdrop-blur sm:pt-6 print:hidden">
      <nav className="mx-auto w-full max-w-[1100px] px-4 pb-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full bg-accent text-[17px] font-bold text-white">
              B
            </span>
            <div className="flex flex-col justify-center">
              <span className="font-serif text-[22px] leading-none text-foreground">BoardNotes</span>
              <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-muted">{tr("tagline")}</span>
            </div>
          </Link>

          <div className="ml-6 hidden items-center gap-6 lg:ml-10 lg:gap-8 md:flex">
            <BoardSwitcher />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-semibold text-foreground transition hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <LocaleToggle />
            <ThemeToggle />
            {!loading && user ? (
              <>
                {isStaff && (
                  <Link href="/admin" className="text-[13px] font-semibold text-accent hover:underline">
                    {tr("admin")}
                  </Link>
                )}
                <Link
                  href="/account"
                  className="rounded-full border border-border px-4 py-2 text-[13px] font-semibold text-foreground hover:bg-card"
                >
                  {user.name.split(" ")[0]}
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="text-[13px] font-semibold text-muted hover:text-foreground"
                >
                  {tr("signOut")}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[13px] font-semibold text-foreground hover:text-accent">
                  {tr("signIn")}
                </Link>
                <Link
                  href="/#boards"
                  className="rounded-full bg-accent px-6 py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:opacity-90"
                >
                  {tr("exploreBoards")}
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground md:hidden"
          >
            <span className="flex flex-col gap-1.5" aria-hidden="true">
              <span className="h-0.5 w-5 bg-current" />
              <span className="h-0.5 w-5 bg-current" />
              <span className="h-0.5 w-5 bg-current" />
            </span>
          </button>
        </div>

        {isMenuOpen && (
          <div id="mobile-navigation" className="mt-4 border-t border-border pt-3 md:hidden">
            <div className="mb-3 flex gap-2">
              <LocaleToggle />
              <ThemeToggle />
            </div>
            <div className="flex flex-col gap-1">
              <Link
                href="/#boards"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-card hover:text-accent"
              >
                {tr("boardsSection")}
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-card hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
              {!loading && user ? (
                <>
                  <Link href="/account" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium">
                    {tr("myAccount")}
                  </Link>
                  {isStaff && (
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium">
                      {tr("admin")}
                    </Link>
                  )}
                  <button type="button" onClick={signOut} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted">
                    {tr("signOut")}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium">
                    {tr("signIn")}
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium">
                    {tr("signUp")}
                  </Link>
                </>
              )}
              <Link
                href="/#boards"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 rounded-full bg-accent px-6 py-2.5 text-center text-sm font-bold text-white"
              >
                {tr("exploreBoards")}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
