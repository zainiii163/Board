import { Router } from "express";
import * as controller from "./solutions.controller.js";

export const solutionsRouter = Router();

solutionsRouter.get("/:questionId", controller.listByQuestion);
solutionsRouter.post("/", controller.create);
solutionsRouter.put("/:id", controller.update);
solutionsRouter.delete("/:id", controller.remove);
