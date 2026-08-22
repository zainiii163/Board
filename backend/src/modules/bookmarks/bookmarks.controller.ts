import type { Response, NextFunction } from "express";

import * as bookmarksService from "./bookmarks.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/api-error.js";

export const list = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const bookmarks = await bookmarksService.listBookmarks(req.user.userId);
    res.json(bookmarks);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const { title, path } = req.body ?? {};
    const bookmark = await bookmarksService.addBookmark(req.user.userId, { title, path });
    res.status(201).json(bookmark);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) throw ApiError.badRequest("Invalid bookmark id.");
    const deleted = await bookmarksService.removeBookmark(req.user.userId, id);
    if (!deleted) throw ApiError.notFound("Bookmark not found.");
    res.json({ deleted: true });
  } catch (error) {
    next(error);
  }
};
