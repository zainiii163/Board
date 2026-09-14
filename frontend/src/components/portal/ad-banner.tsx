type AdSize = "banner" | "leaderboard" | "sidebar" | "inline" | "mobile-banner";

const SIZES: Record<AdSize, { width: string; height: string; label: string }> = {
  banner: { width: "468px", height: "60px", label: "468×60 Banner" },
  leaderboard: { width: "728px", height: "90px", label: "728×90 Leaderboard" },
  sidebar: { width: "300px", height: "250px", label: "300×250 Sidebar" },
  inline: { width: "100%", height: "90px", label: "Responsive Inline" },
  "mobile-banner": { width: "100%", height: "50px", label: "320×50 Mobile" },
};

export function AdBanner({ size = "inline", className = "", label }: { size?: AdSize; className?: string; label?: string }) {
  const s = SIZES[size];

  return (
    <div className={`relative overflow-hidden rounded-xl border border-dashed border-border bg-card/50 ${className}`}
      style={{ maxWidth: s.width, minHeight: s.height }}>
      <div className="flex h-full min-h-[inherit] flex-col items-center justify-center gap-1 p-3 text-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted/60">{label ?? "Advertisement"}</span>
        <span className="text-xs text-muted/40">{s.label}</span>
        {/* Replace this div with your ad code (Google AdSense, etc.) */}
        <div className="absolute inset-0 flex items-center justify-center text-muted/20">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function AdSenseBanner({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-4 ${className ?? ""}`}>
      {/* 
        Replace with real AdSense code:
        <ins className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXX"
          data-ad-slot="XXXX"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
      */}
      <div className="relative flex h-[90px] w-full max-w-[728px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-card/30">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted/40">Advertisement</span>
      </div>
    </div>
  );
}