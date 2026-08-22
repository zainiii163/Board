import { Router } from "express";

import * as controller from "./boards.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

export const boardsRouter = Router();

const staff = [requireAuth, requireRole("admin", "editor")] as const;

boardsRouter.get("/", controller.list);
boardsRouter.get("/:slug", controller.getBySlug);
boardsRouter.get("/:slug/classes/:classSlug", controller.getBoardClass);
boardsRouter.get(
    "/:slug/classes/:classSlug/subjects/:subject",
    controller.getBoardClassSubject,
);
boardsRouter.get(
    "/:slug/classes/:classSlug/subjects/:subject/chapters/:chapter",
    controller.getBoardClassSubjectChapter,
);
boardsRouter.get(
    "/:slug/classes/:classSlug/subjects/:subject/chapters/:chapter/zip/info",
    controller.getBoardClassSubjectChapterZipInfo,
);
boardsRouter.get(
    "/:slug/classes/:classSlug/subjects/:subject/chapters/:chapter/zip",
    controller.downloadBoardClassSubjectChapterZip,
);
boardsRouter.get(
    "/:slug/classes/:classSlug/subjects/:subject/chapters/:chapter/exercises/:exercise",
    controller.getBoardClassSubjectChapterExercise,
);
boardsRouter.get(
    "/:slug/classes/:classSlug/subjects/:subject/chapters/:chapter/exercises/:exercise/q/:questionNum",
    controller.getBoardClassSubjectChapterExerciseQuestion,
);
boardsRouter.post("/", ...staff, controller.create);
boardsRouter.put("/:slug", ...staff, controller.update);
boardsRouter.delete("/:slug", ...staff, controller.remove);
