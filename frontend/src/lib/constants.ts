export const SITE_NAME = "BoardNotes";
export const DEFAULT_BOARD = "fbise";
export const SUPPORTED_BOARDS = ["fbise", "punjab", "kpk", "sindh"] as const;

export const WHATSAPP_CHANNEL_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL ?? "https://whatsapp.com/channel/join";

export const NAV_BOARDS = [
  { slug: "fbise", label: "Federal Board" },
  { slug: "punjab", label: "Punjab Board" },
  { slug: "oxford", label: "Oxford Board" },
  { slug: "cambridge", label: "Cambridge Board" },
] as const;

export const NAV_CLASSES = [5, 6, 7, 8, 9, 10, 11, 12] as const;
export const CLASS_RANGE = { min: 5, max: 12 } as const;
