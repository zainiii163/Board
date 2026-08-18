import type { Request, Response, NextFunction } from "express";

export function rateLimit(_req: Request, _res: Response, next: NextFunction) {
  // Placeholder — will integrate express-rate-limit or similar.
  next();
}
