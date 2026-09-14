"use client";

import { useState } from "react";

interface DriveLinkButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function DriveLinkButton({ href, label = "Open in Drive", className = "" }: DriveLinkButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Check if the link is potentially valid
  const isValidLink = href && (href.includes("drive.google.com") || href.includes("docs.google.com"));

  const handleClick = (e: React.MouseEvent) => {
    if (!isValidLink) {
      e.preventDefault();
      return;
    }
    window.open(href, "_blank");
  };

  return (
    <div
      className={`relative inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
        isValidLink
          ? "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 cursor-pointer"
          : "border-border bg-muted text-muted cursor-not-allowed"
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M12.01 1.485c0 0-5.304 1.5-7.673 2.236C3.23 3.96 2.5 4.81 2.5 5.82v10.36c0 1.01.73 1.86 1.837 2.099 2.369.736 7.673 2.236 7.673 2.236s5.304-1.5 7.673-2.236c1.107-.239 1.837-1.089 1.837-2.099V5.82c0-1.01-.73-1.86-1.837-2.099-2.369-.736-7.673-2.236-7.673-2.236zM12 17.5l-5-2.5v-5l5 2.5v5zm0-6.5l-5-2.5 5-2.5 5 2.5-5 2.5zm5 4l-5 2.5v-5l5-2.5v5z"/>
      </svg>
      {label}
      
      {/* Cross icon overlay for non-functional links */}
      {!isValidLink && isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </div>
      )}
    </div>
  );
}