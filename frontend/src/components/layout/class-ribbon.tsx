"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ClassRibbonProps = {
  board: string;
  classes: { slug: string; title: string }[];
  activeClass?: string;
};

export function ClassRibbon({ board, classes, activeClass }: ClassRibbonProps) {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-16 z-40 -mx-4 flex flex-wrap gap-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      aria-label="Class selector"
    >
      {classes.map((klass) => {
        const isActive = activeClass === klass.slug || pathname.includes(`/${klass.slug}`);
        return (
          <Link
            key={klass.slug}
            href={`/${board}/${klass.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
              isActive
                ? "border-accent bg-accent text-white shadow-sm"
                : "border-border bg-card text-foreground hover:border-accent/50 hover:text-accent"
            }`}
          >
            {klass.title}
          </Link>
        );
      })}
    </nav>
  );
}
