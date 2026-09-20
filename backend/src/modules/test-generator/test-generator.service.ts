import { like, or } from "drizzle-orm";

import { db } from "../../db/index.js";
import { mcqs } from "../../db/schema.js";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function generateTest(
  board: string,
  classSlug: string,
  subject: string,
  chapterSlugs: string[],
  mcqCount: number,
) {
  const patterns = chapterSlugs.map(
    (slug) => `${board}/${classSlug}/${subject}/${slug}`,
  );

  const conditions = patterns.map((p) => like(mcqs.chapterKey, p));
  const whereClause = conditions.length === 1 ? conditions[0] : or(...conditions);
  const rows = await db
    .select({
      id: mcqs.id,
      question: mcqs.question,
      options: mcqs.options,
      chapterKey: mcqs.chapterKey,
    })
    .from(mcqs)
    .where(whereClause);

  const picked = shuffle(rows).slice(0, mcqCount);
  const timeMinutes = Math.max(10, Math.ceil(picked.length * 1.5));

  return { mcqs: picked, timeMinutes };
}
