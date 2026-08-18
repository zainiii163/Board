import { Router } from "express";
import * as controller from "./exercises.controller.js";

export const exercisesRouter = Router();

exercisesRouter.get("/", controller.list);
exercisesRouter.get("/:slug", controller.getBySlug);
exercisesRouter.post("/", controller.create);
exercisesRouter.put("/:slug", controller.update);
exercisesRouter.patch("/:slug/reorder", controller.reorder);
exercisesRouter.delete("/:slug", controller.remove);
