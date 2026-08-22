import { Router } from "express";

import * as controller from "./bookmarks.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

export const bookmarksRouter = Router();

bookmarksRouter.get("/", requireAuth, controller.list);
bookmarksRouter.post("/", requireAuth, controller.create);
bookmarksRouter.delete("/:id", requireAuth, controller.remove);
