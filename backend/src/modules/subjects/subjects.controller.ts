import type { Request, Response, NextFunction } from "express";

import * as subjectsService from "./subjects.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";

const asString = (value: string | string[] | undefined) =>
  Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

const readQueryNumber = (value: unknown) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const num = Number(raw);
  return Number.isFinite(num) ? num : undefined;
};

export const list = async (req: Request, res: Response) => {
  const classId = readQueryNumber(req.query.classId);
  const board = asString(req.query.board);
  const classSlug = asString(req.query.class);
  res.json(await subjectsService.listSubjects(classId, board || undefined, classSlug || undefined));
};

export const getBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await subjectsService.getSubjectBySlug(asString(req.params.slug)));
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const created = await subjectsService.createSubject(req.body ?? {});
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = await subjectsService.updateSubject(asString(req.params.slug), req.body ?? {});
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await subjectsService.deleteSubject(asString(req.params.slug));
    res.json(result);
  } catch (error) {
    next(error);
  }
};
