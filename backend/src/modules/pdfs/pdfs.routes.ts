import { Router } from "express";

import * as controller from "./pdfs.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const pdfsRouter = Router();

pdfsRouter.get("/storage/info", requireAuth, requireRole("admin", "editor", "teacher"), controller.storageInfo);
pdfsRouter.get("/", controller.list);pdfsRouter.get("/:id", controller.getById);
pdfsRouter.post(
  "/upload",
  requireAuth,
  requireRole("admin", "editor", "teacher"),
  controller.uploadMiddleware,
  controller.upload,
);
pdfsRouter.delete(
  "/:id",
  requireAuth,
  requireRole("admin", "editor"),
  controller.remove,
);
