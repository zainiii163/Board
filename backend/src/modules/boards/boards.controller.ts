import type { Request, Response, NextFunction } from "express";

import {
    getBoardBySlug,
    getClassBySlug,
    getSubjectBySlug,
    getChapterBySlug,
    getExerciseBySlug,
    getQuestionData,
} from "../../demo-data.js";
import * as boardsService from "./boards.service.js";
import * as chapterZipService from "./chapter-zip.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";
import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import { eq } from "drizzle-orm";
import * as schema from "../../db/schema.js";
import { ApiError } from "../../utils/api-error.js";

const asString = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

export const list = async (req: Request, res: Response) => {
    const full = String(req.query.full ?? "") === "1";
    if (full) {
        return res.json(await boardsService.listBoards());
    }

    return res.json(await boardsService.listBoardCatalog());
};

export const getBySlug = async (req: Request, res: Response) => {
    const slug = asString(req.params.slug);

    if (useDb()) {
        try {
            const board = await db.query.boards.findFirst({
                where: eq(schema.boards.slug, slug),
                with: {
                    classes: {
                        with: {
                            subjects: {
                                with: {
                                    chapters: {
                                        with: { exercises: true },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            if (board) {
                const filtered = {
                    ...board,
                    classes: board.classes.map((klass) => ({
                        ...klass,
                        subjects: klass.subjects.map((subject) => ({
                            ...subject,
                            chapters: subject.chapters.filter((ch) => ch.status === "published"),
                        })),
                    })),
                };
                return res.json(filtered);
            }
            return res.status(404).json({ message: "Board not found" });
        } catch (e) {
            console.error("DB read failed", e);
        }
    }

    const board = getBoardBySlug(slug);
    if (!board) {
        return res.status(404).json({ message: "Board not found" });
    }

    return res.json(board);
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
        const created = await boardsService.createBoard(req.body ?? {});
        res.status(201).json(created);
    } catch (error) {
        next(error);
    }
};
export const update = async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
        const updated = await boardsService.updateBoard(asString(req.params.slug), req.body ?? {});
        res.json(updated);
    } catch (error) {
        next(error);
    }
};
export const remove = async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
        const result = await boardsService.deleteBoard(asString(req.params.slug));
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getBoardClass = async (req: Request, res: Response) => {
    const slug = asString(req.params.slug);
    const classSlug = asString(req.params.classSlug);

    if (useDb()) {
        try {
            const klass = await db.query.classes.findFirst({
                where: eq(schema.classes.slug, classSlug),
                with: { board: true },
            });
            if (klass && klass.board.slug === slug) {
                return res.json({ board: klass.board, class: klass });
            }
            return res.status(404).json({ message: "Class not found" });
        } catch (e) {
            console.error("DB read failed", e);
        }
    }

    const klass = getClassBySlug(slug, classSlug);
    if (!klass) {
        return res.status(404).json({ message: "Class not found" });
    }

    return res.json({
        board: getBoardBySlug(slug),
        class: klass,
    });
};

export const getBoardClassSubject = async (req: Request, res: Response) => {
    const slug = asString(req.params.slug);
    const classSlug = asString(req.params.classSlug);
    const subjectSlug = asString(req.params.subject);

    if (useDb()) {
        try {
            const subject = await db.query.subjects.findFirst({
                where: eq(schema.subjects.slug, subjectSlug),
                with: {
                    class: { with: { board: true } },
                    chapters: true,
                },
            });
            if (subject && subject.class.slug === classSlug && subject.class.board.slug === slug) {
                return res.json({
                    board: subject.class.board,
                    class: subject.class,
                    subject: {
                        ...subject,
                        chapters: subject.chapters.filter((ch) => ch.status === "published"),
                    },
                });
            }
            return res.status(404).json({ message: "Subject not found" });
        } catch (e) {
            console.error("DB read failed", e);
        }
    }

    const subject = getSubjectBySlug(slug, classSlug, subjectSlug);

    if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
    }

    return res.json({
        board: getBoardBySlug(slug),
        class: getClassBySlug(slug, classSlug),
        subject,
    });
};

export const getBoardClassSubjectChapter = async (req: Request, res: Response) => {
    const slug = asString(req.params.slug);
    const classSlug = asString(req.params.classSlug);
    const subjectSlug = asString(req.params.subject);
    const chapterSlug = asString(req.params.chapter);

    if (useDb()) {
        try {
            const chapter = await db.query.chapters.findFirst({
                where: eq(schema.chapters.slug, chapterSlug),
                with: {
                    subject: { with: { class: { with: { board: true } } } },
                    exercises: true,
                },
            });
            if (
                chapter &&
                chapter.status === "published" &&
                chapter.subject.slug === subjectSlug &&
                chapter.subject.class.slug === classSlug &&
                chapter.subject.class.board.slug === slug
            ) {
                return res.json({
                    board: chapter.subject.class.board,
                    class: chapter.subject.class,
                    subject: chapter.subject,
                    chapter,
                });
            }
            return res.status(404).json({ message: "Chapter not found" });
        } catch (e) {
            console.error("DB read failed", e);
        }
    }

    const chapter = getChapterBySlug(slug, classSlug, subjectSlug, chapterSlug);

    if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
    }

    return res.json({
        board: getBoardBySlug(slug),
        class: getClassBySlug(slug, classSlug),
        subject: getSubjectBySlug(slug, classSlug, subjectSlug),
        chapter,
    });
};

export const getBoardClassSubjectChapterExercise = async (req: Request, res: Response) => {
    const slug = asString(req.params.slug);
    const classSlug = asString(req.params.classSlug);
    const subjectSlug = asString(req.params.subject);
    const chapterSlug = asString(req.params.chapter);
    const exerciseSlug = asString(req.params.exercise);

    if (useDb()) {
        try {
            const exercise = await db.query.exercises.findFirst({
                where: eq(schema.exercises.slug, exerciseSlug),
                with: {
                    chapter: {
                        with: {
                            subject: { with: { class: { with: { board: true } } } },
                        },
                    },
                    questions: { columns: { num: true, questionText: true } },
                },
            });
            if (
                exercise &&
                exercise.chapter.status === "published" &&
                exercise.chapter.slug === chapterSlug &&
                exercise.chapter.subject.slug === subjectSlug &&
                exercise.chapter.subject.class.slug === classSlug &&
                exercise.chapter.subject.class.board.slug === slug
            ) {
                return res.json({
                    board: exercise.chapter.subject.class.board,
                    class: exercise.chapter.subject.class,
                    subject: exercise.chapter.subject,
                    chapter: exercise.chapter,
                    exercise: {
                        slug: exercise.slug,
                        title: exercise.title,
                        questions: exercise.questions.map((q) => ({
                            num: q.num,
                            question: q.questionText,
                        })),
                    },
                });
            }
            return res.status(404).json({ message: "Exercise not found" });
        } catch (e) {
            console.error("DB read failed", e);
        }
    }

    const exercise = getExerciseBySlug(slug, classSlug, subjectSlug, chapterSlug, exerciseSlug);

    if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
    }

    return res.json({
        board: getBoardBySlug(slug),
        class: getClassBySlug(slug, classSlug),
        subject: getSubjectBySlug(slug, classSlug, subjectSlug),
        chapter: getChapterBySlug(slug, classSlug, subjectSlug, chapterSlug),
        exercise,
    });
};

export const getBoardClassSubjectChapterExerciseQuestion = async (
    req: Request,
    res: Response,
) => {
    const slug = asString(req.params.slug);
    const classSlug = asString(req.params.classSlug);
    const subjectSlug = asString(req.params.subject);
    const chapterSlug = asString(req.params.chapter);
    const exerciseSlug = asString(req.params.exercise);
    const num = Number(asString(req.params.questionNum) || "3");

    if (useDb()) {
        try {
            const question = await db.query.questions.findFirst({
                where: eq(schema.questions.num, num),
                with: {
                    steps: { orderBy: (steps, { asc }) => [asc(steps.stepOrder)] },
                    exercise: {
                        with: {
                            chapter: {
                                with: {
                                    subject: { with: { class: { with: { board: true } } } },
                                },
                            },
                            questions: { columns: { num: true } },
                        },
                    },
                },
            });

            if (
                question &&
                question.exercise.slug === exerciseSlug &&
                question.exercise.chapter.status === "published" &&
                question.exercise.chapter.slug === chapterSlug &&
                question.exercise.chapter.subject.slug === subjectSlug &&
                question.exercise.chapter.subject.class.slug === classSlug &&
                question.exercise.chapter.subject.class.board.slug === slug
            ) {
                return res.json({
                    board: question.exercise.chapter.subject.class.board,
                    class: question.exercise.chapter.subject.class,
                    subject: question.exercise.chapter.subject,
                    chapter: question.exercise.chapter,
                    exercise: question.exercise,
                    question: {
                        num: question.num,
                        question: question.questionText,
                        questionUr: question.questionTextUr ?? undefined,
                        marks: question.marks,
                        difficulty: question.difficulty,
                        pdfName: question.pdfName,
                        steps: question.steps.map((s) => ({ title: s.title, content: s.content })),
                        stepsUr: question.stepsUr?.length ? question.stepsUr : undefined,
                    },
                });
            }
            return res.status(404).json({ message: "Question not found" });
        } catch (e) {
            console.error("DB read failed", e);
        }
    }

    const question = getQuestionData(
        slug,
        classSlug,
        subjectSlug,
        chapterSlug,
        exerciseSlug,
        num,
    );

    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }

    return res.json(question);
};

export const getBoardClassSubjectChapterZipInfo = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const info = await chapterZipService.getChapterZipInfo(
            asString(req.params.slug),
            asString(req.params.classSlug),
            asString(req.params.subject),
            asString(req.params.chapter),
        );
        res.json(info);
    } catch (error) {
        next(error);
    }
};

export const downloadBoardClassSubjectChapterZip = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        await chapterZipService.streamChapterZip(
            asString(req.params.slug),
            asString(req.params.classSlug),
            asString(req.params.subject),
            asString(req.params.chapter),
            res,
        );
    } catch (error) {
        if (error instanceof ApiError && !res.headersSent) {
            return next(error);
        }
        if (!res.headersSent) next(error);
    }
};
