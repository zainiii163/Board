"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useLocale } from "@/lib/locale-context";
import { apiFetch } from "@/lib/api-client";
import type { NavCategory } from "@/components/portal/portal-types";
import { WHATSAPP_CHAT_URL, WHATSAPP_CHANNEL_URL, YOUTUBE_CHANNEL_URL } from "@/lib/constants";

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

  const boardLinks = [
    { href: "/fbise", label: "Federal Board" },
    { href: "/punjab", label: "Punjab Board" },
    { href: "/apsacs", label: "APSACS" },
    { href: "/o-level", label: "O Level" },
    { href: "/a-level", label: "A Level" },
    { href: "/oxford", label: "Oxford" },
    { href: "/cambridge", label: "Cambridge" },
  ];

  const companyLinks = [
    { href: "/about", label: tr("about") },
    { href: "/contact", label: tr("contact") },
    { href: "/privacy", label: tr("privacy") },
    { href: "/terms", label: tr("terms") },
    { href: "/copyright", label: tr("copyright") },
    { href: WHATSAPP_CHAT_URL, label: tr("joinWhatsApp"), external: true },
  ];

  return (
    <footer className="border-t border-[#182333] bg-[#182333] text-slate-300 print:hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-block font-serif text-2xl font-black tracking-tight text-white transition-all duration-300 hover:text-accent hover:scale-105">
            BoardNotes
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">{tr("footerTagline")}</p>
          {stats && (
            <div className="mt-5 flex gap-5">
              {[
                { value: stats.books, label: "Resources" },
                { value: stats.categories, label: "Categories" },
                { value: stats.users, label: "Users" },
              ].map((stat) => (
                <div key={stat.label} className="group cursor-default">
                  <p className="text-lg font-black text-white transition-colors duration-200 group-hover:text-accent">{stat.value}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 transition-colors duration-200 group-hover:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-200">Study</h3>
          <ul className="space-y-2.5 text-sm">
            {studyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-block transition-all duration-300 hover:text-white hover:translate-x-1.5 text-slate-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-200">Boards</h3>
          <ul className="space-y-2.5 text-sm">
            {boardLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-block transition-all duration-300 hover:text-white hover:translate-x-1.5 text-slate-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-200">Categories</h3>
          <ul className="space-y-2.5 text-sm">
            {navCats.slice(0, 8).map((cat) => (
              <li key={cat.slug}>
                <Link href={`/categories/${cat.slug}`} className="inline-block transition-all duration-300 hover:text-white hover:translate-x-1.5 text-slate-400">
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
                <Link
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-block transition-all duration-300 hover:text-white hover:translate-x-1.5 text-slate-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Essential Links Section */}
      <div className="border-t border-white/10 bg-[#0f1729]">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex flex-wrap gap-4">
              <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/copyright" className="hover:text-white transition-colors">Copyright</Link>
            </div>
            <div className="flex items-center gap-4">
              {/* Social Media Icons */}
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center hover:text-white transition-colors"
                aria-label="YouTube Channel"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <span className="text-slate-500">National Curriculum 2026–27</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-500">Session: {new Date().getFullYear()}–{new Date().getFullYear() + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Join Our WhatsApp CTA */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
          <div>
            <p className="text-base font-bold text-white">Join Our WhatsApp Channel</p>
            <p className="mt-1 text-sm text-slate-400">{tr("whatsAppChannel")}</p>
          </div>
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shine-on-hover inline-flex shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#25D366]/25"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.83c2.16 0 4.19.84 5.72 2.37a8.04 8.04 0 0 1 2.37 5.72c0 4.46-3.63 8.08-8.09 8.08-1.49 0-2.94-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.03 8.03 0 0 1-1.24-4.28c0-4.46 3.63-8.08 8.09-8.08Z" />
            </svg>
            {tr("joinWhatsApp")}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-2">
            <p>© {new Date().getFullYear()} BoardNotes · {tr("footerTagline")}</p>
            <p className="text-slate-600">All educational materials are provided for educational purposes only. Please respect copyright laws.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
