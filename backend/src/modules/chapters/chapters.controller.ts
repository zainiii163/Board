import type { Request, Response } from "express";

import { BOARD_LIST, getBoardBySlug } from "../../demo-data.js";

const asString = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

const getChapterContext = (chapterSlug: string) => {
    for (const board of BOARD_LIST) {
        const boardData = getBoardBySlug(board.slug);
        if (!boardData) continue;

        for (const klass of boardData.classes) {
            for (const subject of klass.subjects) {
                const chapter = subject.chapters.find((item) => item.slug === chapterSlug);
                if (chapter) {
                    return {
                        board: boardData,
                        class: klass,
                        subject,
                        chapter,
                    };
                }
            }
        }
    }

    return null;
};

export const list = (_req: Request, res: Response) => {
    const chapters = BOARD_LIST.flatMap((board) => {
        const boardData = getBoardBySlug(board.slug);
        return (boardData?.classes ?? []).flatMap((klass) =>
            klass.subjects.flatMap((subject) =>
                subject.chapters.map((chapter) => ({
                    slug: chapter.slug,
                    title: chapter.title,
                    board: board.slug,
                    boardTitle: board.title,
                    classSlug: klass.slug,
                    classTitle: klass.title,
                    subjectSlug: subject.slug,
                    subjectTitle: subject.title,
                })),
            ),
        );
    });

    res.json(chapters);
};

export const getBySlug = (req: Request, res: Response) => {
    const chapterSlug = asString(req.params.slug);
    const context = getChapterContext(chapterSlug);

    if (!context) {
        return res.status(404).json({ message: "Chapter not found" });
    }

    return res.json({
        slug: context.chapter.slug,
        title: context.chapter.title,
        summary: context.chapter.summary,
        formulas: context.chapter.formulas,
        exercises: context.chapter.exercises,
        board: context.board,
        class: context.class,
        subject: context.subject,
    });
};

export const create = (_req: Request, res: Response) => res.status(201).json({ created: true });
export const update = (_req: Request, res: Response) => res.json({ updated: true });
export const reorder = (_req: Request, res: Response) => res.json({ reordered: true });
export const publish = (_req: Request, res: Response) => res.json({ published: true });
export const unpublish = (_req: Request, res: Response) => res.json({ unpublished: true });
export const remove = (_req: Request, res: Response) => res.json({ deleted: true });
