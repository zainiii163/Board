import type { Request, Response } from "express";

import { BOARD_LIST, getBoardBySlug, getClassBySlug } from "../../demo-data.js";

const asString = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

const getClassContext = (classSlug: string) => {
    for (const board of BOARD_LIST) {
        const boardData = getBoardBySlug(board.slug);
        const klass = boardData?.classes.find((item) => item.slug === classSlug);
        if (klass) {
            return {
                board: boardData,
                class: klass,
            };
        }
    }
    return null;
};

export const list = (_req: Request, res: Response) => {
    const classes = BOARD_LIST.flatMap((board) => {
        const boardData = getBoardBySlug(board.slug);
        return (boardData?.classes ?? []).map((klass) => ({
            slug: klass.slug,
            title: klass.title,
            board: board.slug,
            boardTitle: board.title,
            subjectCount: klass.subjects.length,
        }));
    });

    res.json(classes);
};

export const getBySlug = (req: Request, res: Response) => {
    const classSlug = asString(req.params.slug);
    const context = getClassContext(classSlug);

    if (!context) {
        return res.status(404).json({ message: "Class not found" });
    }

    return res.json({
        slug: context.class.slug,
        title: context.class.title,
        board: context.board?.slug,
        boardTitle: context.board?.title,
        subjects: context.class.subjects.map((subject) => ({
            slug: subject.slug,
            title: subject.title,
            chapterCount: subject.chapters.length,
        })),
    });
};

export const create = (_req: Request, res: Response) => res.status(201).json({ created: true });
export const update = (_req: Request, res: Response) => res.json({ updated: true });
export const remove = (_req: Request, res: Response) => res.json({ deleted: true });
