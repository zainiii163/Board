import { Router } from "express";

import * as controller from "./classes.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const classesRouter = Router();

const staff = [requireAuth, requireRole("admin", "editor", "teacher")] as const;

classesRouter.get("/", controller.list);
classesRouter.get("/:slug", controller.getBySlug);
classesRouter.post("/", ...staff, controller.create);
classesRouter.put("/:slug", ...staff, controller.update);
classesRouter.delete("/:slug", requireAuth, requireRole("admin", "editor"), controller.remove);
