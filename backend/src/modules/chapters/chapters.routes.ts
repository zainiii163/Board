import { Router } from "express";
import * as controller from "./chapters.controller.js";

export const chaptersRouter = Router();

chaptersRouter.get("/", controller.list);
chaptersRouter.get("/:slug", controller.getBySlug);
chaptersRouter.post("/", controller.create);
chaptersRouter.put("/:slug", controller.update);
chaptersRouter.patch("/:slug/reorder", controller.reorder);
chaptersRouter.patch("/:slug/publish", controller.publish);
chaptersRouter.patch("/:slug/unpublish", controller.unpublish);
chaptersRouter.delete("/:slug", controller.remove);
