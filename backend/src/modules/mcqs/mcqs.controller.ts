import type { Response, NextFunction } from "express";

import * as mcqsService from "./mcqs.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";

const readQueryValue = (value: unknown) => {
  if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : undefined;
  if (typeof value === "string") return value;
  return undefined;
};

export const list = async (req: AuthedRequest, res: Response) => {
  const board = readQueryValue(req.query.board);
  const classSlug = readQueryValue(req.query.class);
  const subject = readQueryValue(req.query.subject);
  const chapter = readQueryValue(req.query.chapter);
  res.json(await mcqsService.listMcqs(board, classSlug, subject, chapter));
};

export const getById = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const mcq = await mcqsService.getMcq(Number(req.params.id));
    res.json(mcq);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const mcq = await mcqsService.createMcq(req.body ?? {});
    res.status(201).json(mcq);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const mcq = await mcqsService.updateMcq(Number(req.params.id), req.body ?? {});
    res.json(mcq);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await mcqsService.deleteMcq(Number(req.params.id));
    res.json(result);
  } catch (error) {
    next(error);
  }
};
