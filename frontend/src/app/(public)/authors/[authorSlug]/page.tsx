import { apiFetchOrNull } from "@/lib/api-client";
import { AuthorPageContent } from "@/components/content/author-page-content";

type AuthorData = {
  slug: string;
  name: string;
  title: string;
  bio: string;
  boards: string[];
  noteCount: number;
  notes: { title: string; path: string; subject: string }[];
};

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ authorSlug: string }>;
}) {
  const { authorSlug } = await params;
  const author = await apiFetchOrNull<AuthorData>(`/api/authors/${authorSlug}`);

  return <AuthorPageContent author={author} />;
}
