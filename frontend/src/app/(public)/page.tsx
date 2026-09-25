import { apiFetchOrNull } from "@/lib/api-client";
import { PortalHome } from "@/components/portal/portal-home";
import { type HomeBoardSection } from "@/components/portal/board-cover-sections";
import {
  type PortalCategory,
  type PortalResource,
} from "@/components/portal/portal-types";

type CategoriesResponse = { categories: PortalCategory[]; tree: PortalCategory[] };
type ResourcesPage = { resources: PortalResource[]; total: number };

type BoardCatalogItem = {
  slug: string;
  title: string;
  classCount: number;
  chapterCount: number;
  ready: boolean;
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

  const classNumberBySlug = new Map<string, number>();
  for (const klass of classes) {
    const num = parseInt(klass.slug, 10);
    if (Number.isFinite(num) && num > 0) classNumberBySlug.set(klass.slug, num);
  }

  const classNumbers = [...classNumberBySlug.values()].sort((a, b) => b - a);

  const withSubjects = classes
    .filter((klass) => (klass.subjects?.length ?? 0) > 0)
    .sort((a, b) => {
      const countDiff = (b.subjects?.length ?? 0) - (a.subjects?.length ?? 0);
      if (countDiff !== 0) return countDiff;
      return (classNumberBySlug.get(b.slug) ?? 0) - (classNumberBySlug.get(a.slug) ?? 0);
    });
  const featured = withSubjects[0];
  if (!featured) return null;

  const title = board.title.replace(/\s*\([^)]*\)/g, "").trim() || board.title;

  return {
    slug: board.slug,
    title,
    classNumbers,
    featuredClassSlug: featured.slug,
    subjects: (featured.subjects ?? []).slice(0, 6),
  };
}

async function fetchHomeBoardSections(): Promise<HomeBoardSection[]> {
  const catalog = await apiFetchOrNull<BoardCatalogItem[]>("/api/boards");
  const ready = (catalog ?? [])
    .filter((board) => board.ready && board.classCount > 0)
    .slice(0, 5);
  if (ready.length === 0) return [];

  const details = await Promise.all(
    ready.map((board) => apiFetchOrNull<BoardDetail>(`/api/boards/${board.slug}`)),
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
