import { Router } from "express";

import * as controller from "./chapters.controller.js";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const chaptersRouter = Router();

const staff = [requireAuth, requireRole("admin", "editor", "teacher")] as const;
const editors = [requireAuth, requireRole("admin", "editor")] as const;

chaptersRouter.get("/", (req, res, next) => {
  const { board, class: classSlug, subject } = req.query;
  if (board && classSlug && subject) {
    return controller.listPublic(req, res, next);
  }
  requireAuth(req, res, (err?: unknown) => {
    if (err) return next(err);
    requireRole("admin", "editor", "teacher")(req, res, (err2?: unknown) => {
      if (err2) return next(err2);
      controller.list(req, res, next);
    });
  });
});
chaptersRouter.get("/:slug", controller.getBySlug);
chaptersRouter.post("/", ...staff, controller.create);
chaptersRouter.put("/:id", ...staff, controller.updateById);
chaptersRouter.patch("/:id/publish", ...editors, controller.publishById);
chaptersRouter.patch("/:id/unpublish", ...editors, controller.unpublishById);
chaptersRouter.patch("/:id/reject", ...editors, controller.rejectById);
chaptersRouter.patch("/:id/review", ...staff, async (req: AuthedRequest, res, next) => {
  try {
    const id = Number(req.params.id);
    const { submitForReview } = await import("./chapters.service.js");
    const chapter = await submitForReview(id, req.user?.userId);
    res.json(chapter);
  } catch (error) {
    next(error);
  }
});
chaptersRouter.delete("/:id", ...editors, controller.removeById);
