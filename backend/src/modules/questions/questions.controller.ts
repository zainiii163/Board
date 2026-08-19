import type { Request, Response } from "express";

import { getQuestionData } from "../../demo-data.js";
import { db } from "../../db/index.js";
import { eq } from "drizzle-orm";
import * as schema from "../../db/schema.js";

const asString = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

const readQueryValue = (value: unknown, fallback: string) => {
    if (Array.isArray(value)) {
        const first = value[0];
        return typeof first === "string" ? first : fallback;
    }

    if (typeof value === "string") {
        return value;
    }

    return fallback;
};

export const list = async (req: Request, res: Response) => {
    const board = readQueryValue(req.query.board, "fbise");
    const classSlug = readQueryValue(req.query.class, "9");
    const subject = readQueryValue(req.query.subject, "mathematics");
    const chapter = readQueryValue(req.query.chapter, "real-numbers");
    const exercise = readQueryValue(req.query.exercise, "exercise-1-1");
    const questionNum = Number(readQueryValue(req.query.question, "3") || "3");

    try {
        const question = await db.query.questions.findFirst({
            where: eq(schema.questions.num, questionNum),
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

        if (question && question.exercise.slug === exercise && question.exercise.chapter.slug === chapter && question.exercise.chapter.subject.slug === subject && question.exercise.chapter.subject.class.slug === classSlug && question.exercise.chapter.subject.class.board.slug === board) {
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

    const questionFallback = getQuestionData(board, classSlug, subject, chapter, exercise, questionNum);

    if (!questionFallback) {
        return res.status(404).json({ message: "Question not found" });
    }

    return res.json(questionFallback);
};

export const getById = async (req: Request, res: Response) => {
    const id = Number(asString(req.params.id) || "3");
    
    try {
        const question = await db.query.questions.findFirst({
            where: eq(schema.questions.id, id),
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

        if (question) {
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

    const questionFallback = getQuestionData("fbise", "9", "mathematics", "real-numbers", "exercise-1-1", id);

    if (!questionFallback) {
        return res.status(404).json({ message: "Question not found" });
    }

    return res.json(questionFallback);
};

export const create = (_req: Request, res: Response) => res.status(201).json({ created: true });
export const update = (_req: Request, res: Response) => res.json({ updated: true });
export const remove = (_req: Request, res: Response) => res.json({ deleted: true });
