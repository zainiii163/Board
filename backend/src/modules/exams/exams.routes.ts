import { Router } from "express";

import * as controller from "./exams.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const examsRouter = Router();

const staff = [requireAuth, requireRole("admin", "editor")] as const;

examsRouter.get("/", controller.list);
examsRouter.get("/all", controller.listAll);
examsRouter.get("/:id", controller.getById);
examsRouter.post("/", ...staff, controller.create);
examsRouter.put("/:id", ...staff, controller.update);
examsRouter.delete("/:id", ...staff, controller.remove);
