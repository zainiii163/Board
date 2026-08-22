import { Router } from "express";

import * as controller from "./users.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const usersRouter = Router();

usersRouter.use(requireAuth, requireRole("admin"));

usersRouter.get("/", controller.list);
usersRouter.get("/:id", controller.getById);
usersRouter.put("/:id/role", controller.updateRole);
usersRouter.delete("/:id", controller.remove);
