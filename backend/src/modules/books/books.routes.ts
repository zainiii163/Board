import { Router } from "express";

import * as controller from "./books.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const booksRouter = Router();

const staff = [requireAuth, requireRole("admin", "editor", "teacher")] as const;

booksRouter.get("/", controller.list);
booksRouter.get("/:id", controller.getById);
booksRouter.post("/", ...staff, controller.create);
booksRouter.post("/:id/pdf", ...staff, controller.uploadMiddleware, controller.attachPdf);
booksRouter.put("/:id", ...staff, controller.update);
booksRouter.delete("/:id", requireAuth, requireRole("admin", "editor"), controller.remove);
