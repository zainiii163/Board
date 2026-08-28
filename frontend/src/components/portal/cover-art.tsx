const GRADIENT_POOL = [
  "from-sky-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-fuchsia-500 to-purple-600",
  "from-cyan-500 to-sky-600",
  "from-violet-500 to-purple-700",
  "from-slate-600 to-slate-800",
];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function coverGradient(value: string) {
  return GRADIENT_POOL[hashString(value) % GRADIENT_POOL.length];
}

export function coverInitial(title: string) {
  const clean = title.replace(/^(9th|10th|11th|12th|Class|Textbook)\s+/gi, "").trim();
  const letter = clean.charAt(0);
  return /[a-zA-Z0-9]/.test(letter) ? letter.toUpperCase() : "📘";
}

export function coverLabel(title: string) {
  const clean = title
    .replace(/^(9th|10th|11th|12th)\s+Class\s*/gi, "")
    .replace(/\s+(PDF|Notes|Book|Guide|Papers?|Scheme|Tests?|MCQs|Bank|Worksheets?)$/gi, "");
  return clean.trim();
}

type CoverArtProps = {
  title: string;
  gradient?: string;
  className?: string;
};

export function CoverArt({ title, gradient, className = "" }: CoverArtProps) {
  const gradientClass = gradient ?? coverGradient(title);
  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden bg-gradient-to-br ${gradientClass} p-4 text-white ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur">
          PDF
        </span>
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      </div>
      <div>
        <div className="text-3xl leading-none">{coverInitial(title)}</div>
        <p className="mt-2 line-clamp-2 text-xs font-bold leading-snug drop-shadow">{coverLabel(title)}</p>
      </div>
      <div className="pointer-events-none absolute -bottom-5 -right-4 text-[72px] font-serif text-white/10">
        {coverInitial(title)}
      </div>
    </div>
  );
}