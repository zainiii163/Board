import type { Request, Response } from "express";

import { getQuestionData } from "../../demo-data.js";

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

export const list = (req: Request, res: Response) => {
    const board = readQueryValue(req.query.board, "fbise");
    const classSlug = readQueryValue(req.query.class, "9");
    const subject = readQueryValue(req.query.subject, "mathematics");
    const chapter = readQueryValue(req.query.chapter, "real-numbers");
    const exercise = readQueryValue(req.query.exercise, "exercise-1-1");
    const questionNum = Number(readQueryValue(req.query.question, "3") || "3");

    const question = getQuestionData(board, classSlug, subject, chapter, exercise, questionNum);

    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }

    return res.json(question);
};

export const getById = (req: Request, res: Response) => {
    const id = Number(asString(req.params.id) || "3");
    const question = getQuestionData("fbise", "9", "mathematics", "real-numbers", "exercise-1-1", id);

    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }

    return res.json(question);
};

export const create = (_req: Request, res: Response) => res.status(201).json({ created: true });
export const update = (_req: Request, res: Response) => res.json({ updated: true });
export const remove = (_req: Request, res: Response) => res.json({ deleted: true });
