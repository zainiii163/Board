import { Router } from "express";
import * as controller from "./test-generator.controller.js";

export const testGeneratorRouter = Router();

testGeneratorRouter.post("/generate", controller.generateTest);
