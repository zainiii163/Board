import type { Response, NextFunction } from "express";

import * as progressService from "./progress.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/api-error.js";

const asString = (value: unknown) => {
  if (Array.isArray(value)) return String(value[0] ?? "");
  if (typeof value === "string") return value;
  return "";
};

export const getMine = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const progress = await progressService.getProgress(req.user.userId);
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

export const track = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const { subjectKey, chapterSlug, path, label } = req.body ?? {};
    const entry = await progressService.trackVisit(req.user.userId, {
      subjectKey,
      chapterSlug,
      path,
      label,
    });
    res.json(entry);
  } catch (error) {
    next(error);
  }
};

export const getFlashcards = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const chapterKey = asString(req.query.chapterKey);
    const progress = await progressService.getFlashcardProgress(req.user.userId, chapterKey);
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

export const updateFlashcards = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const { chapterKey, cardIndex, mastered } = req.body ?? {};
    const progress = await progressService.updateFlashcardProgress(req.user.userId, {
      chapterKey: String(chapterKey ?? ""),
      cardIndex: Number(cardIndex),
      mastered: Boolean(mastered),
    });
    res.json(progress);
  } catch (error) {
    next(error);
  }
};
