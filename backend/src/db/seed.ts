import { seedBoardContent } from "./seed-content.js";

async function seed() {
  console.log("Seeding database...");
  await seedBoardContent();
  console.log("Database seeding completed.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
