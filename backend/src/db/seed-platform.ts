import { eq } from "drizzle-orm";

import { db } from "./index.js";
import * as schema from "./schema.js";
import { authorsStore } from "../store/authors-store.js";
import { commentsStore } from "../store/comments-store.js";
import { examsStore } from "../store/exams-store.js";
import { legalStore, type LegalPageSlug } from "../store/legal-store.js";

export async function seedPlatformContent() {
  const existingAuthors = await db.select({ id: schema.authors.id }).from(schema.authors).limit(1);
  if (existingAuthors.length > 0) return;

  console.log("[db] Seeding platform CMS (authors, exams, legal, comments, MCQs)…");

  for (const author of authorsStore.list()) {
    await db.insert(schema.authors).values({
      slug: author.slug,
      name: author.name,
      title: author.title,
      bio: author.bio,
      boards: author.boards,
      noteCount: author.noteCount,
    });
  }

  for (const exam of examsStore.list()) {
    await db.insert(schema.examDates).values({
      boardSlug: exam.boardSlug,
      boardTitle: exam.boardTitle,
      classSlug: exam.classSlug,
      classTitle: exam.classTitle,
      title: exam.title,
      examDate: new Date(exam.examDate),
    });
  }

  for (const page of legalStore.list()) {
    const full = legalStore.get(page.slug as LegalPageSlug);
    if (!full) continue;
    const { slug, ...content } = full;
    await db.insert(schema.legalPages).values({ slug, content });
  }

  for (const comment of commentsStore.listModeration()) {
    await db.insert(schema.questionComments).values({
      userId: comment.userId,
      userName: comment.userName,
      pagePath: comment.pagePath,
      questionRef: comment.questionRef,
      body: comment.body,
      status: comment.status,
      createdAt: new Date(comment.createdAt),
    });
  }

  const demoMcqs = [
    {
      chapterKey: "fbise/9/mathematics/real-numbers",
      question: "Which of the following is a rational number?",
      options: [
        { label: "A", text: "$0.75$" },
        { label: "B", text: "$\\sqrt{2}$" },
        { label: "C", text: "$\\pi$" },
        { label: "D", text: "$\\sqrt{5}$" },
      ],
      correctLabel: "A",
      reason: "$0.75 = \\frac{3}{4}$, which is rational.",
    },
    {
      chapterKey: "fbise/9/mathematics/real-numbers",
      question: "$\\sqrt{12}$ simplifies to:",
      options: [
        { label: "A", text: "$2\\sqrt{3}$" },
        { label: "B", text: "$3\\sqrt{2}$" },
        { label: "C", text: "$6$" },
        { label: "D", text: "$4\\sqrt{3}$" },
      ],
      correctLabel: "A",
      reason: "$\\sqrt{12} = \\sqrt{4 \\times 3} = 2\\sqrt{3}$.",
    },
    {
      chapterKey: "fbise/9/mathematics/real-numbers",
      question: "Every integer is also a:",
      options: [
        { label: "A", text: "Rational number" },
        { label: "B", text: "Irrational number" },
        { label: "C", text: "Complex number only" },
        { label: "D", text: "None of these" },
      ],
      correctLabel: "A",
      reason: "Integers can be written as $\\frac{n}{1}$, so they are rational.",
    },
  ];

  for (const mcq of demoMcqs) {
    await db.insert(schema.mcqs).values(mcq);
  }
}

export async function seedDemoClassroom() {
  const existing = await db.query.classrooms.findFirst({ where: eq(schema.classrooms.joinCode, "FB9MAT") });
  if (existing) return;

  const teacher = await db.query.users.findFirst({ where: eq(schema.users.email, "teacher@boardnotes.com") });
  if (!teacher) return;

  const [classroom] = await db
    .insert(schema.classrooms)
    .values({
      teacherUserId: teacher.id,
      name: "FBISE Class 9 Math — Section A",
      joinCode: "FB9MAT",
      boardSlug: "fbise",
      classSlug: "9",
      subjectSlug: "mathematics",
    })
    .returning();

  await db.insert(schema.classroomAssignments).values({
    classroomId: classroom.id,
    title: "Exercise 1.1 — Real Numbers",
    exercisePath: "/fbise/9/mathematics/real-numbers/exercise-1-1",
  });
}

export async function seedDemoChapterVideo() {
  const chapter = await db.query.chapters.findFirst({ where: eq(schema.chapters.slug, "real-numbers") });
  if (!chapter || chapter.videoUrl) return;

  await db
    .update(schema.chapters)
    .set({ videoUrl: "https://www.youtube.com/watch?v=11q8Yj__ORo" })
    .where(eq(schema.chapters.id, chapter.id));
}
