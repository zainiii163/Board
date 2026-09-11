"use client";

import Link from "next/link";
import type { SearchResult } from "@/lib/shared-types";

import { PageHeading } from "@/components/layout/page-heading";
import { useLocale } from "@/lib/locale-context";
import { ResourceCard } from "@/components/portal/resource-card";
import { type PortalResource } from "@/components/portal/portal-types";

type Props = {
  query: string;
  boardFilter: string;
  classFilter: string;
  subjectFilter: string;
  results: SearchResult[];
  portalResources?: PortalResource[];
  portalCategoryNames?: Record<string, string>;
};

export function SearchPageContent({
  query,
  boardFilter,
  classFilter,
  subjectFilter,
  results,
  portalResources = [],
  portalCategoryNames = {},
}: Props) {
  const { tr } = useLocale();

  const filteredResults = results.filter((result) => {
    const matchesBoard =
      boardFilter === "all" || result.board.toLowerCase().includes(boardFilter.toLowerCase());
    const matchesClass =
      classFilter === "all" || result.className.toLowerCase().includes(classFilter.toLowerCase());
    const matchesSubject =
      subjectFilter === "all" || result.subject.toLowerCase() === subjectFilter.toLowerCase();
    return matchesBoard && matchesClass && matchesSubject;
  });

  const countLabel =
    filteredResults.length === 1 ? tr("result") : tr("results");

  return (
    <>
      <PageHeading titleKey="search" />

      <form action="/search" method="get" className="mt-5 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            name="q"
            aria-label={tr("search")}
            placeholder={tr("searchPlaceholder")}
            defaultValue={query}
            className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {tr("search")}
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <select
            name="board"
            defaultValue={boardFilter}
            className="rounded-xl border border-border bg-card px-3 py-3 text-sm text-foreground outline-none focus:border-accent"
          >
            <option value="all">{tr("boardAll")}</option>
            <option value="fbise">FBISE</option>
            <option value="punjab">Punjab</option>
            <option value="kpk">KPK</option>
            <option value="sindh">Sindh</option>
          </select>

          <select
            name="class"
            defaultValue={classFilter}
            className="rounded-xl border border-border bg-card px-3 py-3 text-sm text-foreground outline-none focus:border-accent"
          >
            <option value="all">{tr("classAll")}</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
          </select>

          <select
            name="subject"
            defaultValue={subjectFilter}
            className="rounded-xl border border-border bg-card px-3 py-3 text-sm text-foreground outline-none focus:border-accent"
          >
            <option value="all">{tr("subjectAll")}</option>
            <option value="mathematics">Mathematics</option>
            <option value="chemistry">Chemistry</option>
          </select>
        </div>
      </form>

      <div className="mt-8">
        {portalResources.length > 0 && (
          <>
            <div className="mb-4 flex items-end justify-between">
              <h2 className="font-serif text-xl font-bold text-foreground">{tr("searchResources")}</h2>
              <span className="text-xs font-semibold text-muted">
                {portalResources.length} {tr("resourcesCount")}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {portalResources.map((r) => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  categoryName={portalCategoryNames[String(r.id)] ?? (r.board ?? r.subject)}
                />
              ))}
            </div>
            <div className="my-8 h-px bg-border" />
          </>
        )}

        <p className="mb-4 text-sm text-muted">
          {tr("showingResults")} {filteredResults.length} {countLabel} {tr("forQuery")} “
          {query || tr("allLabel")}”
        </p>

        {filteredResults.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted">
            {tr("noSearchResults")}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResults.map((result) => (
              <Link
                key={result.path}
                href={result.path}
                className="block rounded-xl border border-border bg-card p-4 transition hover:border-accent/40 hover:bg-accent/10"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-bold text-foreground">{result.title}</h2>
                  <span className="text-sm text-muted">{result.board}</span>
                </div>
                <p className="mt-2 text-sm text-muted">
                  {result.className} • {result.subject}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
