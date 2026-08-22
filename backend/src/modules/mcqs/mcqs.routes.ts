import { Router } from "express";

import * as controller from "./mcqs.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const mcqsRouter = Router();

const staff = [requireAuth, requireRole("admin", "editor", "teacher")] as const;

mcqsRouter.get("/", controller.list);
mcqsRouter.get("/:id", controller.getById);
mcqsRouter.post("/", ...staff, controller.create);
mcqsRouter.put("/:id", ...staff, controller.update);
mcqsRouter.delete("/:id", requireAuth, requireRole("admin", "editor"), controller.remove);
