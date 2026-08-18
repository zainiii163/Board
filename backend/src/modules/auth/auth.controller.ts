import type { Request, Response } from "express";

export const login = (_req: Request, res: Response) => res.json({ token: null });
export const register = (_req: Request, res: Response) => res.status(201).json({ created: true });
export const logout = (_req: Request, res: Response) => res.json({ loggedOut: true });
export const me = (_req: Request, res: Response) => res.json({ user: null });
