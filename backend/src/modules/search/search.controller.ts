import type { Request, Response } from "express";

import { SEARCH_RESULTS } from "../../demo-data.js";

export const search = (req: Request, res: Response) => {
  const q = String(req.query.q ?? "").trim().toLowerCase();

  const results = q
    ? SEARCH_RESULTS.filter((item) => {
      const haystack = [
        item.title,
        item.board,
        item.className,
        item.subject,
        item.path,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    })
    : SEARCH_RESULTS;

  res.json({ query: q, results });
};
