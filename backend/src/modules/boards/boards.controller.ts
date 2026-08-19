import type { Request, Response } from "express";

import {
    BOARD_LIST,
    getBoardBySlug,
    getClassBySlug,
    getSubjectBySlug,
    getChapterBySlug,
    getExerciseBySlug,
    getQuestionData,
} from "../../demo-data.js";
import { db } from "../../db/index.js";
import { eq, and } from "drizzle-orm";
import * as schema from "../../db/schema.js";

const asString = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

export const list = async (_req: Request, res: Response) => {
    try {
        const result = await db.query.boards.findMany();
        if (result.length > 0) {
            return res.json(result);
        }
    } catch (e) {
        console.error("DB fallback", e);
    }
    res.json(BOARD_LIST);
};

export const getBySlug = async (req: Request, res: Response) => {
    const slug = asString(req.params.slug);
    
    try {
        const board = await db.query.boards.findFirst({
            where: eq(schema.boards.slug, slug),
            with: {
                classes: {
                    with: {
                        subjects: {
                            with: {
                                chapters: {
                                    with: {
                                        exercises: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (board) {
            return res.json(board);
        }
    } catch (e) {
        console.error("DB fallback", e);
    }

    const board = getBoardBySlug(slug);
    if (!board) {
        return res.status(404).json({ message: "Board not found" });
    }

    return res.json(board);
};

export const create = (_req: Request, res: Response) =>
    res.status(201).json({ created: true });
export const update = (_req: Request, res: Response) => res.json({ updated: true });
export const remove = (_req: Request, res: Response) => res.json({ deleted: true });

export const getBoardClass = async (req: Request, res: Response) => {
    const slug = asString(req.params.slug);
    const classSlug = asString(req.params.classSlug);

    try {
        const klass = await db.query.classes.findFirst({
            where: eq(schema.classes.slug, classSlug),
            with: {
                board: true
            }
        });
        if (klass && klass.board.slug === slug) {
            return res.json({
                board: klass.board,
                class: klass
            });
        }
    } catch (e) {
        console.error("DB fallback", e);
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

    try {
        const subject = await db.query.subjects.findFirst({
            where: eq(schema.subjects.slug, subjectSlug),
            with: {
                class: {
                    with: {
                        board: true
                    }
                }
            }
        });
        if (subject && subject.class.slug === classSlug && subject.class.board.slug === slug) {
            return res.json({
                board: subject.class.board,
                class: subject.class,
                subject,
            });
        }
    } catch (e) {
        console.error("DB fallback", e);
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

    try {
        const chapter = await db.query.chapters.findFirst({
            where: eq(schema.chapters.slug, chapterSlug),
            with: {
                subject: {
                    with: {
                        class: {
                            with: {
                                board: true
                            }
                        }
                    }
                }
            }
        });
        if (chapter && chapter.subject.slug === subjectSlug && chapter.subject.class.slug === classSlug && chapter.subject.class.board.slug === slug) {
            return res.json({
                board: chapter.subject.class.board,
                class: chapter.subject.class,
                subject: chapter.subject,
                chapter,
            });
        }
    } catch (e) {
        console.error("DB fallback", e);
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

    try {
        const exercise = await db.query.exercises.findFirst({
            where: eq(schema.exercises.slug, exerciseSlug),
            with: {
                chapter: {
                    with: {
                        subject: {
                            with: {
                                class: {
                                    with: {
                                        board: true
                                    }
                                }
                            }
                        }
                    }
                },
                questions: {
                    columns: {
                        num: true
                    }
                }
            }
        });
        if (exercise && exercise.chapter.slug === chapterSlug && exercise.chapter.subject.slug === subjectSlug && exercise.chapter.subject.class.slug === classSlug && exercise.chapter.subject.class.board.slug === slug) {
            return res.json({
                board: exercise.chapter.subject.class.board,
                class: exercise.chapter.subject.class,
                subject: exercise.chapter.subject,
                chapter: exercise.chapter,
                exercise,
            });
        }
    } catch (e) {
        console.error("DB fallback", e);
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

    try {
        const question = await db.query.questions.findFirst({
            where: eq(schema.questions.num, num),
            with: {
                steps: {
                    orderBy: (steps, { asc }) => [asc(steps.stepOrder)]
                },
                exercise: {
                    with: {
                        chapter: {
                            with: {
                                subject: {
                                    with: {
                                        class: {
                                            with: {
                                                board: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        questions: {
                            columns: {
                                num: true
                            }
                        }
                    }
                }
            }
        });

        if (question && question.exercise.slug === exerciseSlug && question.exercise.chapter.slug === chapterSlug && question.exercise.chapter.subject.slug === subjectSlug && question.exercise.chapter.subject.class.slug === classSlug && question.exercise.chapter.subject.class.board.slug === slug) {
            return res.json({
                board: question.exercise.chapter.subject.class.board,
                class: question.exercise.chapter.subject.class,
                subject: question.exercise.chapter.subject,
                chapter: question.exercise.chapter,
                exercise: question.exercise,
                question: {
                    num: question.num,
                    question: question.questionText,
                    marks: question.marks,
                    difficulty: question.difficulty,
                    pdfName: question.pdfName,
                    steps: question.steps
                }
            });
        }
    } catch (e) {
        console.error("DB fallback", e);
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
