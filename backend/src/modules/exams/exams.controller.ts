import type { Response, NextFunction } from "express";

import * as examsService from "./exams.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";

export const list = async (_req: unknown, res: Response) => {
  res.json(await examsService.listUpcomingExams());
};

export const listAll = async (_req: unknown, res: Response) => {
  res.json(await examsService.listExams());
};

export const getById = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    res.json(await examsService.getExamById(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const exam = await examsService.createExam(req.body ?? {});
    res.status(201).json(exam);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const exam = await examsService.updateExam(Number(req.params.id), req.body ?? {});
    res.json(exam);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    res.json(await examsService.deleteExam(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
};
