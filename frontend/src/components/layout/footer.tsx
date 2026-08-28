"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useLocale } from "@/lib/locale-context";
import { apiFetch } from "@/lib/api-client";
import type { NavCategory } from "@/components/portal/portal-types";

type PortalStats = { books: number; categories: number; users: number };

export function Footer() {
  const { tr } = useLocale();
  const [navCats, setNavCats] = useState<NavCategory[]>([]);
  const [stats, setStats] = useState<PortalStats | null>(null);

  useEffect(() => {
    apiFetch<{ tree: NavCategory[] }>("/api/portal/nav")
      .then((data) => setNavCats(data.tree))
      .catch(() => setNavCats([]));
    apiFetch<PortalStats>("/api/portal/stats")
      .then(setStats)
      .catch(() => {});
  }, []);

  const studyLinks = [
    { href: "/categories", label: tr("browseCategories") },
    { href: "/books", label: tr("books") },
    { href: "/model-papers", label: "Model & Past Papers" },
    { href: "/guess-papers", label: "Guess Papers" },
    { href: "/tuition", label: "Tuition" },
    { href: "/upload", label: tr("uploadTitle") },
  ];

  const companyLinks = [
    { href: "/about", label: tr("about") },
    { href: "/contact", label: tr("contact") },
    { href: "/privacy", label: tr("privacy") },
    { href: "/terms", label: tr("terms") },
    { href: "/copyright", label: tr("copyright") },
  ];

  return (
    <footer className="border-t border-[#182333] bg-[#182333] text-slate-300 print:hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="font-serif text-2xl font-black tracking-tight text-white">
            BoardNotes
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">{tr("footerTagline")}</p>
          {stats && (
            <div className="mt-4 flex gap-4">
              <div>
                <p className="text-lg font-black text-white">{stats.books}</p>
                <p className="text-[10px] font-semibold uppercase text-slate-500">Resources</p>
              </div>
              <div>
                <p className="text-lg font-black text-white">{stats.categories}</p>
                <p className="text-[10px] font-semibold uppercase text-slate-500">Categories</p>
              </div>
              <div>
                <p className="text-lg font-black text-white">{stats.users}</p>
                <p className="text-[10px] font-semibold uppercase text-slate-500">Users</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-200">Study</h3>
          <ul className="space-y-2.5 text-sm">
            {studyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-slate-400 transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-200">
            Categories
          </h3>
          <ul className="space-y-2.5 text-sm">
            {navCats.slice(0, 8).map((cat) => (
              <li key={cat.slug}>
                <Link href={`/categories/${cat.slug}`} className="text-slate-400 transition hover:text-white">
                  {cat.icon} {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-200">Company</h3>
          <ul className="space-y-2.5 text-sm">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-slate-400 transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} BoardNotes • {tr("footerTagline")}
        </div>
      </div>
    </footer>
  );
}