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

// ── API health ──

export type ApiHealth = {
  status: "ok";
  service: "boardnotes-backend";
  timestamp: string;
};

// ── Core hierarchy ──

export type BoardSummary = {
  id: string;
  slug: string;
  title: string;
};

export type ClassSummary = {
  id: string;
  slug: string;
  title: string;
  boardId: string;
};

export type SubjectSummary = {
  id: string;
  slug: string;
  title: string;
  session: string;
  classId: string;
};

export type ChapterSummary = {
  id: string;
  slug: string;
  title: string;
  order: number;
  status: ContentStatus;
  subjectId: string;
};

export type ExerciseSummary = {
  id: string;
  slug: string;
  title: string;
  order: number;
  chapterId: string;
};

export type QuestionSummary = {
  id: string;
  number: string;
  title: string;
  type: QuestionType;
  difficulty: ContentDifficulty;
  marks: number;
  exerciseId: string;
};

// ── Solutions ──

export type SolutionStep = {
  label: string;
  detail: string;
};

// ── MCQ ──

export type McqOption = {
  label: string;
  text: string;
};

// ── PDF ──

export type PdfSummary = {
  id: string;
  filename: string;
  sizeBytes: number;
  url: string;
  level: "exercise" | "chapter" | "book";
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
