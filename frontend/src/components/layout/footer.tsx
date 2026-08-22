"use client";

import Link from "next/link";

import { useLocale } from "@/lib/locale-context";

export function Footer() {
  const { tr } = useLocale();

  const links = [
    { href: "/authors", label: tr("authors") },
    { href: "/about", label: tr("about") },
    { href: "/contact", label: tr("contact") },
    { href: "/privacy", label: tr("privacy") },
    { href: "/terms", label: tr("terms") },
    { href: "/copyright", label: tr("copyright") },
  ];

  return (
    <footer className="border-t border-[#182333] bg-[#182333] text-slate-300 print:hidden">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="text-lg font-black tracking-tight text-white">BoardNotes</div>
          <p className="mt-2 text-sm text-slate-400">{tr("footerTagline")}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
