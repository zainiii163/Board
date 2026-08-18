import { Router } from "express";
import * as controller from "./classes.controller.js";

export const classesRouter = Router();

classesRouter.get("/", controller.list);
classesRouter.get("/:slug", controller.getBySlug);
classesRouter.post("/", controller.create);
classesRouter.put("/:slug", controller.update);
classesRouter.delete("/:slug", controller.remove);
