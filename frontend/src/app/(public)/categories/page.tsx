import { apiFetchOrNull } from "@/lib/api-client";
import { CategoryCard } from "@/components/portal/category-card";
import { AdBanner } from "@/components/portal/ad-banner";
import { type PortalCategory } from "@/components/portal/portal-types";

type CategoriesResponse = { categories: PortalCategory[]; tree: PortalCategory[] };

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const data = await apiFetchOrNull<CategoriesResponse>("/api/categories");
  const tree = data?.tree ?? [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">Browse Categories</h1>
        <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
          Every study resource, from textbooks to entry-test prep, organized into clean categories.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tree.map((c) => (
          <CategoryCard key={c.slug} category={c} />
        ))}
      </div>

      <div className="mt-10">
        <AdBanner size="leaderboard" className="mx-auto" />
      </div>
    </section>
  );
}