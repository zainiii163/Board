import type { Response, NextFunction } from "express";

import * as quizService from "./quiz.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/api-error.js";

export const getQuiz = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const { board, class: classSlug, subject, chapter } = req.query;
    if (!board || !classSlug || !subject || !chapter) {
      throw ApiError.badRequest("board, class, subject, chapter required.");
    }
    const quiz = await quizService.getChapterQuiz(
      String(board),
      String(classSlug),
      String(subject),
      String(chapter),
    );
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const { chapterKey, answers } = req.body ?? {};
    const result = await quizService.submitQuizScore(req.user.userId, chapterKey, answers ?? {});
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const myScores = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const scores = await quizService.getUserQuizScores(req.user.userId);
    res.json(scores);
  } catch (error) {
    next(error);
  }
};
