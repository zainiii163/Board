import { pgTable, serial, text, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { UserRole } from "@boardnotes/shared";

export const boards = pgTable("boards", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
});

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  boardId: integer("board_id").references(() => boards.id).notNull(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").references(() => classes.id).notNull(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
});

export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").references(() => subjects.id).notNull(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  summaryUr: text("summary_ur"),
  formulas: jsonb("formulas").$type<string[]>().default([]).notNull(),
  formulasUr: jsonb("formulas_ur").$type<string[]>().default([]).notNull(),
  definitions: jsonb("definitions")
    .$type<{ term: string; definition: string; termUr?: string; definitionUr?: string }[]>()
    .default([])
    .notNull(),
  videoUrl: text("video_url"),
  status: text("status").$type<import("@boardnotes/shared").ContentStatus>().notNull().default("published"),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id").references(() => chapters.id).notNull(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  exerciseId: integer("exercise_id").references(() => exercises.id).notNull(),
  num: integer("num").notNull(),
  questionText: text("question_text").notNull(),
  questionTextUr: text("question_text_ur"),
  marks: integer("marks").notNull(),
  difficulty: text("difficulty").notNull(),
  pdfName: text("pdf_name"),
  stepsUr: jsonb("steps_ur").$type<{ title: string; content: string }[]>().default([]).notNull(),
});

export const solutionSteps = pgTable("solution_steps", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => questions.id).notNull(),
  stepOrder: integer("step_order").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
});

// Relations
export const boardsRelations = relations(boards, ({ many }) => ({
  classes: many(classes),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  board: one(boards, {
    fields: [classes.boardId],
    references: [boards.id],
  }),
  subjects: many(subjects),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  class: one(classes, {
    fields: [subjects.classId],
    references: [classes.id],
  }),
  chapters: many(chapters),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [chapters.subjectId],
    references: [subjects.id],
  }),
  exercises: many(exercises),
}));

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [exercises.chapterId],
    references: [chapters.id],
  }),
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  exercise: one(exercises, {
    fields: [questions.exerciseId],
    references: [exercises.id],
  }),
  steps: many(solutionSteps),
}));

export const solutionStepsRelations = relations(solutionSteps, ({ one }) => ({
  question: one(questions, {
    fields: [solutionSteps.questionId],
    references: [questions.id],
  }),
}));

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").$type<UserRole>().notNull().default("student"),
  emailUpdates: boolean("email_updates").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  pageUrl: text("page_url").notNull(),
  boardSlug: text("board_slug"),
  questionRef: text("question_ref"),
  message: text("message").notNull(),
  status: text("status").$type<"open" | "resolved">().notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  path: text("path").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(),
  target: text("target").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  bookmarks: many(bookmarks),
  auditLogs: many(auditLogs),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  boardSlug: text("board_slug").notNull(),
  boardTitle: text("board_title").notNull(),
  classSlug: text("class_slug").notNull(),
  classTitle: text("class_title").notNull(),
  subjectSlug: text("subject_slug"),
  subjectTitle: text("subject_title"),
  title: text("title").notNull(),
  priceLabel: text("price_label").notNull().default("Free PDF"),
  pdfUrl: text("pdf_url"),
  notesPath: text("notes_path"),
});

export const pastPapers = pgTable("past_papers", {
  id: serial("id").primaryKey(),
  boardSlug: text("board_slug").notNull(),
  boardTitle: text("board_title").notNull(),
  classSlug: text("class_slug").notNull(),
  classTitle: text("class_title").notNull(),
  subjectSlug: text("subject_slug").notNull(),
  subjectTitle: text("subject_title").notNull(),
  year: text("year").notNull(),
  sessionType: text("session_type").$type<"annual" | "supply">().notNull().default("annual"),
  pdfUrl: text("pdf_url"),
});

export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  boards: jsonb("boards").$type<string[]>().default([]).notNull(),
  noteCount: integer("note_count").notNull().default(0),
});

export const questionComments = pgTable("question_comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  userName: text("user_name").notNull(),
  pagePath: text("page_path").notNull(),
  questionRef: text("question_ref").notNull().default(""),
  body: text("body").notNull(),
  status: text("status").$type<"pending" | "approved" | "rejected">().notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const examDates = pgTable("exam_dates", {
  id: serial("id").primaryKey(),
  boardSlug: text("board_slug").notNull(),
  boardTitle: text("board_title").notNull(),
  classSlug: text("class_slug").notNull(),
  classTitle: text("class_title").notNull(),
  title: text("title").notNull(),
  examDate: timestamp("exam_date", { withTimezone: true }).notNull(),
});

export const legalPages = pgTable("legal_pages", {
  slug: text("slug").primaryKey(),
  content: jsonb("content").$type<Record<string, unknown>>().notNull(),
});

export const mcqs = pgTable("mcqs", {
  id: serial("id").primaryKey(),
  chapterKey: text("chapter_key").notNull(),
  question: text("question").notNull(),
  options: jsonb("options").$type<{ label: string; text: string }[]>().default([]).notNull(),
  correctLabel: text("correct_label").notNull(),
  reason: text("reason").notNull().default(""),
});

export const quizScores = pgTable("quiz_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  chapterKey: text("chapter_key").notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  subjectKey: text("subject_key").notNull(),
  subjectLabel: text("subject_label").notNull(),
  visitedChapters: jsonb("visited_chapters").$type<string[]>().default([]).notNull(),
  totalChapters: integer("total_chapters").notNull().default(0),
  lastPath: text("last_path").notNull().default(""),
  lastLabel: text("last_label").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const flashcardProgress = pgTable("flashcard_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  chapterKey: text("chapter_key").notNull(),
  masteredIndices: jsonb("mastered_indices").$type<number[]>().default([]).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const classrooms = pgTable("classrooms", {
  id: serial("id").primaryKey(),
  teacherUserId: integer("teacher_user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  joinCode: text("join_code").unique().notNull(),
  boardSlug: text("board_slug").notNull(),
  classSlug: text("class_slug").notNull(),
  subjectSlug: text("subject_slug").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const classroomMembers = pgTable("classroom_members", {
  id: serial("id").primaryKey(),
  classroomId: integer("classroom_id").references(() => classrooms.id, { onDelete: "cascade" }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
});

export const classroomAssignments = pgTable("classroom_assignments", {
  id: serial("id").primaryKey(),
  classroomId: integer("classroom_id").references(() => classrooms.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  exercisePath: text("exercise_path").notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const classroomsRelations = relations(classrooms, ({ many }) => ({
  members: many(classroomMembers),
  assignments: many(classroomAssignments),
}));

export const classroomMembersRelations = relations(classroomMembers, ({ one }) => ({
  classroom: one(classrooms, {
    fields: [classroomMembers.classroomId],
    references: [classrooms.id],
  }),
  user: one(users, {
    fields: [classroomMembers.userId],
    references: [users.id],
  }),
}));

export const classroomAssignmentsRelations = relations(classroomAssignments, ({ one }) => ({
  classroom: one(classrooms, {
    fields: [classroomAssignments.classroomId],
    references: [classrooms.id],
  }),
}));

export const quizScoresRelations = relations(quizScores, ({ one }) => ({
  user: one(users, {
    fields: [quizScores.userId],
    references: [users.id],
  }),
}));
