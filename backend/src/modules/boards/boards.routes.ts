import { Router } from "express";
import * as controller from "./boards.controller.js";

export const boardsRouter = Router();

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
    "/:slug/classes/:classSlug/subjects/:subject/chapters/:chapter/exercises/:exercise",
    controller.getBoardClassSubjectChapterExercise,
);
boardsRouter.get(
    "/:slug/classes/:classSlug/subjects/:subject/chapters/:chapter/exercises/:exercise/q/:questionNum",
    controller.getBoardClassSubjectChapterExerciseQuestion,
);
boardsRouter.post("/", controller.create);
boardsRouter.put("/:slug", controller.update);
boardsRouter.delete("/:slug", controller.remove);
