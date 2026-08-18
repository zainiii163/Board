import { Router } from "express";
import * as controller from "./reports.controller.js";

export const reportsRouter = Router();

reportsRouter.get("/", controller.list);
reportsRouter.post("/", controller.create);
reportsRouter.patch("/:id/resolve", controller.resolve);
