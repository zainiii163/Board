import { Router } from "express";

import * as controller from "./quiz.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

export const quizRouter = Router();

quizRouter.get("/", controller.getQuiz);
quizRouter.post("/submit", requireAuth, controller.submitQuiz);
quizRouter.get("/scores", requireAuth, controller.myScores);
