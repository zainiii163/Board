import type { Response } from "express";

import * as formulasService from "./formulas.service.js";

export const list = async (_req: unknown, res: Response) => {
  res.json(await formulasService.listFormulaSheets());
};
