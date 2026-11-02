/**
 * Client 123.pdf — public Books & Notes surfaces show Federal + Punjab only.
 * Filtering is read-time; DB rows for other boards are retained.
 */

const ALLOWED_BOARD_KEYS = new Set([
  "federal board",
  "federal board (fbise)",
  "fbise",
  "punjab board",
  "punjab",
  "national book foundation",
  "national book foundation (nbf)",
  "nbf",
]);

/** Boards / exam boards never shown on the Books & Notes library. */
const EXCLUDED_BOARD_FRAGMENTS = [
  "oxford",
  "cambridge",
  "sindh",
  "aqa",
  "kpk",
  "balochistan",
  "apsacs",
  "lahore",
  "d.g",
  "d.g.",
  "dg khan",
  "pearson",
  "edexcel",
  "city & guilds",
  "baccalaureate",
  "ib ",
];

/** Category roots allowed on /books (Books & Notes, not papers). */
export const BOOKS_NOTES_ROOT_CATEGORY_SLUGS = ["textbooks", "notes"] as const;

/** Past-paper-style category roots excluded from /books. */
export const PAST_PAPER_CATEGORY_SLUGS = ["model-papers", "guess-papers"] as const;

function normalizeBoard(board: string): string {
  return board.toLowerCase().replace(/\s+/g, " ").trim();
}

export function isBooksNotesAllowedBoard(board: string | null | undefined): boolean {
  if (!board) return false;
  const key = normalizeBoard(board);
  if (ALLOWED_BOARD_KEYS.has(key)) return true;
  if (EXCLUDED_BOARD_FRAGMENTS.some((frag) => key.includes(frag))) return false;
  // Accept close Federal / Punjab variants (e.g. "Federal Board FBISE").
  if (key.includes("federal") && key.includes("board")) return true;
  if (key.includes("punjab") && key.includes("board")) return true;
  if (key === "federal" || key.startsWith("federal ")) return true;
  return false;
}

export function isPastPaperTypeTitle(title: string): boolean {
  const t = title.toLowerCase();
  return (
    /\bpast\s*papers?\b/.test(t) ||
    /\bmodel\s*&\s*past\b/.test(t) ||
    /\bguess\s*papers?\b/.test(t)
  );
}

export type BooksNotesCategoryInfo = {
  slug: string;
  parentId: number | null;
};

/**
 * True when the resource belongs on the public Books & Notes listing.
 * `categoryTrailSlugs` is root→leaf (or any order) category slugs for the resource.
 */
export function isBooksNotesPublicResource(input: {
  board: string | null | undefined;
  title: string;
  categoryTrailSlugs: string[];
}): boolean {
  if (!isBooksNotesAllowedBoard(input.board)) return false;
  if (isPastPaperTypeTitle(input.title)) return false;

  const slugs = new Set(input.categoryTrailSlugs.map((s) => s.toLowerCase()));
  for (const blocked of PAST_PAPER_CATEGORY_SLUGS) {
    if (slugs.has(blocked)) return false;
  }

  const inBooksNotesTree = BOOKS_NOTES_ROOT_CATEGORY_SLUGS.some((root) => slugs.has(root));
  if (!inBooksNotesTree) return false;

  return true;
}
