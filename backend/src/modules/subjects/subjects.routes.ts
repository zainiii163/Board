import { Router } from "express";

import * as controller from "./subjects.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const subjectsRouter = Router();

const staff = [requireAuth, requireRole("admin", "editor", "teacher")] as const;

subjectsRouter.get("/", controller.list);
subjectsRouter.get("/:slug", controller.getBySlug);
subjectsRouter.post("/", ...staff, controller.create);
subjectsRouter.put("/:slug", ...staff, controller.update);
subjectsRouter.delete("/:slug", requireAuth, requireRole("admin", "editor"), controller.remove);
