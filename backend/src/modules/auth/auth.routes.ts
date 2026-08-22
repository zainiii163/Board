import { Router } from "express";

import * as controller from "./auth.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", controller.register);
authRouter.post("/login", controller.login);
authRouter.post("/logout", controller.logout);
authRouter.get("/me", requireAuth, controller.me);
authRouter.patch("/preferences", requireAuth, controller.updatePreferences);
