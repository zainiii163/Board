import type { Response, NextFunction } from "express";
import type { UserRole } from "@boardnotes/shared";

import { ApiError } from "../utils/api-error.js";
import type { AuthedRequest } from "./auth.middleware.js";

export function requireRole(...roles: UserRole[]) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!roles.includes(req.user.role as UserRole)) {
      return next(ApiError.forbidden("You do not have permission for this action."));
    }
    return next();
  };
}
