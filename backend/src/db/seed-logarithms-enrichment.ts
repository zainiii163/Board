import { eq } from "drizzle-orm";

import { db } from "./index.js";
import * as schema from "./schema.js";

/** Add newer FBISE Logarithms demo questions when an older DB only has the original ones. */
export async function seedLogarithmsEnrichment() {
  const chapter = await db.query.chapters.findFirst({
    where: eq(schema.chapters.slug, "logarithms"),
    with: {
      subject: { with: { class: { with: { board: true } } } },
      exercises: { with: { questions: true } },
    },
  });
  if (!chapter || chapter.subject.class.board.slug !== "fbise") return;

  const ex31 = chapter.exercises.find((e) => e.slug === "exercise-3-1");
  const ex32 = chapter.exercises.find((e) => e.slug === "exercise-3-2");
  if (!ex31 || !ex32) return;

  if (!ex31.questions.some((q) => q.num === 2)) {
    const [inserted] = await db
      .insert(schema.questions)
      .values({
        exerciseId: ex31.id,
        num: 2,
        questionText: "Write $\\log_2 8$ as a simple number.",
        questionTextUr: "$\\log_2 8$ کو سادہ عدد کی صورت میں لکھیں۔",
        marks: 2,
        difficulty: "Easy",
        pdfName: null,
        stepsUr: [
          { title: "معنی", content: "$\\log_2 8 = x$ کا مطلب $2^x = 8$ ہے۔" },
          { title: "حل", content: "$2^3 = 8$، لہٰذا $x = 3$۔" },
          { title: "جواب", content: "$3$" },
        ],
      })
      .returning();
    await db.insert(schema.solutionSteps).values([
      { questionId: inserted.id, stepOrder: 0, title: "Meaning", content: "$\\log_2 8 = x$ means $2^x = 8$." },
      { questionId: inserted.id, stepOrder: 1, title: "Working", content: "$2^3 = 8$, so $x = 3$." },
      { questionId: inserted.id, stepOrder: 2, title: "Answer", content: "$3$" },
    ]);
  }

  if (!ex32.questions.some((q) => q.num === 1)) {
    const [inserted] = await db
      .insert(schema.questions)
      .values({
        exerciseId: ex32.id,
        num: 1,
        questionText: "Simplify $\\log_{10} 100 + \\log_{10} 10$.",
        questionTextUr: "$\\log_{10} 100 + \\log_{10} 10$ سادہ کریں۔",
        marks: 2,
        difficulty: "Easy",
        pdfName: null,
        stepsUr: [
          { title: "قیمت", content: "$\\log_{10} 100 = 2$ اور $\\log_{10} 10 = 1$۔" },
          { title: "جمع", content: "$2 + 1 = 3$" },
          { title: "جواب", content: "$3$" },
        ],
      })
      .returning();
    await db.insert(schema.solutionSteps).values([
      {
        questionId: inserted.id,
        stepOrder: 0,
        title: "Evaluate",
        content: "$\\log_{10} 100 = 2$ and $\\log_{10} 10 = 1$.",
      },
      { questionId: inserted.id, stepOrder: 1, title: "Add", content: "$2 + 1 = 3$" },
      { questionId: inserted.id, stepOrder: 2, title: "Answer", content: "$3$" },
    ]);
  }
}
