import { Router } from "express";
import * as controller from "./search.controller.js";

export const searchRouter = Router();

searchRouter.get("/", controller.search);
