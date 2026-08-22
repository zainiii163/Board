import { Router } from "express";

import * as controller from "./past-papers.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const pastPapersRouter = Router();

const staff = [requireAuth, requireRole("admin", "editor", "teacher")] as const;

pastPapersRouter.get("/", controller.list);
pastPapersRouter.get("/:id", controller.getById);
pastPapersRouter.post("/", ...staff, controller.create);
pastPapersRouter.put("/:id", ...staff, controller.update);
pastPapersRouter.delete("/:id", requireAuth, requireRole("admin", "editor"), controller.remove);
