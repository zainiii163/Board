import type { Response, NextFunction } from "express";

import * as commentsService from "./comments.service.js";
import * as authService from "../auth/auth.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/api-error.js";

const asString = (value: unknown) => {
  if (Array.isArray(value)) return String(value[0] ?? "");
  if (typeof value === "string") return value;
  return "";
};



export const list = async (req: AuthedRequest, res: Response) => {

  const path = asString(req.query.path);

  if (!path) return res.json([]);

  return res.json(await commentsService.listCommentsForPage(path));

};



export const listModeration = async (req: AuthedRequest, res: Response) => {

  const status = asString(req.query.status) as "pending" | "approved" | "rejected" | "";

  return res.json(await commentsService.listCommentsForModeration(status || "pending"));

};



export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {

  try {

    if (!req.user) throw ApiError.unauthorized();

    const user = await authService.getUserById(req.user.userId);

    const { pagePath, questionRef, body } = req.body ?? {};

    const comment = await commentsService.createComment({

      userId: req.user.userId,

      userName: user?.name ?? req.user.email.split("@")[0],

      pagePath: String(pagePath ?? ""),

      questionRef: String(questionRef ?? ""),

      body: String(body ?? ""),

    });

    res.status(201).json(comment);

  } catch (error) {

    next(error);

  }

};



export const approve = async (req: AuthedRequest, res: Response, next: NextFunction) => {

  try {

    const id = Number(req.params.id);

    res.json(await commentsService.approveComment(id));

  } catch (error) {

    next(error);

  }

};



export const reject = async (req: AuthedRequest, res: Response, next: NextFunction) => {

  try {

    const id = Number(req.params.id);

    res.json(await commentsService.rejectComment(id));

  } catch (error) {

    next(error);

  }

};



export const remove = async (req: AuthedRequest, res: Response, next: NextFunction) => {

  try {

    const id = Number(req.params.id);

    res.json(await commentsService.deleteComment(id));

  } catch (error) {

    next(error);

  }

};

