import { pgTable, serial, text, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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
  formulas: jsonb("formulas").$type<string[]>().default([]).notNull(),
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
  marks: integer("marks").notNull(),
  difficulty: text("difficulty").notNull(),
  pdfName: text("pdf_name"),
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
