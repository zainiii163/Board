import { Router } from "express";

import * as controller from "./categories.controller.js";

export const categoriesRouter = Router();

categoriesRouter.get("/", controller.list);
categoriesRouter.get("/:slug", controller.getBySlug);