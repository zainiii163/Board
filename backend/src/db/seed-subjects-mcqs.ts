import { and, eq, sql } from "drizzle-orm";

import { db } from "./index.js";
import * as schema from "./schema.js";
import { publishedCurriculumSubjects } from "./seed-book-covers.js";

async function renameLegacyClassFiveSocialStudies(classId: number, boardSlug: string, classSlug: string) {
  if (boardSlug !== "fbise" || classSlug !== "5") return;

  const legacy = await db.query.subjects.findFirst({
    where: and(eq(schema.subjects.classId, classId), eq(schema.subjects.slug, "pakistan-studies")),
  });
  const replacement = await db.query.subjects.findFirst({
    where: and(eq(schema.subjects.classId, classId), eq(schema.subjects.slug, "social-studies")),
  });

  // The old record came from the placeholder seed and has no chapter content
  // after cleanup. Preserve a real editor-created record if both exist.
  if (legacy && !replacement) {
    const chapters = await db.query.chapters.findMany({ where: eq(schema.chapters.subjectId, legacy.id) });
    if (chapters.length === 0) {
      await db
        .update(schema.subjects)
        .set({ slug: "social-studies", title: "Social Studies" })
        .where(eq(schema.subjects.id, legacy.id));
    }
  }
}

async function removePlaceholderSubject(subjectId: number, boardSlug: string, classSlug: string, subjectSlug: string) {
  const chapters = await db.query.chapters.findMany({
    where: eq(schema.chapters.subjectId, subjectId),
    with: { exercises: true },
  });

  // Preserve any editor-authored content. The bad seed created only chapters
  // with this exact summary shape and no exercises.
  const onlyPlaceholderContent = chapters.length > 0 && chapters.every((chapter) => (
    chapter.summary.startsWith("Study material for ") && chapter.exercises.length === 0
  ));
  if (!onlyPlaceholderContent) return false;

  const chapterPrefix = `${boardSlug}/${classSlug}/${subjectSlug}/%`;
  await db.delete(schema.mcqs).where(sql`${schema.mcqs.chapterKey} LIKE ${chapterPrefix}`);
  await db.delete(schema.chapters).where(eq(schema.chapters.subjectId, subjectId));
  return true;
}

export async function seedSubjectsAndMCQs() {
  console.log("[db] Syncing the published curriculum catalog…");

  const boards = await db.query.boards.findMany();

  for (const board of boards) {
    const classes = await db.query.classes.findMany({
      where: eq(schema.classes.boardId, board.id),
    });

    for (const klass of classes) {
      await renameLegacyClassFiveSocialStudies(klass.id, board.slug, klass.slug);
      const allowedSubjects = publishedCurriculumSubjects(board.slug, klass.slug);
      const allowedSlugs = new Set(allowedSubjects.map((subject) => subject.slug));
      const existingSubjects = await db.query.subjects.findMany({
        where: eq(schema.subjects.classId, klass.id),
      });

      for (const existingSubject of existingSubjects) {
        const placeholderRemoved = await removePlaceholderSubject(
          existingSubject.id,
          board.slug,
          klass.slug,
          existingSubject.slug,
        );
        if (placeholderRemoved && !allowedSlugs.has(existingSubject.slug)) {
          await db.delete(schema.subjects).where(eq(schema.subjects.id, existingSubject.id));
        }
      }

      for (const subject of allowedSubjects) {
        const matchingSubjects = await db.query.subjects.findMany({
          where: and(
            eq(schema.subjects.classId, klass.id),
            eq(schema.subjects.slug, subject.slug),
          ),
        });

        // There is no database uniqueness constraint on (class_id, slug), and
        // the development server can start two seed passes at once. Remove only
        // duplicate empty records; anything with chapters is preserved for an
        // editor to review rather than silently discarded.
        const [existingSubject, ...duplicates] = matchingSubjects;
        for (const duplicate of duplicates) {
          const duplicateChapters = await db.query.chapters.findMany({
            where: eq(schema.chapters.subjectId, duplicate.id),
          });
          if (duplicateChapters.length === 0) {
            await db.delete(schema.subjects).where(eq(schema.subjects.id, duplicate.id));
          }
        }

        if (!existingSubject) {
          await db
            .insert(schema.subjects)
            .values({ classId: klass.id, slug: subject.slug, title: subject.title })
            .returning();
        }
      }
    }
  }

  console.log("[db] Published curriculum catalog synced.");
}
