"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FileStack, FolderTree } from "lucide-react";

import { useLocale } from "@/lib/locale-context";
import { HoverCard } from "@/components/motion/hover-card";
import { type PortalCategory } from "@/components/portal/portal-types";

export function CategoryCard({ category, index = 0 }: { category: PortalCategory; index?: number }) {
  const { tr } = useLocale();
  const reduceMotion = useReducedMotion();
  const childCount = category.children?.length ?? 0;

  return (
    <HoverCard className="h-full" lift={6}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        <Link
          href={`/categories/${category.slug}`}
          className="group border-gradient glass-card relative flex h-full flex-col items-start gap-3 overflow-hidden rounded-2xl p-5 transition-shadow duration-300 hover:shadow-lift"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-md shadow-accent/25 transition-transform duration-300 group-hover:scale-110">
            {childCount > 0 ? (
              <FolderTree className="h-5 w-5" aria-hidden="true" />
            ) : (
              <FileStack className="h-5 w-5" aria-hidden="true" />
            )}
          </span>

          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
            {childCount > 0 ? `${childCount} ${tr("resourcesCount")}` : "PDF"}
          </span>

          <h3 className="text-lg font-bold leading-tight text-foreground transition-colors duration-200 group-hover:text-accent">
            {category.name}
          </h3>

          {childCount > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {(category.children ?? []).slice(0, 4).map((child) => (
                <span
                  key={child.slug}
                  className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 text-[11px] font-medium text-muted transition group-hover:text-foreground/80"
                >
                  {child.name}
                </span>
              ))}
            </div>
          )}
        </Link>
      </motion.div>
    </HoverCard>
  );
}
