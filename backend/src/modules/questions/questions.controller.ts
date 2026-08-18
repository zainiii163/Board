import type { Request, Response } from "express";

export const list = (_req: Request, res: Response) => res.json([]);
export const getById = (_req: Request, res: Response) => res.json(null);
export const create = (_req: Request, res: Response) => res.status(201).json({ created: true });
export const update = (_req: Request, res: Response) => res.json({ updated: true });
export const remove = (_req: Request, res: Response) => res.json({ deleted: true });
