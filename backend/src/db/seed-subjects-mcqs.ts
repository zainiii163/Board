import { and, eq } from "drizzle-orm";

import { db } from "./index.js";
import * as schema from "./schema.js";

const SUBJECTS: { slug: string; title: string }[] = [
  { slug: "physics", title: "Physics" },
  { slug: "chemistry", title: "Chemistry" },
  { slug: "biology", title: "Biology" },
  { slug: "english", title: "English" },
  { slug: "urdu", title: "Urdu" },
  { slug: "computer-science", title: "Computer Science" },
  { slug: "islamiat", title: "Islamiyat" },
  { slug: "pakistan-studies", title: "Pakistan Studies" },
  { slug: "general-science", title: "General Science" },
];

type MCQ = {
  chapterKey: string;
  question: string;
  options: { label: string; text: string }[];
  correctLabel: string;
  reason: string;
};

function generateMathMCQs(board: string, classNum: number, chapter: string): MCQ[] {
  const prefix = `${board}/${classNum}/mathematics/${chapter}`;
  return [
    {
      chapterKey: prefix,
      question: `What is the result of simplifying the expression in this chapter?`,
      options: [
        { label: "A", text: "Option A is correct" },
        { label: "B", text: "Option B is incorrect" },
        { label: "C", text: "Option C is incorrect" },
        { label: "D", text: "Option D is incorrect" },
      ],
      correctLabel: "A",
      reason: "This is the correct answer based on the mathematical concepts in this chapter.",
    },
    {
      chapterKey: prefix,
      question: `Which property applies to the concept studied in this chapter?`,
      options: [
        { label: "A", text: "Property A" },
        { label: "B", text: "Property B" },
        { label: "C", text: "Property C" },
        { label: "D", text: "Property D" },
      ],
      correctLabel: "B",
      reason: "Property B is the fundamental property that applies here.",
    },
    {
      chapterKey: prefix,
      question: `Solve the problem using the method from this chapter.`,
      options: [
        { label: "A", text: "Solution 1" },
        { label: "B", text: "Solution 2" },
        { label: "C", text: "Solution 3" },
        { label: "D", text: "Solution 4" },
      ],
      correctLabel: "A",
      reason: "Using the standard method from this chapter, Solution 1 is correct.",
    },
  ];
}

function generateScienceMCQs(board: string, classNum: number, subject: string, chapter: string): MCQ[] {
  const prefix = `${board}/${classNum}/${subject}/${chapter}`;
  return [
    {
      chapterKey: prefix,
      question: `Which concept is fundamental to the topic of ${chapter.replace(/-/g, " ")}?`,
      options: [
        { label: "A", text: "Concept A" },
        { label: "B", text: "Concept B" },
        { label: "C", text: "Concept C" },
        { label: "D", text: "Concept D" },
      ],
      correctLabel: "A",
      reason: "Concept A is the most fundamental concept in this topic.",
    },
    {
      chapterKey: prefix,
      question: `What is the correct definition related to ${chapter.replace(/-/g, " ")}?`,
      options: [
        { label: "A", text: "Definition A" },
        { label: "B", text: "Definition B" },
        { label: "C", text: "Definition C" },
        { label: "D", text: "Definition D" },
      ],
      correctLabel: "C",
      reason: "Definition C accurately describes the concept.",
    },
    {
      chapterKey: prefix,
      question: `Which statement about ${chapter.replace(/-/g, " ")} is true?`,
      options: [
        { label: "A", text: "Statement A" },
        { label: "B", text: "Statement B" },
        { label: "C", text: "Statement C" },
        { label: "D", text: "Statement D" },
      ],
      correctLabel: "B",
      reason: "Statement B is the only true statement among the options.",
    },
  ];
}

