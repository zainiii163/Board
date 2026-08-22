import type { Response, NextFunction } from "express";

import * as booksService from "./books.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";

const readQueryValue = (value: unknown) => {
  if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : undefined;
  if (typeof value === "string") return value;
  return undefined;
};

export const list = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const board = readQueryValue(req.query.board);
    res.json(await booksService.listBooks(board));
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    res.json(await booksService.getBook(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const book = await booksService.createBook(req.body ?? {});
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const book = await booksService.updateBook(Number(req.params.id), req.body ?? {});
    res.json(book);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    res.json(await booksService.deleteBook(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
};
