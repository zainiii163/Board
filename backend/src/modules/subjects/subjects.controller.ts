import type { Request, Response } from "express";

import { BOARD_LIST, getBoardBySlug, getClassBySlug, getSubjectBySlug } from "../../demo-data.js";

const asString = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

const getSubjectContext = (subjectSlug: string) => {
    for (const board of BOARD_LIST) {
        const boardData = getBoardBySlug(board.slug);
        if (!boardData) continue;

        for (const klass of boardData.classes) {
            const subject = klass.subjects.find((item) => item.slug === subjectSlug);
            if (subject) {
                return {
                    board: boardData,
                    class: klass,
                    subject,
                };
            }
        }
    }

    return null;
};

export const list = (_req: Request, res: Response) => {
    const subjects = BOARD_LIST.flatMap((board) => {
        const boardData = getBoardBySlug(board.slug);
        return (boardData?.classes ?? []).flatMap((klass) =>
            klass.subjects.map((subject) => ({
                slug: subject.slug,
                title: subject.title,
                board: board.slug,
                boardTitle: board.title,
                classSlug: klass.slug,
                classTitle: klass.title,
                chapterCount: subject.chapters.length,
            })),
        );
    });

    res.json(subjects);
};

export const getBySlug = (req: Request, res: Response) => {
    const subjectSlug = asString(req.params.slug);
    const context = getSubjectContext(subjectSlug);

    if (!context) {
        return res.status(404).json({ message: "Subject not found" });
    }

    return res.json({
        slug: context.subject.slug,
        title: context.subject.title,
        board: context.board,
        class: context.class,
        chapters: context.subject.chapters.map((chapter) => ({
            slug: chapter.slug,
            title: chapter.title,
            summary: chapter.summary,
            formulas: chapter.formulas,
            exercises: chapter.exercises,
        })),
    });
};

export const create = (_req: Request, res: Response) => res.status(201).json({ created: true });
export const update = (_req: Request, res: Response) => res.json({ updated: true });
export const remove = (_req: Request, res: Response) => res.json({ deleted: true });
