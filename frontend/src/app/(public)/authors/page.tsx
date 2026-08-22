import { AuthorsListContent } from "@/components/content/authors-list-content";
import { apiFetchOrNull } from "@/lib/api-client";

type AuthorSummary = {
  slug: string;
  name: string;
  title: string;
  bio: string;
  boards: string[];
  noteCount: number;
};

export default async function AuthorsPage() {
  const authors = (await apiFetchOrNull<AuthorSummary[]>("/api/authors")) ?? [];
  return <AuthorsListContent authors={authors} />;
}
