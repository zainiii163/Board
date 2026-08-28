import { Router } from "express";

import * as controller from "./resources.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const resourcesRouter = Router();

resourcesRouter.get("/", controller.list);
resourcesRouter.get("/latest", controller.latest);
resourcesRouter.get("/by-id/:id", controller.getById);
resourcesRouter.get("/:slug", controller.getBySlug);

resourcesRouter.post("/", requireAuth, controller.uploadMiddleware, controller.create);
resourcesRouter.post("/:slug/download", controller.trackDownload);

resourcesRouter.patch("/:id", requireAuth, requireRole("admin", "editor", "teacher"), controller.update);
resourcesRouter.delete("/:id", requireAuth, requireRole("admin", "editor"), controller.remove);