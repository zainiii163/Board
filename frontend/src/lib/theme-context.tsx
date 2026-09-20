"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

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

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { tr } = useLocale();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-card"
      aria-label="Toggle dark mode"
    >
      {theme === "light" ? tr("dark") : tr("light")}
    </button>
  );
}
