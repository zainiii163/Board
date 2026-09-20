import type { Response, NextFunction } from "express";

import * as testGeneratorService from "./test-generator.service.js";
import { ApiError } from "../../utils/api-error.js";

export const generateTest = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { board, classSlug, subject, chapterSlugs, mcqCount } = req.body ?? {};
    if (!board || !classSlug || !subject || !chapterSlugs?.length || !mcqCount) {
      throw ApiError.badRequest("board, classSlug, subject, chapterSlugs, mcqCount required.");
    }
    const test = await testGeneratorService.generateTest(
      String(board),
      String(classSlug),
      String(subject),
      chapterSlugs,
      Number(mcqCount),
    );
    res.json({ test });
  } catch (error) {
    next(error);
  }
};
