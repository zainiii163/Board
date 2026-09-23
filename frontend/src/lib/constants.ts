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
  { slug: "oxford", label: "Oxford Board" },
  { slug: "cambridge", label: "Cambridge Board" },
  { slug: "apsacs", label: "APSACS" },
] as const;

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
  return NAV_BOARDS.find((b) => b.slug === boardSlug)?.label ?? boardSlug;
}

// Portal textbook category slug for each board (used by Books links).
export const BOARD_TEXTBOOK_CATEGORY: Record<string, string> = {
  fbise: "federal-text-books",
  punjab: "punjab-text-books",
  kpk: "kpk-text-books",
  sindh: "sindh-text-books",
  oxford: "oxford-text-books",
  cambridge: "cambridge-text-books",
  apsacs: "federal-text-books",
};

export function boardTextbookCategory(boardSlug: string): string {
  return BOARD_TEXTBOOK_CATEGORY[boardSlug] ?? "federal-text-books";
}
