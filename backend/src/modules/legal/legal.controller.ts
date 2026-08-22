import type { Response, NextFunction } from "express";

import * as legalService from "./legal.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";

export const list = async (_req: AuthedRequest, res: Response) => {
  res.json(await legalService.listLegalPages());
};

export const getBySlug = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    res.json(await legalService.getLegalPage(String(req.params.slug)));
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    res.json(await legalService.updateLegalPage(String(req.params.slug), req.body ?? {}));
  } catch (error) {
    next(error);
  }
};
