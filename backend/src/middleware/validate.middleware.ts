import type { Request, Response, NextFunction } from "express";

export function validate(_req: Request, _res: Response, next: NextFunction) {
  // Placeholder — will use zod for request body validation.
  next();
}
