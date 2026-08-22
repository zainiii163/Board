import { Router } from "express";

import * as controller from "./questions.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const questionsRouter = Router();

const staff = [requireAuth, requireRole("admin", "editor", "teacher")] as const;

questionsRouter.get("/", controller.list);
questionsRouter.get("/:id", controller.getById);
questionsRouter.post("/", ...staff, controller.create);
questionsRouter.put("/:id", ...staff, controller.update);
questionsRouter.delete("/:id", requireAuth, requireRole("admin", "editor"), controller.remove);
