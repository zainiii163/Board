import { Router } from "express";

import * as controller from "./reports.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const reportsRouter = Router();

reportsRouter.get("/", requireAuth, requireRole("admin", "editor"), controller.list);
reportsRouter.post("/", controller.create);
reportsRouter.patch("/:id/resolve", requireAuth, requireRole("admin", "editor"), controller.resolve);
