"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { useLocale } from "@/lib/locale-context";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("boardnotes_theme") as Theme | null;
    // Applying the persisted theme on mount must stay synchronous (pre-paint) to
    // avoid a light-mode flash for dark-mode users.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("boardnotes_theme", theme);
    document.cookie = `boardnotes_theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  }, [theme]);

  // Opt into smooth theme colour transitions only after first paint, so the
  // initial render never animates.
  useEffect(() => {
    const id = window.setTimeout(() => {
      document.documentElement.classList.add("theme-ready");
    }, 120);
    return () => window.clearTimeout(id);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { tr } = useLocale();
  const reduceMotion = useReducedMotion();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? tr("light") : tr("dark")}
      title={isDark ? tr("light") : tr("dark")}
      className={`pressable focus-ring relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-border bg-card/70 text-foreground shadow-sm backdrop-blur-md transition-colors hover:border-accent/50 hover:bg-accent/10 hover:text-accent ${className}`}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={theme}
          initial={reduceMotion ? false : { opacity: 0, rotate: -70, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, rotate: 70, scale: 0.6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex"
        >
          {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
