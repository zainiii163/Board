import Link from "next/link";

import { apiFetch } from "@/lib/api-client";
import { PastPapersList, type PastPaperItem } from "@/components/content/past-papers-list";

async function getModelPapers() {
  try {
    return await apiFetch<PastPaperItem[]>("/api/past-papers?type=model");
  } catch {
    return [];
  }
}

export default async function ModelPapersPage() {
  const papers = await getModelPapers();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-border dark:bg-card">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Exam Prep</p>
        <h1 className="mt-1 text-3xl font-black text-foreground">Model Papers</h1>
        <p className="mt-2 text-sm text-muted">
          Board model papers with direct Google Drive links — filter by board and year.
        </p>
        <div className="mt-6">
          <PastPapersList papers={papers} hideHeading />
        </div>
        <p className="mt-6 text-sm text-muted">
          Looking for solved model papers, pairing schemes, and guess papers?{" "}
          <Link href="/categories/model-papers" className="font-semibold text-accent underline">
            Browse the full library →
          </Link>
        </p>
      </div>
    </section>
  );
}
