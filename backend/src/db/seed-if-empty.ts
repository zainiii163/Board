import { sql } from "drizzle-orm";

import { db } from "./index.js";
import * as schema from "./schema.js";
import { seedBoardContent } from "./seed-content.js";
import { seedPlatformContent, seedDemoClassroom, seedDemoChapterVideo } from "./seed-platform.js";
import { seedRegionalBoardContent } from "./seed-board-backfill.js";
import { seedLogarithmsEnrichment } from "./seed-logarithms-enrichment.js";
import { seedBookCovers } from "./seed-book-covers.js";
import { seedSubjectsAndMCQs } from "./seed-subjects-mcqs.js";
import { seedFbisePastPaperSources } from "./seed-fbise-past-paper-sources.js";
import { seedPunjabVariantBoards, seedPunjabVariantPastPapers } from "./seed-punjab-variants.js";

async function ensurePastPaperColumns() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "past_papers" (
      "id" serial PRIMARY KEY NOT NULL,
      "board_slug" text NOT NULL,
      "board_title" text NOT NULL,
      "class_slug" text NOT NULL,
      "class_title" text NOT NULL,
      "subject_slug" text NOT NULL,
      "subject_title" text NOT NULL,
      "year" text NOT NULL,
      "session_type" text DEFAULT 'annual' NOT NULL,
      "pdf_url" text
    )
  `);
  await db.execute(sql`ALTER TABLE "past_papers" ADD COLUMN IF NOT EXISTS "paper_type" text DEFAULT 'first-annual' NOT NULL`);
  await db.execute(sql`ALTER TABLE "past_papers" ADD COLUMN IF NOT EXISTS "drive_url" text`);
  await db.execute(sql`ALTER TABLE "past_papers" ADD COLUMN IF NOT EXISTS "is_solved" boolean DEFAULT false NOT NULL`);
  await db.execute(sql`ALTER TABLE "past_papers" ADD COLUMN IF NOT EXISTS "syllabus" text DEFAULT 'new' NOT NULL`);
  await db.execute(sql`ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "cover_url" text`);
  await db.execute(sql`ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "drive_url" text`);
  await db.execute(sql`ALTER TABLE "chapters" ADD COLUMN IF NOT EXISTS "video_url" text`);
  await db.execute(sql`ALTER TABLE "chapters" ADD COLUMN IF NOT EXISTS "drive_url" text`);
}

async function runOptional(label: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (err) {
    console.warn(`[db] Optional seed "${label}" skipped:`, err instanceof Error ? err.message : err);
  }
}

export async function seedIfEmpty() {
  await ensurePastPaperColumns();
  const existing = await db.select({ id: schema.boards.id }).from(schema.boards).limit(1);
  if (existing.length > 0) {
    console.log("[db] Content already seeded — using PostgreSQL as source of truth.");
    await runOptional("platform", seedPlatformContent);
    await runOptional("classroom", seedDemoClassroom);
    await runOptional("chapter-video", seedDemoChapterVideo);
    await runOptional("regional-boards", seedRegionalBoardContent);
    // Idempotent: Punjab variants before subject sync; FBISE sources last.
    await runOptional("punjab-variant-boards", seedPunjabVariantBoards);
    await runOptional("punjab-variant-papers", seedPunjabVariantPastPapers);
    await runOptional("logarithms", seedLogarithmsEnrichment);
    await runOptional("book-covers", seedBookCovers);
    await runOptional("subjects-mcqs", seedSubjectsAndMCQs);
    await runOptional("fbise-past-paper-sources", seedFbisePastPaperSources);
    return;
  }
  console.log("[db] Empty database — seeding board content from demo catalog…");
  await seedBoardContent();
  await runOptional("platform", seedPlatformContent);
  await runOptional("classroom", seedDemoClassroom);
  await runOptional("chapter-video", seedDemoChapterVideo);
  await runOptional("punjab-variant-boards", seedPunjabVariantBoards);
  await runOptional("punjab-variant-papers", seedPunjabVariantPastPapers);
  await runOptional("book-covers", seedBookCovers);
  await runOptional("subjects-mcqs", seedSubjectsAndMCQs);
  await runOptional("fbise-past-paper-sources", seedFbisePastPaperSources);
  console.log("[db] Seed complete. Admin CMS changes will persist to PostgreSQL.");
}
