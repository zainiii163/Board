// ── Enums & Literals ──

export type ContentDifficulty = "easy" | "medium" | "hard";

export type QuestionType =
  | "mcq"
  | "short"
  | "long"
  | "proof"
  | "numerical"
  | "construction";

export type ContentStatus = "draft" | "in_review" | "published" | "archived";

export type UserRole = "admin" | "editor" | "teacher" | "student";

export type SearchResultType = "chapter" | "exercise" | "question";

// ── API health ──

export type ApiHealth = {
  status: "ok";
  service: "boardnotes-backend";
  timestamp: string;
};

// ── Core hierarchy ──

export type BoardSummary = {
  id?: number | string;
  slug: string;
  title: string;
};

export type ClassSummary = {
  id?: number | string;
  slug: string;
  title: string;
  boardId?: number | string;
};

export type SubjectSummary = {
  id?: number | string;
  slug: string;
  title: string;
  session?: string;
  classId?: number | string;
};

export type ChapterSummary = {
  id?: number | string;
  slug: string;
  title: string;
  order?: number;
  status?: ContentStatus;
  subjectId?: number | string;
};

export type ExerciseSummary = {
  id?: number | string;
  slug: string;
  title: string;
  order?: number;
  chapterId?: number | string;
};

export type QuestionSummary = {
  id?: number | string;
  number: string;
  title: string;
  type?: QuestionType;
  difficulty?: ContentDifficulty;
  marks?: number;
  exerciseId?: number | string;
};

// ── Question content ──

export type SolutionStep = {
  title: string;
  content: string;
};

export type QuestionContent = {
  num: number;
  question: string;
  marks: number;
  difficulty: string;
  pdfName?: string | null;
  steps: SolutionStep[];
};

// ── Search / PDFs ──

export type SearchResult = {
  title: string;
  board: string;
  boardSlug: string;
  className: string;
  classSlug: string;
  subject: string;
  subjectSlug: string;
  path: string;
  type: SearchResultType;
};

export type PdfSummary = {
  id: string;
  filename: string;
  size: string;
  url: string;
  uploadedAt: string;
};

// ── MCQ ──

export type McqOption = {
  label: string;
  text: string;
};

// ── User ──

export type UserSummary = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

// ── Audit ──

export type AuditEntry = {
  id: string;
  userId: string;
  action: string;
  target: string;
  createdAt: string;
};
