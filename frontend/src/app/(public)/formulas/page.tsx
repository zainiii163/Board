import { FormulasHubContent } from "@/components/content/formulas-hub-content";
import { apiFetchOrNull } from "@/lib/api-client";

type FormulaChapter = {
  boardSlug: string;
  classSlug: string;
  subjectSlug: string;
  chapterSlug: string;
  boardTitle: string;
  classTitle: string;
  subjectTitle: string;
  chapterTitle: string;
  formulas: string[];
  formulasUr?: string[];
};

export default async function FormulasPage() {
  const chapters = (await apiFetchOrNull<FormulaChapter[]>("/api/formulas")) ?? [];
  return <FormulasHubContent chapters={chapters} />;
}
