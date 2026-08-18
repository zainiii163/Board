import type { Metadata } from "next";

export function buildMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const full = `${title} — BoardNotes`;
  return {
    title: full,
    description,
    openGraph: { title: full, description, url: path },
  };
}
