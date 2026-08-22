import type { SearchResult } from "@boardnotes/shared";

import { BOARD_DATA } from "../../demo-data.js";
import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";

const asLower = (value: string) => value.toLowerCase().trim();

function searchDemoData(normalizedQuery: string) {
  const seen = new Set<string>();
  const results: SearchResult[] = [];

  const pushResult = (result: SearchResult) => {
    const key = `${result.type}:${result.path}`;
    if (!seen.has(key)) {
      seen.add(key);
      results.push(result);
    }
  };

  for (const board of Object.values(BOARD_DATA)) {
    for (const klass of board.classes) {
      for (const subject of klass.subjects) {
        for (const chapter of subject.chapters) {
          const chapterText = [chapter.title, chapter.summary].join(" ");
          const matchesChapter = !normalizedQuery || asLower(chapterText).includes(normalizedQuery);
          if (matchesChapter) {
            pushResult({
              title: chapter.title,
              board: board.title,
              boardSlug: board.slug,
              className: klass.title,
              classSlug: klass.slug,
              subject: subject.title,
              subjectSlug: subject.slug,
              path: `/${board.slug}/${klass.slug}/${subject.slug}/${chapter.slug}`,
              type: "chapter",
            });
          }

          for (const exercise of chapter.exercises) {
            const matchesExercise = !normalizedQuery || asLower(exercise.title).includes(normalizedQuery);
            if (matchesExercise) {
              pushResult({
                title: exercise.title,
                board: board.title,
                boardSlug: board.slug,
                className: klass.title,
                classSlug: klass.slug,
                subject: subject.title,
                subjectSlug: subject.slug,
                path: `/${board.slug}/${klass.slug}/${subject.slug}/${chapter.slug}/${exercise.slug}`,
                type: "exercise",
              });
            }

            for (const question of exercise.questions) {
              const questionText = `question ${question.num} ${question.question}`;
              const matchesQuestion = !normalizedQuery || asLower(questionText).includes(normalizedQuery);
              if (matchesQuestion) {
                pushResult({
                  title: `Question ${question.num}`,
                  board: board.title,
                  boardSlug: board.slug,
                  className: klass.title,
                  classSlug: klass.slug,
                  subject: subject.title,
                  subjectSlug: subject.slug,
                  path: `/${board.slug}/${klass.slug}/${subject.slug}/${chapter.slug}/${exercise.slug}/q/${question.num}`,
                  type: "question",
                });
              }
            }
          }
        }
      }
    }
  }

  return results;
}

async function searchDatabase(normalizedQuery: string) {
  const chapters = await db.query.chapters.findMany({
    with: {
      subject: {
        with: {
          class: {
            with: { board: true },
          },
        },
      },
      exercises: {
        with: { questions: true },
      },
    },
  });

  const seen = new Set<string>();
  const results: SearchResult[] = [];
  const pushResult = (result: SearchResult) => {
    const key = `${result.type}:${result.path}`;
    if (!seen.has(key)) {
      seen.add(key);
      results.push(result);
    }
  };

  for (const chapter of chapters) {
    if (chapter.status !== "published") continue;

    const subject = chapter.subject;
    const klass = subject.class;
    const board = klass.board;
    const base = {
      board: board.title,
      boardSlug: board.slug,
      className: klass.title,
      classSlug: klass.slug,
      subject: subject.title,
      subjectSlug: subject.slug,
    };
    const chapterPath = `/${board.slug}/${klass.slug}/${subject.slug}/${chapter.slug}`;

    if (!normalizedQuery || asLower(`${chapter.title} ${chapter.summary}`).includes(normalizedQuery)) {
      pushResult({ ...base, title: chapter.title, path: chapterPath, type: "chapter" });
    }

    for (const exercise of chapter.exercises) {
      const exercisePath = `${chapterPath}/${exercise.slug}`;
      if (!normalizedQuery || asLower(exercise.title).includes(normalizedQuery)) {
        pushResult({ ...base, title: exercise.title, path: exercisePath, type: "exercise" });
      }

      for (const question of exercise.questions) {
        const questionText = `question ${question.num} ${question.questionText}`;
        if (!normalizedQuery || asLower(questionText).includes(normalizedQuery)) {
          pushResult({
            ...base,
            title: `Question ${question.num}`,
            path: `${exercisePath}/q/${question.num}`,
            type: "question",
          });
        }
      }
    }
  }

  return results;
}

export async function searchContent(query: string) {
  const normalizedQuery = asLower(query);
  const results = useDb()
    ? await searchDatabase(normalizedQuery)
    : searchDemoData(normalizedQuery);
  const finalResults = normalizedQuery ? results : results.slice(0, 10);
  return { query, results: finalResults, total: finalResults.length };
}
