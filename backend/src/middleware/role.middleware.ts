import type { Request, Response, NextFunction } from "express";

export function requireRole(...roles: string[]) {
  return (_req: Request, res: Response, next: NextFunction) => {
    // Placeholder — will check user role from auth context.
    const userRole = "admin";
    if (!roles.includes(userRole)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}
