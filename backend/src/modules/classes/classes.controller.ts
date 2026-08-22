import type { Request, Response, NextFunction } from "express";

import * as classesService from "./classes.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";

const asString = (value: string | string[] | undefined) =>
  Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

export const list = async (_req: Request, res: Response) => {
  res.json(await classesService.listClasses());
};

export const getBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await classesService.getClassBySlug(asString(req.params.slug)));
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const created = await classesService.createClass(req.body ?? {});
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = await classesService.updateClass(asString(req.params.slug), req.body ?? {});
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await classesService.deleteClass(asString(req.params.slug));
    res.json(result);
  } catch (error) {
    next(error);
  }
};
