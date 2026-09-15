"use client";

import { useState, useMemo } from "react";
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

function highlightQuery(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="rounded bg-yellow-200/80 px-0.5 text-foreground dark:bg-yellow-500/30">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

type FilterChip = {
  key: string;
  label: string;
  param: string;
  value: string;
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
  const [dismissedFilters, setDismissedFilters] = useState<Set<string>>(new Set());

  const filteredResults = results.filter((result) => {
    const matchesBoard =
      boardFilter === "all" || result.board.toLowerCase().includes(boardFilter.toLowerCase());
    const matchesClass =
      classFilter === "all" || result.className.toLowerCase().includes(classFilter.toLowerCase());
    const matchesSubject =
      subjectFilter === "all" || result.subject.toLowerCase() === subjectFilter.toLowerCase();
    return matchesBoard && matchesClass && matchesSubject;
  });

  const activeFilters = useMemo(() => {
    const chips: FilterChip[] = [];
    if (boardFilter !== "all") {
      chips.push({ key: "board", label: `Board: ${boardFilter}`, param: "board", value: boardFilter });
    }
    if (classFilter !== "all") {
      chips.push({ key: "class", label: `Class: ${classFilter}`, param: "class", value: classFilter });
    }
    if (subjectFilter !== "all") {
      chips.push({ key: "subject", label: `Subject: ${subjectFilter}`, param: "subject", value: subjectFilter });
    }
    return chips.filter((c) => !dismissedFilters.has(c.key));
  }, [boardFilter, classFilter, subjectFilter, dismissedFilters]);

  function dismissFilter(key: string) {
    setDismissedFilters((prev) => new Set(prev).add(key));
  }

  function buildRemoveFilterUrl(param: string) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (param !== "board" && boardFilter !== "all") params.set("board", boardFilter);
    if (param !== "class" && classFilter !== "all") params.set("class", classFilter);
    if (param !== "subject" && subjectFilter !== "all") params.set("subject", subjectFilter);
    return `/search?${params.toString()}`;
  }

  const countLabel = filteredResults.length === 1 ? tr("result") : tr("results");

  return (
    <>
      <PageHeading titleKey="search" />

      {/* Glass search form */}
      <form
        action="/search"
        method="get"
        className="mt-6 rounded-2xl border border-white/20 bg-card/70 p-5 shadow-lg backdrop-blur-md sm:p-6 dark:border-white/5 dark:bg-card/50"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              name="q"
              aria-label={tr("search")}
              placeholder={tr("searchPlaceholder")}
              defaultValue={query}
              className="w-full rounded-xl border border-border bg-background/80 py-3 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-accent/90 hover:shadow-md active:scale-[0.98]"
          >
            {tr("search")}
          </button>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <select
            name="board"
            defaultValue={boardFilter}
            className="rounded-xl border border-border bg-background/80 px-3 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
            className="rounded-xl border border-border bg-background/80 px-3 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="all">{tr("classAll")}</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
          </select>

          <select
            name="subject"
            defaultValue={subjectFilter}
            className="rounded-xl border border-border bg-background/80 px-3 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="all">{tr("subjectAll")}</option>
            <option value="mathematics">Mathematics</option>
            <option value="chemistry">Chemistry</option>
          </select>
        </div>
      </form>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {activeFilters.map((chip) => (
            <Link
              key={chip.key}
              href={buildRemoveFilterUrl(chip.param)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent transition hover:bg-accent/20"
            >
              {chip.label}
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3 opacity-50 transition group-hover:opacity-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        {/* Portal Resources Section */}
        {portalResources.length > 0 && (
          <>
            <div className="mb-5 flex items-end justify-between">
              <h2 className="font-serif text-xl font-bold text-foreground">{tr("searchResources")}</h2>
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                {portalResources.length} {tr("resourcesCount")}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {portalResources.map((r, i) => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  index={i}
                  categoryName={portalCategoryNames[String(r.id)] ?? (r.board ?? r.subject)}
                />
              ))}
            </div>
            <div className="my-8 h-px bg-border" />
          </>
        )}

        {/* Results count + query summary */}
        <div className="mb-4 flex items-center gap-3">
          <p className="text-sm text-muted">
            {tr("showingResults")}
          </p>
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
            {filteredResults.length} {countLabel}
          </span>
          <p className="text-sm text-muted">
            {tr("forQuery")} &ldquo;{query || tr("allLabel")}&rdquo;
          </p>
        </div>

        {/* No results state */}
        {filteredResults.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center">
            <svg
              viewBox="0 0 24 24"
              className="mx-auto mb-4 h-12 w-12 text-muted/50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M8 11h6" />
            </svg>
            <h3 className="text-lg font-bold text-foreground">{tr("noSearchResults")}</h3>
            <p className="mt-2 text-sm text-muted">
              Try different keywords or adjust your filters.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-muted">Suggestions:</span>
              {["Past Papers", "Notes", "Textbook", "Class 9", "Mathematics"].map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground transition hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResults.map((result) => (
              <Link
                key={result.path}
                href={result.path}
                className="group block rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-accent/40 hover:bg-accent/5 hover:shadow-md hover:shadow-accent/5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                    {highlightQuery(result.title, query)}
                  </h2>
                  <span className="inline-flex w-fit items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                    {result.board}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">
                  {result.className} &bull; {result.subject}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
