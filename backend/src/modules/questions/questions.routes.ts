import { Router } from "express";
import * as controller from "./questions.controller.js";

export const questionsRouter = Router();

questionsRouter.get("/", controller.list);
questionsRouter.get("/:id", controller.getById);
questionsRouter.post("/", controller.create);
questionsRouter.put("/:id", controller.update);
questionsRouter.delete("/:id", controller.remove);
