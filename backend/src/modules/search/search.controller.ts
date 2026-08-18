import type { Request, Response } from "express";

export const search = (req: Request, res: Response) => {
  const q = req.query.q ?? "";
  res.json({ query: q, results: [] });
};
