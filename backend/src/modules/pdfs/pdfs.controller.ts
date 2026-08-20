import type { Request, Response } from "express";

const buildPdfResponse = (filename: string) => ({
  id: filename,
  url: `/demo-pdfs/${filename}`,
  filename,
  size: "1.2 MB",
  uploadedAt: new Date().toISOString(),
});

export const list = (_req: Request, res: Response) => {
  const demoFiles = [
    "fbise-9-math-ch1-ex1-1.pdf",
    "fbise-9-math-ch1-ex1-1-q4.pdf",
    "fbise-9-math-ch1-ex1-1-q5.pdf",
    "fbise-9-math-ch1-ex1-1-q6.pdf",
    "fbise-9-math-ch1-ex1-1-q7.pdf",
    "fbise-9-math-ch3-ex3-1.pdf",
    "fbise-9-math-ch3-ex3-2.pdf",
  ].map(buildPdfResponse);

  res.json(demoFiles);
};

export const getById = (req: Request, res: Response) => {
  const filename = String(req.params.id ?? "").trim();

  if (!filename) {
    return res.status(400).json({ message: "PDF filename is required" });
  }

  return res.json(buildPdfResponse(filename));
};

export const upload = (_req: Request, res: Response) => res.status(201).json({ uploaded: true });
export const remove = (_req: Request, res: Response) => res.json({ deleted: true });
