import { db } from "./index.js";
import * as schema from "./schema.js";
import { seedBoardContent } from "./seed-content.js";
import { seedPlatformContent, seedDemoClassroom, seedDemoChapterVideo } from "./seed-platform.js";
import { seedRegionalBoardContent } from "./seed-board-backfill.js";
import { seedLogarithmsEnrichment } from "./seed-logarithms-enrichment.js";
import { seedBookCovers } from "./seed-book-covers.js";

export async function seedIfEmpty() {
  const existing = await db.select({ id: schema.boards.id }).from(schema.boards).limit(1);
  if (existing.length > 0) {
    console.log("[db] Content already seeded — using PostgreSQL as source of truth.");
    await seedPlatformContent();
    await seedDemoClassroom();
    await seedDemoChapterVideo();
    await seedRegionalBoardContent();
    await seedLogarithmsEnrichment();
    await seedBookCovers();
    return;
  }
  console.log("[db] Empty database — seeding board content from demo catalog…");
  await seedBoardContent();
  await seedPlatformContent();
  await seedDemoClassroom();
  await seedDemoChapterVideo();
  await seedBookCovers();
  console.log("[db] Seed complete. Admin CMS changes will persist to PostgreSQL.");
}
