"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HardDriveDownload } from "lucide-react";

interface DriveLinkButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function DriveLinkButton({ href, label = "Open in Drive", className = "" }: DriveLinkButtonProps) {
  const reduceMotion = useReducedMotion();
  const isValidLink = Boolean(href) && (href.includes("drive.google.com") || href.includes("docs.google.com"));

  if (!isValidLink) {
    return (
      <div
        className={`relative inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-border bg-muted px-4 py-3 text-sm font-semibold text-muted ${className}`}
        aria-disabled="true"
      >
        <HardDriveDownload className="h-4 w-4" aria-hidden="true" />
        {label}
      </div>
    );
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`pressable inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent transition hover:bg-accent/20 hover:shadow-md hover:shadow-accent/20 ${className}`}
      whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
    >
      <HardDriveDownload className="h-4 w-4" aria-hidden="true" />
      {label}
    </motion.a>
  );
}
