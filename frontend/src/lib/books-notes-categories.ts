import type { PortalCategory } from "@/components/portal/portal-types";

/** Category roots shown on the public Books & Notes library (123.pdf). */
const BOOKS_NOTES_ROOTS = new Set(["textbooks", "notes"]);

/** Child board categories allowed under textbooks / notes. */
const ALLOWED_CHILD_SLUGS = new Set([
  "federal-text-books",
  "punjab-text-books",
  "federal-board-notes",
  "punjab-board-notes",
]);

/**
 * Trim the CMS category tree for /books: Text Books + Notes only, and only
 * Federal / Punjab children. Does not mutate the source array.
 */
export function filterBooksNotesCategories(categories: PortalCategory[]): PortalCategory[] {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const allowedIds = new Set<number>();

  for (const cat of categories) {
    if (cat.parentId === null && BOOKS_NOTES_ROOTS.has(cat.slug)) {
      allowedIds.add(cat.id);
      continue;
    }
    if (cat.parentId != null && ALLOWED_CHILD_SLUGS.has(cat.slug)) {
      const parent = byId.get(cat.parentId);
      if (parent && BOOKS_NOTES_ROOTS.has(parent.slug)) {
        allowedIds.add(cat.id);
      }
    }
  }

  const filtered = categories.filter((c) => allowedIds.has(c.id));
  return filtered.map((c) => ({
    ...c,
    children: filtered.filter((child) => child.parentId === c.id),
  }));
}
