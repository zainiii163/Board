import { Router } from "express";

import * as controller from "./classrooms.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const classroomsRouter = Router();

const teachers = [requireAuth, requireRole("admin", "editor", "teacher")] as const;

classroomsRouter.get("/mine", requireAuth, controller.listMine);
classroomsRouter.post("/", ...teachers, controller.create);
classroomsRouter.post("/join", requireAuth, controller.join);
classroomsRouter.get("/:id/scores", requireAuth, controller.scores);
classroomsRouter.get("/:id", requireAuth, controller.getById);
classroomsRouter.post("/:id/assignments", ...teachers, controller.addAssignment);
classroomsRouter.delete("/:id/assignments/:assignmentId", ...teachers, controller.removeAssignment);
