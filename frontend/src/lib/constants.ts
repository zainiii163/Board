export const SITE_NAME = "BoardNotes";
export const DEFAULT_BOARD = "fbise";
export const SUPPORTED_BOARDS = ["fbise", "punjab", "kpk", "sindh", "apsacs"] as const;

// WhatsApp Contact/Chat - Direct chat with phone number
export const WHATSAPP_CHAT_URL = "https://wa.me/923017521835";

// WhatsApp Channel - Join channel link
const RAW_WA = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL ?? "https://whatsapp.com/channel/0029Vb5PkniD38CY2Nks972r";
const isAbsoluteUrl = (u: string) => /^https?:\/\//i.test(u);
export const WHATSAPP_CHANNEL_URL = isAbsoluteUrl(RAW_WA) ? RAW_WA : "https://whatsapp.com/channel/join";

// YouTube Channel
export const YOUTUBE_CHANNEL_URL = "https://youtube.com/@mathwithmalikshahid?si=dfkdLMiUZobg6I5p";

export const NAV_BOARDS = [
  { slug: "fbise", label: "Federal Board" },
  { slug: "punjab", label: "Punjab Board" },
  // Punjab Board examination authorities — same scheme/textbooks, own papers.
  { slug: "lahore", label: "Lahore Board" },
  { slug: "d-g-khan", label: "D.G. Khan Board" },
  { slug: "kpk", label: "KPK Board" },
  { slug: "sindh", label: "Sindh Board" },
  { slug: "oxford", label: "Oxford Board" },
  { slug: "cambridge", label: "Cambridge Board" },
  { slug: "apsacs", label: "APSACS" },
  { slug: "o-level", label: "O Level" },
  { slug: "a-level", label: "A Level" },
] as const;

/** Boards that share the Punjab Board scheme of studies and textbooks. */
export const PUNJAB_VARIANT_SLUGS = ["lahore", "d-g-khan"] as const;

