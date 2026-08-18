"use client";

import { useState } from "react";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);

  async function search(q: string) {
    setQuery(q);
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      setResults(data);
    } finally {
      setLoading(false);
    }
  }

  return { query, results, loading, search, setQuery };
}
