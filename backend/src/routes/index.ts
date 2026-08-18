import { Router } from "express";

import { boardsRouter } from "../modules/boards/boards.routes.js";
import { classesRouter } from "../modules/classes/classes.routes.js";
import { subjectsRouter } from "../modules/subjects/subjects.routes.js";
import { chaptersRouter } from "../modules/chapters/chapters.routes.js";
import { exercisesRouter } from "../modules/exercises/exercises.routes.js";
import { questionsRouter } from "../modules/questions/questions.routes.js";
import { solutionsRouter } from "../modules/solutions/solutions.routes.js";
import { mcqsRouter } from "../modules/mcqs/mcqs.routes.js";
import { pdfsRouter } from "../modules/pdfs/pdfs.routes.js";
import { searchRouter } from "../modules/search/search.routes.js";
import { authRouter } from "../modules/auth/auth.routes.js";
import { usersRouter } from "../modules/users/users.routes.js";
import { reportsRouter } from "../modules/reports/reports.routes.js";
import { auditRouter } from "../modules/audit/audit.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "boardnotes-backend",
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use("/boards", boardsRouter);
apiRouter.use("/classes", classesRouter);
apiRouter.use("/subjects", subjectsRouter);
apiRouter.use("/chapters", chaptersRouter);
apiRouter.use("/exercises", exercisesRouter);
apiRouter.use("/questions", questionsRouter);
apiRouter.use("/solutions", solutionsRouter);
apiRouter.use("/mcqs", mcqsRouter);
apiRouter.use("/pdfs", pdfsRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/reports", reportsRouter);
apiRouter.use("/audit", auditRouter);
