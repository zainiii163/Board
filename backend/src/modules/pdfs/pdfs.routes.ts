import { Router } from "express";
import * as controller from "./pdfs.controller.js";

export const pdfsRouter = Router();

pdfsRouter.get("/", controller.list);
pdfsRouter.get("/:id", controller.getById);
pdfsRouter.post("/upload", controller.upload);
pdfsRouter.delete("/:id", controller.remove);
