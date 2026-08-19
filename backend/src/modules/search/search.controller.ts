import type { Request, Response } from "express";

import { BOARD_DATA } from "../../demo-data.js";

type SearchResult = {
  title: string;
  board: string;
  className: string;
  subject: string;
  path: string;
};

export const search = (req: Request, res: Response) => {
  const q = String(req.query.q ?? "").trim().toLowerCase();

  const results: SearchResult[] = [];

  for (const board of Object.values(BOARD_DATA)) {
    for (const klass of board.classes) {
      for (const subject of klass.subjects) {
        for (const chapter of subject.chapters) {
          // Check chapter
          if (
            chapter.title.toLowerCase().includes(q) ||
            chapter.summary.toLowerCase().includes(q)
          ) {
            results.push({
              title: chapter.title,
              board: board.title,
              className: klass.title,
              subject: subject.title,
              path: `/${board.slug}/${klass.slug}/${subject.slug}/${chapter.slug}`,
            });
          }

          for (const exercise of chapter.exercises) {
            // Check exercise
            if (exercise.title.toLowerCase().includes(q)) {
              results.push({
                title: exercise.title,
                board: board.title,
                className: klass.title,
                subject: subject.title,
                path: `/${board.slug}/${klass.slug}/${subject.slug}/${chapter.slug}/${exercise.slug}`,
              });
            }

            for (const question of exercise.questions) {
              // Check question text
              if (question.question.toLowerCase().includes(q) || `question ${question.num}`.toLowerCase().includes(q)) {
                results.push({
                  title: `Question ${question.num}`,
                  board: board.title,
                  className: klass.title,
                  subject: subject.title,
                  path: `/${board.slug}/${klass.slug}/${subject.slug}/${chapter.slug}/${exercise.slug}/q/${question.num}`,
                });
              }
            }
          }
        }
      }
    }
  }

  // To prevent overwhelming results if q is empty or small
  const finalResults = q ? results : results.slice(0, 10);

  res.json({ query: q, results: finalResults });
};
