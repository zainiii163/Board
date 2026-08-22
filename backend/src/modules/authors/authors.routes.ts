import { Router } from "express";

import * as controller from "./authors.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const authorsRouter = Router();

const staff = [requireAuth, requireRole("admin", "editor")] as const;

authorsRouter.get("/", controller.list);
authorsRouter.get("/:slug", controller.getBySlug);
authorsRouter.post("/", ...staff, controller.create);
authorsRouter.put("/:slug", ...staff, controller.update);
authorsRouter.delete("/:slug", ...staff, controller.remove);
