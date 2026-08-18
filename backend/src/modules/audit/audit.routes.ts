import { Router } from "express";
import * as controller from "./audit.controller.js";

export const auditRouter = Router();

auditRouter.get("/", controller.list);
