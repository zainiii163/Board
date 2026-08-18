import type { Request, Response } from "express";

export const listByQuestion = (_req: Request, res: Response) => res.json([]);
export const create = (_req: Request, res: Response) => res.status(201).json({ created: true });
export const update = (_req: Request, res: Response) => res.json({ updated: true });
export const remove = (_req: Request, res: Response) => res.json({ deleted: true });
