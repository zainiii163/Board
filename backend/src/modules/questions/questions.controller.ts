import type { Response, NextFunction } from "express";

import * as questionsService from "./questions.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/api-error.js";

const readQueryValue = (value: unknown, fallback: string) => {
  if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : fallback;
  if (typeof value === "string") return value;
  return fallback;
};

export const list = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const exerciseId = Number(req.query.exerciseId);
    if (Number.isFinite(exerciseId)) {
      const questions = await questionsService.listQuestions(exerciseId);
      return res.json(questions);
    }

    const board = readQueryValue(req.query.board, "fbise");
    const classSlug = readQueryValue(req.query.class, "9");
    const subject = readQueryValue(req.query.subject, "mathematics");
    const chapter = readQueryValue(req.query.chapter, "real-numbers");
    const exercise = readQueryValue(req.query.exercise, "exercise-1-1");
    const questionNum = Number(readQueryValue(req.query.question, "3") || "3");

    const { getQuestionData } = await import("../../demo-data.js");
    const data = getQuestionData(board, classSlug, subject, chapter, exercise, questionNum);
    if (!data) throw ApiError.notFound("Question not found.");
    return res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    for (const chapter of (await import("../../store/cms-store.js")).cmsStore.listChaptersAdmin()) {
      for (const exercise of (await import("../../store/cms-store.js")).cmsStore.listExercises(chapter.id)) {
        const question = (await import("../../store/cms-store.js")).cmsStore
          .listQuestions(exercise.id)
          .find((q) => q.id === id);
        if (question) return res.json(question);
      }
    }
    throw ApiError.notFound("Question not found.");
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const { exerciseId, ...body } = req.body ?? {};
    const question = await questionsService.createQuestion(Number(exerciseId), body, req.user?.userId);
    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const question = await questionsService.updateQuestion(id, req.body ?? {}, req.user?.userId);
    res.json(question);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await questionsService.deleteQuestion(id, req.user?.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
