export const SITE_NAME = "BoardNotes";
export const DEFAULT_BOARD = "fbise";
export const SUPPORTED_BOARDS = ["fbise", "punjab", "kpk", "sindh", "apsacs"] as const;

// WhatsApp Contact/Chat - Direct chat with phone number
export const WHATSAPP_CHAT_URL = "https://wa.me/923017521835";

// WhatsApp Channel - Join channel link
export const WHATSAPP_CHANNEL_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL ?? "https://whatsapp.com/channel/0029Vb5PkniD38CY2Nks972r";

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
