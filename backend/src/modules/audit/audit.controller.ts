import type { Response, NextFunction } from "express";

import * as auditService from "./audit.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";

export const list = async (_req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const logs = await auditService.listAuditLogs();
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

export const stats = async (_req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await auditService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
