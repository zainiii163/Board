import { apiFetchOrNull } from "@/lib/api-client";
import { PortalHome } from "@/components/portal/portal-home";
import {
  type PortalCategory,
  type PortalResource,
  type PortalStats,
} from "@/components/portal/portal-types";

type CategoriesResponse = { categories: PortalCategory[]; tree: PortalCategory[] };
type ResourcesPage = { resources: PortalResource[]; total: number };

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [cats, stats, latest, trending] = await Promise.all([
    apiFetchOrNull<CategoriesResponse>("/api/categories"),
    apiFetchOrNull<PortalStats>("/api/portal/stats"),
    apiFetchOrNull<PortalResource[]>("/api/resources/latest?limit=8"),
    apiFetchOrNull<ResourcesPage>("/api/resources?sort=downloads&limit=8"),
  ]);

  const categoryNameById: Record<string, string> = {};
  for (const c of cats?.categories ?? []) categoryNameById[String(c.id)] = c.name;

  return (
    <PortalHome
      categories={cats?.tree ?? []}
      stats={stats}
      latest={latest}
      trending={trending?.resources ?? null}
      categoryNameById={categoryNameById}
    />
  );
}