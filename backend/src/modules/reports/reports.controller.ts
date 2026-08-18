import type { Request, Response } from "express";

export const list = (_req: Request, res: Response) => res.json([]);
export const create = (_req: Request, res: Response) => res.status(201).json({ created: true });
export const resolve = (_req: Request, res: Response) => res.json({ resolved: true });
