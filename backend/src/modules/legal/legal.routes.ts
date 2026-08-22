import { Router } from "express";

import * as controller from "./legal.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const legalRouter = Router();

legalRouter.get("/", controller.list);
legalRouter.get("/:slug", controller.getBySlug);
legalRouter.put("/:slug", requireAuth, requireRole("admin", "editor"), controller.update);
