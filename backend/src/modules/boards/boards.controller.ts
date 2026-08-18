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

const asString = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

export const list = (_req: Request, res: Response) => {
    res.json(BOARD_LIST);
};

export const getBySlug = (req: Request, res: Response) => {
    const slug = asString(req.params.slug);
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

export const getBoardClass = (req: Request, res: Response) => {
    const slug = asString(req.params.slug);
    const classSlug = asString(req.params.classSlug);
    const klass = getClassBySlug(slug, classSlug);
    if (!klass) {
        return res.status(404).json({ message: "Class not found" });
    }

    return res.json({
        board: getBoardBySlug(slug),
        class: klass,
    });
};

export const getBoardClassSubject = (req: Request, res: Response) => {
    const slug = asString(req.params.slug);
    const classSlug = asString(req.params.classSlug);
    const subjectSlug = asString(req.params.subject);
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

export const getBoardClassSubjectChapter = (req: Request, res: Response) => {
    const slug = asString(req.params.slug);
    const classSlug = asString(req.params.classSlug);
    const subjectSlug = asString(req.params.subject);
    const chapterSlug = asString(req.params.chapter);
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

export const getBoardClassSubjectChapterExercise = (req: Request, res: Response) => {
    const slug = asString(req.params.slug);
    const classSlug = asString(req.params.classSlug);
    const subjectSlug = asString(req.params.subject);
    const chapterSlug = asString(req.params.chapter);
    const exerciseSlug = asString(req.params.exercise);
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

export const getBoardClassSubjectChapterExerciseQuestion = (
    req: Request,
    res: Response,
) => {
    const slug = asString(req.params.slug);
    const classSlug = asString(req.params.classSlug);
    const subjectSlug = asString(req.params.subject);
    const chapterSlug = asString(req.params.chapter);
    const exerciseSlug = asString(req.params.exercise);
    const question = getQuestionData(
        slug,
        classSlug,
        subjectSlug,
        chapterSlug,
        exerciseSlug,
        Number(asString(req.params.questionNum) || "3"),
    );

    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }

    return res.json(question);
};
