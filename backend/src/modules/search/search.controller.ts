import type { Request, Response } from "express";

import * as searchService from "./search.service.js";

export const search = async (req: Request, res: Response) => {
  const q = String(req.query.q ?? "").trim();
  const payload = await searchService.searchContent(q);
  return res.json(payload);
};
