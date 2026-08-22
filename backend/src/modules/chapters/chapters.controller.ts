import type { Response, NextFunction } from "express";
import type { ContentStatus } from "@boardnotes/shared";

import * as chaptersService from "./chapters.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/api-error.js";

const asString = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";

export const list = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as ContentStatus | undefined;
    const chapters = await chaptersService.listChapters(status);
    res.json(chapters);
  } catch (error) {
    next(error);
  }
};

export const getBySlug = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const slug = asString(req.params.slug);
    const chapters = await chaptersService.listChapters();
    const chapter = chapters.find((c) => c.slug === slug);
    if (!chapter) throw ApiError.notFound("Chapter not found.");
    res.json(chapter);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const chapter = await chaptersService.createChapter(req.body ?? {}, req.user?.userId);
    res.status(201).json(chapter);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(asString(req.params.slug));
    const chapter = await chaptersService.updateChapter(id, req.body ?? {}, req.user?.userId);
    res.json(chapter);
  } catch (error) {
    next(error);
  }
};

export const reorder = (_req: AuthedRequest, res: Response) => res.json({ reordered: true });

export const publish = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(asString(req.params.slug));
    const chapter = await chaptersService.publishChapter(id, req.user?.userId);
    res.json(chapter);
  } catch (error) {
    next(error);
  }
};

export const unpublish = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(asString(req.params.slug));
    const chapter = await chaptersService.unpublishChapter(id, req.user?.userId);
    res.json(chapter);
  } catch (error) {
    next(error);
  }
};

export const submitReview = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(asString(req.params.slug));
    const chapter = await chaptersService.submitForReview(id, req.user?.userId);
    res.json(chapter);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(asString(req.params.slug));
    const result = await chaptersService.deleteChapter(id, req.user?.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateById = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(asString(req.params.id));
    const body = { ...(req.body ?? {}) } as Record<string, unknown>;
    if (req.user?.role === "teacher") {
      delete body.status;
    }
    const chapter = await chaptersService.updateChapter(id, body, req.user?.userId);
    res.json(chapter);
  } catch (error) {
    next(error);
  }
};

export const publishById = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(asString(req.params.id));
    const chapter = await chaptersService.publishChapter(id, req.user?.userId);
    res.json(chapter);
  } catch (error) {
    next(error);
  }
};

export const rejectById = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(asString(req.params.id));
    const chapter = await chaptersService.rejectChapter(id, req.user?.userId);
    res.json(chapter);
  } catch (error) {
    next(error);
  }
};

export const unpublishById = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(asString(req.params.id));
    const chapter = await chaptersService.unpublishChapter(id, req.user?.userId);
    res.json(chapter);
  } catch (error) {
    next(error);
  }
};

export const removeById = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(asString(req.params.id));
    const result = await chaptersService.deleteChapter(id, req.user?.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
