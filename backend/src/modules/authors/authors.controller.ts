import type { Response, NextFunction } from "express";

import * as authorsService from "./authors.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";

const asString = (value: string | string[] | undefined) =>
  Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

export const list = async (_req: AuthedRequest, res: Response) => {
  res.json(await authorsService.listAuthors());
};

export const getBySlug = async (req: AuthedRequest, res: Response) => {
  const author = await authorsService.getAuthorBySlug(asString(req.params.slug));
  if (!author) return res.status(404).json({ error: "Author not found." });
  return res.json(author);
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const author = await authorsService.createAuthor(req.body ?? {});
    res.status(201).json(author);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const author = await authorsService.updateAuthor(asString(req.params.slug), req.body ?? {});
    res.json(author);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    res.json(await authorsService.deleteAuthor(asString(req.params.slug)));
  } catch (error) {
    next(error);
  }
};
