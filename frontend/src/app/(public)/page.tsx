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

export const dynamic = "force-dynamic";

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

  const details = await Promise.all(
    boards.map((board) => apiFetchOrNull<BoardDetail>(`/api/boards/${board.slug}`)),
  );
  return details
    .filter((detail): detail is BoardDetail => detail !== null)
    .map(buildSection)
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
