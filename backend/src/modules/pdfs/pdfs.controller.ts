import type { Request, Response } from "express";

export const list = (_req: Request, res: Response) => res.json([]);
export const getById = (req: Request, res: Response) => {
  const filename = req.params.id;
  res.json({
    id: filename,
    url: `/demo-pdfs/${filename}`,
    filename,
    size: "1.2 MB",
    uploadedAt: new Date().toISOString()
  });
};
export const upload = (_req: Request, res: Response) => res.status(201).json({ uploaded: true });
export const remove = (_req: Request, res: Response) => res.json({ deleted: true });
