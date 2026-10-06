import { sql } from "drizzle-orm";

import { db } from "./index.js";
import * as schema from "./schema.js";
import { seedBoardContent } from "./seed-content.js";
import { seedPlatformContent, seedDemoClassroom, seedDemoChapterVideo } from "./seed-platform.js";
import { seedRegionalBoardContent } from "./seed-board-backfill.js";
import { seedLogarithmsEnrichment } from "./seed-logarithms-enrichment.js";
import { seedBookCovers } from "./seed-book-covers.js";
import { seedSubjectsAndMCQs } from "./seed-subjects-mcqs.js";
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

export async function seedIfEmpty() {
  await ensurePastPaperColumns();
  const existing = await db.select({ id: schema.boards.id }).from(schema.boards).limit(1);
  if (existing.length > 0) {
    console.log("[db] Content already seeded — using PostgreSQL as source of truth.");
    await seedPlatformContent();
    await seedDemoClassroom();
    await seedDemoChapterVideo();
    await seedRegionalBoardContent();
    // Idempotent, so these run on every boot: they register the Punjab variant
    // boards on a database that was seeded before they existed. Must come before
    // seedSubjectsAndMCQs, which fills in subjects/chapters for whatever boards
    // are present.
    await seedPunjabVariantBoards();
    await seedPunjabVariantPastPapers();
    await seedLogarithmsEnrichment();
    await seedBookCovers();
    await seedSubjectsAndMCQs();
    return;
  }
  console.log("[db] Empty database — seeding board content from demo catalog…");
  await seedBoardContent();
  await seedPlatformContent();
  await seedDemoClassroom();
  await seedDemoChapterVideo();
  await seedPunjabVariantBoards();
  await seedPunjabVariantPastPapers();
  await seedBookCovers();
  await seedSubjectsAndMCQs();
  console.log("[db] Seed complete. Admin CMS changes will persist to PostgreSQL.");
}
