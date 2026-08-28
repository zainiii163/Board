import multer from "multer";
import type { Request, Response, NextFunction } from "express";

import { portalStore, type PortalResource } from "../../store/portal-store.js";
import { savePdfUpload } from "../pdfs/pdfs.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/api-error.js";

export function toPublicResource(resource: PortalResource) {
  return {
    id: resource.id,
    slug: resource.slug,
    title: resource.title,
    categoryId: resource.categoryId,
    board: resource.board,
    classLabel: resource.classLabel,
    subject: resource.subject,
    author: resource.author,
    description: resource.description,
    fileUrl: resource.fileUrl,
    sizeLabel: resource.sizeLabel,
    pages: resource.pages,
    downloads: resource.downloads,
    addedAt: resource.addedAt,
    status: resource.status,
  };
}

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf" && !file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(new Error("Only PDF files are allowed."));
      return;
    }
    cb(null, true);
  },
});

export const uploadMiddleware = multerUpload.single("file");

export const list = (req: Request, res: Response) => {
  const sort = (req.query.sort as "latest" | "popular" | "a-z") ?? "latest";
  const categorySlug = req.query.category ? String(req.query.category) : undefined;
  const q = req.query.q ? String(req.query.q) : undefined;
  const limit = Number(req.query.limit) || 60;

  const rows = portalStore.listResources({ categorySlug, q, sort }).slice(0, limit);

  const category = categorySlug ? portalStore.getCategoryBySlug(categorySlug) : null;
  res.json({
    resources: rows.map(toPublicResource),
    total: portalStore.listResources({ categorySlug, q, sort }).length,
    category: category
      ? { id: category.id, slug: category.slug, name: category.name, nameUr: category.nameUr, icon: category.icon, gradient: category.gradient }
      : null,
  });
};

export const latest = (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 8;
  res.json(portalStore.getLatest(limit).map(toPublicResource));
};

export const getById = (req: Request, res: Response, next: NextFunction) => {
  const resource = portalStore.getResourceById(Number(req.params.id));
  if (!resource) return next(ApiError.notFound("Resource not found."));
  res.json(toPublicResource(resource));
};

export const getBySlug = (req: Request, res: Response, next: NextFunction) => {
  const resource = portalStore.getResourceBySlug(String(req.params.slug));
  if (!resource) return next(ApiError.notFound("Resource not found."));

  const category = portalStore.getCategory(resource.categoryId);
  const trail = category ? portalStore.getTrail(category.id) : [];
  const related = portalStore.getRelated(resource, 4);

  res.json({
    resource: toPublicResource(resource),
    category: category
      ? { id: category.id, slug: category.slug, name: category.name, nameUr: category.nameUr, icon: category.icon, gradient: category.gradient }
      : null,
    trail: trail.map((c) => ({ slug: c.slug, name: c.name, nameUr: c.nameUr })),
    related: related.map(toPublicResource),
  });
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const title = String(req.body.title ?? "").trim();
    const categoryId = Number(req.body.categoryId);
    const subject = String(req.body.subject ?? "General").trim();
    const board = req.body.board ? String(req.body.board).trim() : null;
    const description = String(req.body.description ?? "").trim();

    if (!title) throw ApiError.badRequest("Title is required.");
    const category = portalStore.getCategory(categoryId);
    if (!category) throw ApiError.badRequest("Please choose a valid category.");

    let fileUrl: string | null = null;
    if (req.file) {
      const saved = await savePdfUpload(req.file.originalname, req.file.buffer);
      fileUrl = saved.url;
    }

    const { getUserById } = await import("../auth/auth.service.js");
    const user = req.user ? await getUserById(req.user.userId) : null;

    const classMatch = category.name.match(/\d+/);
    const resource = portalStore.createResource({
      title,
      categoryId: category.id,
      board: board ?? null,
      classLabel: classMatch ? `Class ${classMatch[0]}` : null,
      subject: subject || "General",
      author: user?.name ?? "Community Member",
      description: description || `Download ${title} in PDF format — free study resource.`,
      fileUrl,
      sizeLabel: req.file ? `${(req.file.size / 1024 / 1024).toFixed(1)} MB` : "N/A",
      pages: 0,
      status: "published",
    });

    res.status(201).json(toPublicResource(resource));
  } catch (error) {
    next(error);
  }
};

export const trackDownload = (req: Request, res: Response, next: NextFunction) => {
  const resource = portalStore.getResourceBySlug(String(req.params.slug));
  if (!resource) return next(ApiError.notFound("Resource not found."));
  const downloads = portalStore.incrementDownloads(resource.id);
  res.json({ slug: resource.slug, downloads });
};

export const update = (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const resource = portalStore.getResourceById(id);
    if (!resource) throw ApiError.notFound("Resource not found.");

    const patch: Partial<Pick<PortalResource, "status" | "title" | "categoryId" | "board" | "description" | "subject">> = {};
    if (typeof req.body.status === "string") patch.status = req.body.status;
    if (typeof req.body.title === "string" && req.body.title.trim()) patch.title = req.body.title.trim();
    if (req.body.categoryId) patch.categoryId = Number(req.body.categoryId);
    if (typeof req.body.board === "string") patch.board = req.body.board;
    if (typeof req.body.subject === "string" && req.body.subject.trim()) patch.subject = req.body.subject.trim();
    if (typeof req.body.description === "string") patch.description = req.body.description.trim();

    const updated = portalStore.updateResource(id, patch);
    res.json(toPublicResource(updated!));
  } catch (error) {
    next(error);
  }
};

export const remove = (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!portalStore.deleteResource(id)) throw ApiError.notFound("Resource not found.");
    res.json({ deleted: true });
  } catch (error) {
    next(error);
  }
};