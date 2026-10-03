"use client";

import { useState } from "react";

interface DriveLinkButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function DriveLinkButton({ href, label = "Open in Drive", className = "" }: DriveLinkButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isValidLink = Boolean(href) && (href.includes("drive.google.com") || href.includes("docs.google.com"));

  if (!isValidLink) {
    return (
      <div
        className={`relative inline-flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-3 text-sm font-semibold text-muted ${className}`}
        aria-disabled="true"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M12.01 1.485c0 0-5.304 1.5-7.673 2.236C3.23 3.96 2.5 4.81 2.5 5.82v10.36c0 1.01.73 1.86 1.837 2.099 2.369.736 7.673 2.236 7.673 2.236s5.304-1.5 7.673-2.236c1.107-.239 1.837-1.089 1.837-2.099V5.82c0-1.01-.73-1.86-1.837-2.099-2.369-.736-7.673-2.236-7.673-2.236zM12 17.5l-5-2.5v-5l5 2.5v5zm0-6.5l-5-2.5 5-2.5 5 2.5-5 2.5zm5 4l-5 2.5v-5l5-2.5v5z" />
        </svg>
        {label}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent transition hover:bg-accent/20 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M12.01 1.485c0 0-5.304 1.5-7.673 2.236C3.23 3.96 2.5 4.81 2.5 5.82v10.36c0 1.01.73 1.86 1.837 2.099 2.369.736 7.673 2.236 7.673 2.236s5.304-1.5 7.673-2.236c1.107-.239 1.837-1.089 1.837-2.099V5.82c0-1.01-.73-1.86-1.837-2.099-2.369-.736-7.673-2.236-7.673-2.236zM12 17.5l-5-2.5v-5l5 2.5v5zm0-6.5l-5-2.5 5-2.5 5 2.5-5 2.5zm5 4l-5 2.5v-5l5-2.5v5z" />
      </svg>
      {label}
    </a>
  );
}