/** Human-readable board name for any board slug (falls back to a title-cased slug). */
export function boardLabel(boardSlug: string): string {
  const known = NAV_BOARDS.find((b) => b.slug === boardSlug);
  if (known) return known.label;
  return boardSlug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const NAV_CLASSES = [5, 6, 7, 8, 9, 10, 11, 12] as const;
export const APSACS_CLASSES = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export const CLASS_RANGE = { min: 5, max: 12 } as const;
export const APSACS_CLASS_RANGE = { min: 1, max: 8 } as const;

// Dynamic academic year - can be easily updated for future years
export const ACADEMIC_YEAR = "2026–2027";

// FBISE abbreviation applies only to matric/inter (classes 9-12).
// Classes 5-8 are published by the National Book Foundation (NBF).
export function boardShortName(boardSlug: string, classNum?: number): string {
  if (boardSlug === "fbise") {
    if (classNum === undefined) return "Federal Board";
    return classNum >= 9 ? "FBISE" : "NBF";
  }
  return boardLabel(boardSlug);
}

// Display title shown in breadcrumbs/chips/SEO: FBISE branding only for classes 9–12.
// Classes 5–8 show NBF; board-level pages drop the "(FBISE)" suffix.
export function boardDisplayTitle(boardTitle: string, boardSlug: string, classNum?: number): string {
  if (boardSlug !== "fbise") return boardTitle;
  if (!classNum || classNum < 5) {
    return boardTitle.replace(/\s*\(FBISE\)/i, "").trim() || "Federal Board";
  }
  return classNum >= 9
    ? boardTitle.includes("FBISE")
      ? boardTitle
      : "Federal Board (FBISE)"
    : "National Book Foundation (NBF)";
}

// Portal textbook category slug for each board (used by Books links).
export const BOARD_TEXTBOOK_CATEGORY: Record<string, string> = {
  fbise: "federal-text-books",
  punjab: "punjab-text-books",
  // Lahore Board and D.G. Khan Board sit under the Punjab textbook category.
  lahore: "punjab-text-books",
  "d-g-khan": "punjab-text-books",
  kpk: "kpk-text-books",
  sindh: "sindh-text-books",
  oxford: "oxford-text-books",
  cambridge: "cambridge-text-books",
  "o-level": "cambridge-intl-notes",
  "a-level": "cambridge-intl-notes",
  apsacs: "federal-text-books",
};

export function boardTextbookCategory(boardSlug: string): string {
  return BOARD_TEXTBOOK_CATEGORY[boardSlug] ?? "federal-text-books";
}

/**
 * Curriculum order for subject cards, uniform across every class:
 * Mathematics, Physics, Chemistry, Biology, General Science, English, Urdu,
 * Islamiyat, Pakistan Studies, Computer Science — then anything else
 * alphabetically. The API returns subjects in whatever order the database/seed
 * happened to insert them, which made class pages render an arbitrary sequence
 * (Physics before Mathematics, Islamiyat last, Computer Science next to
 * Physics), so every listing sorts through `sortSubjects`.
 */
const SUBJECT_ORDER = [
  "mathematics",
  "maths",
  "physics",
  "chemistry",
  "biology",
  // In primary/middle grades this is the whole science syllabus, so it keeps the
  // same slot Physics/Chemistry/Biology would occupy.
  "general science",
  "general sciences",
  "english",
  "urdu",
  "islamiyat",
  "islamiat",
  "islam studies",
  "pakistan studies",
  "pakistani studies",
  "pakistan studies islamiyat",
  "tarjuma tul quran",
  "tarjama tul quran",
  "computer science",
  "computer studies",
  "geography",
  "history",
  "civics",
  "economics",
  "arabic",
  "drawing",
  "art",
  "music",
  "physical education",
] as const;

/** Lower-cased, punctuation-free key used for subject lookups and ordering. */
export function subjectKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function subjectRank(title: string): number {
  const index = SUBJECT_ORDER.indexOf(subjectKey(title) as (typeof SUBJECT_ORDER)[number]);
  return index === -1 ? SUBJECT_ORDER.length : index;
}

/**
 * Sort a subject list into curriculum order. Subjects outside the known list keep
 * their relative position at the end, ordered alphabetically, so newly added
 * subjects are never lost or interleaved.
 */
export function sortSubjects<T extends { title: string }>(subjects: readonly T[]): T[] {
  return subjects
    .map((subject, index) => ({ subject, index }))
    .sort((a, b) => {
      const rank = subjectRank(a.subject.title) - subjectRank(b.subject.title);
      if (rank !== 0) return rank;
      const byTitle = subjectKey(a.subject.title).localeCompare(subjectKey(b.subject.title));
      return byTitle !== 0 ? byTitle : a.index - b.index;
    })
    .map((entry) => entry.subject);
}

/** Numeric class order (5 → 12, APSACS `class-3` → 3), with unparseable slugs last. */
export function classNumberFromSlug(slug: string): number {
  const parsed = parseInt(slug.replace(/^class-/i, ""), 10);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

/** Sort class entries numerically so 9 comes before 10 and APSACS 3 before 8. */
export function sortClasses<T extends { slug: string }>(classes: readonly T[]): T[] {
  return classes
    .map((klass, index) => ({ klass, index }))
    .sort((a, b) => {
      const diff = classNumberFromSlug(a.klass.slug) - classNumberFromSlug(b.klass.slug);
      return diff !== 0 ? diff : a.index - b.index;
    })
    .map((entry) => entry.klass);
}

/** Parsed class number from a slug; 0 when the slug carries no number. */
export function parseClassNumber(slug: string): number {
  const parsed = parseInt(slug.replace(/^class-/i, ""), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/** Human-facing class title — intermediate classes are labelled as years. */
export function classLabel(num: number): string {
  if (num === 11) return "1st Year";
  if (num === 12) return "2nd Year";
  if (num > 0) return `Class ${num}`;
  return "";
}

/** Bare class number for a slug, for compact chips ("9", "3"). */
export function classLabelFromSlug(slug: string): string {
  return String(parseClassNumber(slug) || slug.replace(/^class-/i, ""));
}
