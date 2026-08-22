import { Router } from "express";

import * as controller from "./comments.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const commentsRouter = Router();

const staff = [requireAuth, requireRole("admin", "editor")] as const;

commentsRouter.get("/moderation", ...staff, controller.listModeration);
commentsRouter.get("/", controller.list);
commentsRouter.post("/", requireAuth, controller.create);
commentsRouter.patch("/:id/approve", ...staff, controller.approve);
commentsRouter.patch("/:id/reject", ...staff, controller.reject);
commentsRouter.delete("/:id", ...staff, controller.remove);
