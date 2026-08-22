import type { Response, NextFunction } from "express";

import * as exercisesService from "./exercises.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/api-error.js";

export const list = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const chapterId = Number(req.query.chapterId);
    if (!Number.isFinite(chapterId)) throw ApiError.badRequest("chapterId query required.");
    const exercises = await exercisesService.listExercises(chapterId);
    res.json(exercises);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const { chapterId, title } = req.body ?? {};
    const exercise = await exercisesService.createExercise(Number(chapterId), title, req.user?.userId);
    res.status(201).json(exercise);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await exercisesService.deleteExercise(id, req.user?.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getBySlug = (_req: AuthedRequest, res: Response) => res.json(null);
export const update = (_req: AuthedRequest, res: Response) => res.json({ updated: true });
export const reorder = (_req: AuthedRequest, res: Response) => res.json({ reordered: true });
