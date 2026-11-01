import { apiFetchOrNull } from "@/lib/api-client";
import { PortalHome } from "@/components/portal/portal-home";
import { type HomeBoardSection } from "@/components/portal/board-cover-sections";
import {
  type PortalCategory,
  type PortalResource,
} from "@/components/portal/portal-types";
import { isBooksNotesBoard } from "@/lib/constants";

type CategoriesResponse = { categories: PortalCategory[]; tree: PortalCategory[] };
type ResourcesPage = { resources: PortalResource[]; total: number };

type BoardCatalogItem = {
  slug: string;
  classCount: number;
};

type BoardDetail = {
  slug: string;
  title: string;
  classes: { slug: string; title: string; subjects?: { slug: string; title: string }[] }[];
};

type BookRow = {
  boardSlug: string;
  classSlug: string;
  classTitle?: string | null;
  subjectSlug: string | null;
  subjectTitle: string | null;
};

export const dynamic = "force-dynamic";

function mergeBookSubjects(
  board: BoardDetail,
  books: BookRow[],
): BoardDetail {
  const boardBooks = books.filter((book) => book.boardSlug === board.slug);
  const classes = board.classes.map((klass) => {
    const bySlug = new Map((klass.subjects ?? []).map((subject) => [subject.slug, subject]));
    for (const book of boardBooks) {
      if (book.classSlug !== klass.slug || !book.subjectSlug || !book.subjectTitle) continue;
      if (!bySlug.has(book.subjectSlug)) {
        bySlug.set(book.subjectSlug, { slug: book.subjectSlug, title: book.subjectTitle });
      }
    }
    return { ...klass, subjects: [...bySlug.values()] };
  });

  // Add classes that exist only in books (shouldn't happen often, but keeps home complete).
  const known = new Set(classes.map((klass) => klass.slug));
  for (const book of boardBooks) {
    if (!book.classSlug || known.has(book.classSlug)) continue;
    known.add(book.classSlug);
    classes.push({
      slug: book.classSlug,
      title: book.classTitle || `Class ${book.classSlug}`,
      subjects: book.subjectSlug && book.subjectTitle
        ? [{ slug: book.subjectSlug, title: book.subjectTitle }]
        : [],
    });
  }

  return { ...board, classes };
}

function buildSection(board: BoardDetail): HomeBoardSection | null {
  const seen = new Set<string>();
  const classes = board.classes.filter((klass) => {
    if (seen.has(klass.slug)) return false;
    seen.add(klass.slug);
    return true;
  });
  if (classes.length === 0) return null;

  const classNumbers = classes
    .map((klass) => parseInt(klass.slug, 10))
    .filter((num) => Number.isFinite(num) && num > 0)
    .sort((a, b) => b - a);

  const title = board.title.replace(/\s*\([^)]*\)/g, "").trim() || board.title;

  return {
    slug: board.slug,
    title,
    classNumbers,
    classes: classes.map((klass) => ({
      slug: klass.slug,
      title: klass.title,
      subjects: klass.subjects ?? [],
    })),
  };
}

async function fetchHomeBoardSections(): Promise<HomeBoardSection[]> {
  const catalog = await apiFetchOrNull<BoardCatalogItem[]>("/api/boards");
  // Books & Notes home: Federal + Punjab only (client 123.pdf). Other boards remain in API/DB.
  const boards = (catalog ?? []).filter(
    (board) => board.classCount > 0 && isBooksNotesBoard(board.slug),
  );
  if (boards.length === 0) return [];

  const [details, ...bookLists] = await Promise.all([
    Promise.all(boards.map((board) => apiFetchOrNull<BoardDetail>(`/api/boards/${board.slug}`))),
    ...boards.map((board) => apiFetchOrNull<BookRow[]>(`/api/books?board=${board.slug}`)),
  ]);

  const books = bookLists.flatMap((list) => list ?? []);

  return details
    .filter((detail): detail is BoardDetail => detail !== null)
    .map((detail) => buildSection(mergeBookSubjects(detail, books)))
    .filter((section): section is HomeBoardSection => section !== null);
}

export default async function HomePage() {
  const [cats, latest, trending, boardSections] = await Promise.all([
    apiFetchOrNull<CategoriesResponse>("/api/categories"),
    apiFetchOrNull<PortalResource[]>("/api/resources/latest?limit=8"),
    apiFetchOrNull<ResourcesPage>("/api/resources?sort=downloads&limit=8"),
    fetchHomeBoardSections(),
  ]);

  const categoryNameById: Record<string, string> = {};
  for (const c of cats?.categories ?? []) categoryNameById[String(c.id)] = c.name;

  return (
    <PortalHome
      categories={cats?.tree ?? []}
      latest={latest}
      trending={trending?.resources ?? null}
      categoryNameById={categoryNameById}
      boardSections={boardSections}
    />
  );
}
