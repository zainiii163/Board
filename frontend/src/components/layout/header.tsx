"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/search", label: "Search" },
  { href: "/books", label: "Books" },
  { href: "/past-papers", label: "Past Papers" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-[#DED8CA] bg-[#F5F0E4] pt-4 sm:pt-6">
      <nav className="mx-auto w-full max-w-[1100px] px-4 pb-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#087F72] text-[17px] font-bold text-white">
              B
            </span>
            <div className="flex flex-col justify-center">
              <span className="font-serif text-[22px] leading-none text-[#182333]">BoardNotes</span>
              <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#6F6F68]">Study, Clearly</span>
            </div>
          </Link>

          <div className="ml-6 hidden items-center gap-6 lg:ml-10 lg:gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-semibold text-[#182333] transition hover:text-[#087F72]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto hidden md:block">
            <Link
              href="/fbise"
              className="rounded-full bg-[#087F72] px-6 py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-[#06665B]"
            >
              Explore FBISE
            </Link>
          </div>

          <button
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DED8CA] text-[#182333] md:hidden"
          >
            <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
            <span className="flex flex-col gap-1.5" aria-hidden="true">
              <span className="h-0.5 w-5 bg-current" />
              <span className="h-0.5 w-5 bg-current" />
              <span className="h-0.5 w-5 bg-current" />
            </span>
          </button>
        </div>

        {isMenuOpen && (
          <div id="mobile-navigation" className="mt-4 border-t border-[#DED8CA] pt-3 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#182333] hover:bg-[#FCF9F1] hover:text-[#087F72]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/fbise"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 rounded-full bg-[#087F72] px-6 py-2.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-[#06665B]"
              >
                Explore FBISE
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
