import multer from "multer";
import type { Response, NextFunction } from "express";

import * as booksService from "./books.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/api-error.js";

const readQueryValue = (value: unknown) => {
  if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : undefined;
  if (typeof value === "string") return value;
  return undefined;
};

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf" && !file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(new Error("Only PDF files allowed."));
      return;
    }
    cb(null, true);
  },
});

export const uploadMiddleware = multerUpload.single("file");

export const list = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    res.json(
      await booksService.listBooks({
        boardSlug: readQueryValue(req.query.board),
        classSlug: readQueryValue(req.query.class),
        subjectSlug: readQueryValue(req.query.subject),
      }),
    );
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

export const attachPdf = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) throw ApiError.badRequest("PDF file is required.");
    const book = await booksService.attachBookPdf(Number(req.params.id), req.file.originalname, req.file.buffer);
    res.json(book);
  } catch (error) {
    next(error);
  }
};
