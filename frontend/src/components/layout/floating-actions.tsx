"use client";

import Link from "next/link";
import { Search, Upload } from "lucide-react";

import { useLocale } from "@/lib/locale-context";
import { ThemeToggle } from "@/lib/theme-context";

/**
 * Floating utility cluster that travels with the page (like the WhatsApp
 * button), instead of crowding the top navbar. Search, theme, and upload are
 * small round actions stacked just above the WhatsApp button.
 */
export function FloatingActions() {
  const { tr } = useLocale();

  return (
    <div className="fixed bottom-40 right-4 z-[9999] flex flex-col items-center gap-2.5 print:hidden lg:bottom-[4.5rem] lg:right-5">
      <Link
        href="/search"
        aria-label={tr("search")}
        className="pressable flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition hover:border-accent/50 hover:text-accent"
      >
        <Search className="h-4.5 w-4.5" aria-hidden="true" />
      </Link>
      <ThemeToggle className="h-11 w-11 shadow-lg" />
      <Link
        href="/upload"
        aria-label={tr("uploadTitle")}
        title={tr("uploadTitle")}
        className="pressable flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg shadow-accent/30 transition hover:shadow-xl hover:shadow-accent/40"
      >
        <Upload className="h-4.5 w-4.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
