import { apiFetchOrNull } from "@/lib/api-client";
import { BooksListing } from "@/components/portal/books-listing";
import { AdBanner } from "@/components/portal/ad-banner";
import { type PortalCategory, type PortalResource } from "@/components/portal/portal-types";
import type { Metadata } from "next";

type CategoriesResponse = { categories: PortalCategory[]; tree: PortalCategory[] };
type ResourcesPage = { resources: PortalResource[]; total: number };

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Books & Notes Library | BoardNotes",
  description: "Browse textbooks and notes for Federal and Punjab Boards — separate from Past Papers.",
  openGraph: { title: "Books & Notes Library | BoardNotes", description: "Textbooks and notes for Federal and Punjab Boards" },
};

export default async function BooksPage() {
  const [cats, initial] = await Promise.all([
    apiFetchOrNull<CategoriesResponse>("/api/categories"),
    apiFetchOrNull<ResourcesPage>("/api/resources?limit=60&sort=latest"),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Books &amp; Notes</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">Resource library</h1>
        <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
          Textbooks and notes for Federal and Punjab Boards. Past papers live in their own section.
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