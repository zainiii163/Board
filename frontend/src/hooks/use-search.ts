"use client";

import { useState } from "react";

import { apiFetch } from "@/lib/api-client";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);

  async function search(q: string) {
    setQuery(q);
    setLoading(true);
    try {
      const data = await apiFetch<{ results: unknown[] }>(
        `/api/search?q=${encodeURIComponent(q)}`,
      );
      setResults(data.results ?? data);
    } finally {
      setLoading(false);
    }
  }

  return { query, results, loading, search, setQuery };
}
