import type { Request, Response } from "express";

export const list = (_req: Request, res: Response) => res.json([]);
export const getById = (_req: Request, res: Response) => res.json(null);
export const upload = (_req: Request, res: Response) => res.status(201).json({ uploaded: true });
export const remove = (_req: Request, res: Response) => res.json({ deleted: true });
