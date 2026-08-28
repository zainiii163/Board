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
import { contactRouter } from "../modules/contact/contact.routes.js";
import { bookmarksRouter } from "../modules/bookmarks/bookmarks.routes.js";
import { quizRouter } from "../modules/quiz/quiz.routes.js";
import { progressRouter } from "../modules/progress/progress.routes.js";
import { authorsRouter } from "../modules/authors/authors.routes.js";
import { booksRouter } from "../modules/books/books.routes.js";
import { pastPapersRouter } from "../modules/past-papers/past-papers.routes.js";
import { legalRouter } from "../modules/legal/legal.routes.js";
import { formulasRouter } from "../modules/formulas/formulas.routes.js";
import { commentsRouter } from "../modules/comments/comments.routes.js";
import { examsRouter } from "../modules/exams/exams.routes.js";
import { classroomsRouter } from "../modules/classrooms/classrooms.routes.js";
import { categoriesRouter } from "../modules/categories/categories.routes.js";
import { resourcesRouter } from "../modules/resources/resources.routes.js";
import { portalRouter } from "../modules/portal/portal.routes.js";

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
apiRouter.use("/contact", contactRouter);
apiRouter.use("/bookmarks", bookmarksRouter);
apiRouter.use("/quiz", quizRouter);
apiRouter.use("/progress", progressRouter);
apiRouter.use("/authors", authorsRouter);
apiRouter.use("/books", booksRouter);
apiRouter.use("/past-papers", pastPapersRouter);
apiRouter.use("/legal", legalRouter);
apiRouter.use("/formulas", formulasRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/exams", examsRouter);
apiRouter.use("/classrooms", classroomsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/resources", resourcesRouter);
apiRouter.use("/portal", portalRouter);
