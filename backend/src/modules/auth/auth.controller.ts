import type { Response, NextFunction } from "express";

import * as authService from "./auth.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/api-error.js";

export const register = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body ?? {};
    const result = await authService.registerUser({ name, email, password, role: "student" });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body ?? {};
    const result = await authService.loginUser({ email, password });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = (_req: AuthedRequest, res: Response) => {
  res.json({ loggedOut: true });
};

export const me = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const user = await authService.getUserById(req.user.userId);
    if (!user) throw ApiError.unauthorized();
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const emailUpdates = Boolean(req.body?.emailUpdates);
    const user = await authService.updateEmailUpdates(req.user.userId, emailUpdates);
    if (!user) throw ApiError.unauthorized();
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
