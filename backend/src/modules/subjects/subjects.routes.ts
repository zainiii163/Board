import { Router } from "express";
import * as controller from "./subjects.controller.js";

export const subjectsRouter = Router();

subjectsRouter.get("/", controller.list);
subjectsRouter.get("/:slug", controller.getBySlug);
subjectsRouter.post("/", controller.create);
subjectsRouter.put("/:slug", controller.update);
subjectsRouter.delete("/:slug", controller.remove);
