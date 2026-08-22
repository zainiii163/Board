import type { Request, Response, NextFunction } from "express";

import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/api-error.js";

export type AuthedRequest = Request & {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
};

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Please sign in to continue."));
  }

  try {
    const token = header.slice(7);
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(ApiError.unauthorized("Session expired. Please sign in again."));
  }
}

export function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      req.user = verifyToken(header.slice(7));
    } catch {
      // ignore invalid token for optional auth
    }
  }
  return next();
}
