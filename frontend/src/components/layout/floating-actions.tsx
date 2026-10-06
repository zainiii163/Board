"use client";

import { ThemeToggle } from "@/lib/theme-context";

/**
 * Dark mode floats on the left edge of the viewport (like the WhatsApp button
 * does on the right) instead of taking up room in the navbar.
 */
export function FloatingActions() {
  return (
    <div className="fixed bottom-24 left-4 z-[9999] print:hidden lg:bottom-5 lg:left-5">
      <ThemeToggle className="h-11 w-11 shadow-lg" />
    </div>
  );
}
