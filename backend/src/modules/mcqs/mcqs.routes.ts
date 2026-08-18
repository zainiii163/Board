import { Router } from "express";
import * as controller from "./mcqs.controller.js";

export const mcqsRouter = Router();

mcqsRouter.get("/", controller.list);
mcqsRouter.get("/:id", controller.getById);
mcqsRouter.post("/", controller.create);
mcqsRouter.put("/:id", controller.update);
mcqsRouter.delete("/:id", controller.remove);
