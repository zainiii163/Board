import { Router } from "express";

import * as controller from "./audit.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const auditRouter = Router();

auditRouter.get("/", requireAuth, requireRole("admin", "editor"), controller.list);
auditRouter.get("/stats", requireAuth, requireRole("admin", "editor"), controller.stats);
