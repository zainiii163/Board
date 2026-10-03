"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, Home, LayoutGrid, Search, Upload } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/fbise", label: "Boards", icon: LayoutGrid },
  { href: "/past-papers", label: "Papers", icon: FileText },
  { href: "/search", label: "Search", icon: Search },
  { href: "/upload", label: "Upload", icon: Upload },
];

/**
 * Thumb-friendly bottom navigation for phones. Hidden from `lg` up where the
 * full header navigation is available.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <nav
      aria-label="Primary"
      className="glass-bar fixed inset-x-0 bottom-0 z-40 border-t border-border/70 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_28px_-12px_rgba(15,23,42,0.35)] print:hidden lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2 py-1.5">
        {TABS.map((tab) => {
          const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className="pressable relative flex flex-col items-center gap-1 rounded-xl px-1 py-1.5"
              >
                {isActive && (
                  <motion.span
                    layoutId="mobile-tab-active"
                    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-xl bg-accent/10 ring-1 ring-accent/30"
                  />
                )}
                <Icon
                  className={`relative h-[18px] w-[18px] ${isActive ? "text-accent" : "text-muted"}`}
                  aria-hidden="true"
                />
                <span
                  className={`relative text-[10px] font-bold tracking-tight ${
                    isActive ? "text-accent" : "text-muted"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