const CHAPTER_MAP: Record<string, string[]> = {
  "physics": [
    "forces-and-motion", "energy-and-power", "properties-of-matter",
    "heat-and-temperature", "waves-and-sound", "light-and-optics",
    "electricity-and-magnetism", "atomic-and-nuclear-physics",
  ],
  "chemistry": [
    "fundamentals-of-chemistry", "atomic-structure", "chemical-bonding",
    "states-of-matter", "chemical-reactions", "acids-and-bases",
    "organic-chemistry", "environmental-chemistry",
  ],
  "biology": [
    "introduction-to-biology", "cells-and-tissues", "nutrition",
    "circulation", "respiration", "excretion",
    "coordination-and-control", "reproduction", "inheritance",
  ],
  "english": [
    "parts-of-speech", "tenses", "active-and-passive-voice",
    "direct-and-indirect-speech", "comprehension", "writing-skills",
    "literature", "grammar-and-usage",
  ],
  "urdu": [
    "nasr", "nazm", "ghazal", "tareekh-e-adab", "qawaid",
    "comprehension", "writing", "interview-and-report",
  ],
  "computer-science": [
    "introduction-to-computers", "hardware-and-software", "number-systems",
    "programming-fundamentals", "data-representation", "networking",
    "database-concepts", "web-development",
  ],
  "islamiat": [
    "quran-and-hadith", "imaniat", "ibadat",
    "muamalat", "akhlaq-and-adab", "history-of-islam",
  ],
  "pakistan-studies": [
    "ideology-of-pakistan", "history-of-pakistan", "government-of-pakistan",
    "geography-of-pakistan", "culture-and-society", "economic-development",
  ],
  "general-science": [
    "introduction-to-science", "living-things", "matter-and-its-properties",
    "force-and-energy", "earth-and-universe", "technology-and-society",
  ],
};

const CLASS_CHAPTERS: Record<number, string[]> = {
  5: ["introduction", "basics", "fundamentals", "exercises"],
  6: ["introduction", "basics", "fundamentals", "exercises"],
  7: ["introduction", "basics", "fundamentals", "exercises"],
  8: ["introduction", "basics", "fundamentals", "exercises"],
  9: ["chapter-1", "chapter-2", "chapter-3", "chapter-4"],
  10: ["chapter-1", "chapter-2", "chapter-3", "chapter-4"],
  11: ["chapter-1", "chapter-2", "chapter-3", "chapter-4"],
  12: ["chapter-1", "chapter-2", "chapter-3", "chapter-4"],
};

function getChaptersForSubject(subject: string, classNum: number): string[] {
  const specific = CHAPTER_MAP[subject];
  if (specific) return specific;
  return CLASS_CHAPTERS[classNum] || ["chapter-1", "chapter-2", "chapter-3", "chapter-4"];
}

export async function seedSubjectsAndMCQs() {
  console.log("[db] Seeding subjects and MCQs for all boards/classes…");

  const boards = await db.query.boards.findMany();
  const boardMap = new Map(boards.map((b) => [b.slug, b]));

  for (const board of boards) {
    const classes = await db.query.classes.findMany({
      where: eq(schema.classes.boardId, board.id),
    });

    for (const klass of classes) {
      const classNum = parseInt(klass.slug, 10);

      for (const subject of SUBJECTS) {
        const existingSubject = await db.query.subjects.findFirst({
          where: and(
            eq(schema.subjects.classId, klass.id),
            eq(schema.subjects.slug, subject.slug),
          ),
        });

        let subjectId = existingSubject?.id;
        if (!subjectId) {
          const [inserted] = await db
            .insert(schema.subjects)
            .values({ classId: klass.id, slug: subject.slug, title: subject.title })
            .returning();
          subjectId = inserted.id;
        }

        const chapters = getChaptersForSubject(subject.slug, classNum);
        for (const chapterSlug of chapters) {
          const existingChapter = await db.query.chapters.findFirst({
            where: and(
              eq(schema.chapters.subjectId, subjectId),
              eq(schema.chapters.slug, chapterSlug),
            ),
          });

          let chapterId = existingChapter?.id;
          if (!chapterId) {
            const title = chapterSlug
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
            const [inserted] = await db
              .insert(schema.chapters)
              .values({
                subjectId,
                slug: chapterSlug,
                title,
                summary: `Study material for ${subject.title} - ${title}`,
                formulas: [],
                formulasUr: [],
                definitions: [],
                status: "published",
              })
              .returning();
            chapterId = inserted.id;
          }

          const chapterKey = `${board.slug}/${klass.slug}/${subject.slug}/${chapterSlug}`;
          const existingMcqs = await db.query.mcqs.findFirst({
            where: eq(schema.mcqs.chapterKey, chapterKey),
          });

          if (!existingMcqs) {
            let mcqs: MCQ[];
            if (subject.slug === "mathematics") {
              mcqs = generateMathMCQs(board.slug, classNum, chapterSlug);
            } else {
              mcqs = generateScienceMCQs(board.slug, classNum, subject.slug, chapterSlug);
            }

            for (const mcq of mcqs) {
              await db.insert(schema.mcqs).values({
                chapterKey: mcq.chapterKey,
                question: mcq.question,
                options: mcq.options,
                correctLabel: mcq.correctLabel,
                reason: mcq.reason,
              });
            }
          }
        }
      }
    }
  }

  console.log("[db] Subjects and MCQs seeded.");
}
