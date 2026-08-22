import { Router } from "express";

import * as controller from "./contact.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const contactRouter = Router();

contactRouter.get("/", requireAuth, requireRole("admin", "editor"), controller.list);
contactRouter.post("/", controller.create);
