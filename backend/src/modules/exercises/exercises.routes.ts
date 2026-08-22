import { Router } from "express";

import * as controller from "./exercises.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const exercisesRouter = Router();

const staff = [requireAuth, requireRole("admin", "editor", "teacher")] as const;

exercisesRouter.get("/", ...staff, controller.list);
exercisesRouter.post("/", ...staff, controller.create);
exercisesRouter.delete("/:id", requireAuth, requireRole("admin", "editor"), controller.remove);
