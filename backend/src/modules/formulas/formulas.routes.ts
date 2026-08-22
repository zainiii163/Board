import { Router } from "express";

import * as controller from "./formulas.controller.js";

export const formulasRouter = Router();

formulasRouter.get("/", controller.list);
