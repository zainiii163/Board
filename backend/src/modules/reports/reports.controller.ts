import type { Response, NextFunction } from "express";

import * as reportsService from "./reports.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/api-error.js";

export const list = async (_req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const reports = await reportsService.listReports();
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const { pageUrl, boardSlug, questionRef, message } = req.body ?? {};
    const report = await reportsService.createReport({ pageUrl, boardSlug, questionRef, message });
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

export const resolve = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) throw ApiError.badRequest("Invalid report id.");
    const report = await reportsService.resolveReport(id);
    if (!report) throw ApiError.notFound("Report not found.");
    res.json(report);
  } catch (error) {
    next(error);
  }
};
