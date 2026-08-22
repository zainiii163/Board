import multer from "multer";
import type { Response, NextFunction } from "express";

import * as pdfsService from "./pdfs.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/api-error.js";

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf" && !file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(new Error("Only PDF files allowed"));
      return;
    }
    cb(null, true);
  },
});

export const uploadMiddleware = multerUpload.single("file");

export const list = async (_req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    res.json(await pdfsService.listPdfs());
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const pdf = await pdfsService.getPdf(String(req.params.id));
    res.json(pdf);
  } catch (error) {
    next(error);
  }
};

export const upload = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) throw ApiError.badRequest("PDF file is required.");
    const saved = await pdfsService.savePdfUpload(req.file.originalname, req.file.buffer);
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await pdfsService.deletePdf(String(req.params.id));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const storageInfo = (_req: AuthedRequest, res: Response) => {
  res.json({
    mode: pdfsService.getStorageMode(),
    r2: pdfsService.isUsingR2(),
  });
};
