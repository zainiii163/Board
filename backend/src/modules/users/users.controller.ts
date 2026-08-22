import type { Response, NextFunction } from "express";
import type { UserRole } from "@boardnotes/shared";

import * as authService from "../auth/auth.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/api-error.js";

export const list = async (_req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const users = await authService.listUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) throw ApiError.badRequest("Invalid user id.");
    const user = await authService.getUserById(id);
    if (!user) throw ApiError.notFound("User not found.");
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const role = req.body?.role as UserRole;
    if (!Number.isFinite(id)) throw ApiError.badRequest("Invalid user id.");
    if (!["admin", "editor", "teacher", "student"].includes(role)) {
      throw ApiError.badRequest("Invalid role.");
    }
    const user = await authService.updateUserRole(id, role);
    if (!user) throw ApiError.notFound("User not found.");
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) throw ApiError.badRequest("Invalid user id.");
    if (req.user?.userId === id) throw ApiError.badRequest("You cannot delete your own account.");
    const deleted = await authService.deleteUser(id);
    if (!deleted) throw ApiError.notFound("User not found.");
    res.json({ deleted: true });
  } catch (error) {
    next(error);
  }
};
