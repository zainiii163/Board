"use client";

export function SearchInput({
  placeholder = "Search chapters, exercises, topics…",
}: {
  placeholder?: string;
}) {
  return (
    <input
      type="search"
      placeholder={placeholder}
      className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/40"
    />
  );
}
