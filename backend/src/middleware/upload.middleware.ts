import type { Request, Response, NextFunction } from "express";

const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export function validateUpload(req: Request, res: Response, next: NextFunction) {
  // Placeholder — will validate file type, size, reject executables.
  void ALLOWED_TYPES;
  void MAX_SIZE;
  next();
}
