import { Router } from "express";

import * as controller from "./progress.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

export const progressRouter = Router();

progressRouter.get("/", requireAuth, controller.getMine);
progressRouter.post("/track", requireAuth, controller.track);
progressRouter.get("/flashcards", requireAuth, controller.getFlashcards);
progressRouter.post("/flashcards", requireAuth, controller.updateFlashcards);
