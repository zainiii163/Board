export type SolutionStep = {
  label: string;
  detail: string;
};

export type Question = {
  number: string;
  title: string;
  prompt: string;
  answer: string;
  marks: number;
  difficulty: "easy" | "medium" | "hard";
  steps: SolutionStep[];
};

export type Exercise = {
  slug: string;
  title: string;
  description: string;
  pdfLabel: string;
  questions: Question[];
};

export type Chapter = {
  slug: string;
  title: string;
  summary: string;
  formulas: string[];
  exercises: Exercise[];
};

export type Subject = {
  slug: string;
  title: string;
  session: string;
  sloTags: string[];
  chapters: Chapter[];
};

export type SchoolClass = {
  slug: string;
  title: string;
  description: string;
  subjects: Subject[];
};

export type Board = {
  slug: string;
  title: string;
  description: string;
  classes: SchoolClass[];
};
