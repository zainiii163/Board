import { Router } from "express";
import * as controller from "./users.controller.js";

export const usersRouter = Router();

usersRouter.get("/", controller.list);
usersRouter.get("/:id", controller.getById);
usersRouter.put("/:id/role", controller.updateRole);
usersRouter.delete("/:id", controller.remove);
