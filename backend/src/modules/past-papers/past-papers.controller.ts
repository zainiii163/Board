import type { Response, NextFunction } from "express";

import * as pastPapersService from "./past-papers.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";

const readQueryValue = (value: unknown) => {
  if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : undefined;
  if (typeof value === "string") return value;
  return undefined;
};

export const list = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const board = readQueryValue(req.query.board);
    const year = readQueryValue(req.query.year);
    res.json(await pastPapersService.listPastPapers(board, year));
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    res.json(await pastPapersService.getPastPaper(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const paper = await pastPapersService.createPastPaper(req.body ?? {});
    res.status(201).json(paper);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const paper = await pastPapersService.updatePastPaper(Number(req.params.id), req.body ?? {});
    res.json(paper);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    res.json(await pastPapersService.deletePastPaper(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
};
