import { Router } from "express";
import * as controller from "./boards.controller.js";

export const boardsRouter = Router();

boardsRouter.get("/", controller.list);
boardsRouter.get("/:slug", controller.getBySlug);
boardsRouter.post("/", controller.create);
boardsRouter.put("/:slug", controller.update);
boardsRouter.delete("/:slug", controller.remove);
