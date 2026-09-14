import { apiFetchOrNull } from "@/lib/api-client";
import { BooksListing } from "@/components/portal/books-listing";
import { AdBanner } from "@/components/portal/ad-banner";
import { type PortalCategory, type PortalResource } from "@/components/portal/portal-types";
import type { Metadata } from "next";

type CategoriesResponse = { categories: PortalCategory[]; tree: PortalCategory[] };
type ResourcesPage = { resources: PortalResource[]; total: number };

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Resources | BoardNotes",
  description: "Browse the complete library of free textbooks, notes, past papers, and study materials for all boards and classes.",
  openGraph: { title: "All Resources | BoardNotes", description: "Free educational resources for students" },
};

export default async function BooksPage() {
  const [cats, initial] = await Promise.all([
    apiFetchOrNull<CategoriesResponse>("/api/categories"),
    apiFetchOrNull<ResourcesPage>("/api/resources?limit=60&sort=latest"),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">All Resources</h1>
        <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
          Browse the full library — pick a category or sort by popularity.
        </p>
      </div>

      <BooksListing
        initialResources={initial?.resources ?? []}
        initialTotal={initial?.total ?? 0}
        categories={cats?.categories ?? []}
      />

      <div className="mt-10">
        <AdBanner size="leaderboard" className="mx-auto" />
      </div>
    </section>
  );
}