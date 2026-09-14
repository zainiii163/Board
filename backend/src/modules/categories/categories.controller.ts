import type { Request, Response, NextFunction } from "express";

import { portalStore, type PortalCategory, type PortalResource } from "../../store/portal-store.js";
import { ApiError } from "../../utils/api-error.js";

function toPublicCategory(category: PortalCategory) {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    nameUr: category.nameUr,
    parentId: category.parentId,
    icon: category.icon,
    gradient: category.gradient,
    imageUrl: category.imageUrl,
  };
}

function toPublicResource(resource: PortalResource) {
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
    coverUrl: resource.coverUrl,
    sizeLabel: resource.sizeLabel,
    pages: resource.pages,
    downloads: resource.downloads,
    addedAt: resource.addedAt,
  };
}

export const list = (_req: Request, res: Response) => {
  const categories = portalStore.listCategories();
  res.json({
    categories: categories.map(toPublicCategory),
    tree: portalStore.getTopCategories().map((top) => ({
      ...toPublicCategory(top),
      children: portalStore.getChildren(top.id).map(toPublicCategory),
    })),
  });
};

export const getBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = portalStore.getCategoryBySlug(String(req.params.slug));
    if (!category) throw ApiError.notFound("Category not found.");

    const children = portalStore.getChildren(category.id).map(toPublicCategory);
    const resources = portalStore
      .listResources({ categorySlug: category.slug })
      .slice(0, 24)
      .map(toPublicResource);

    const trail = portalStore.getTrail(category.id).map(toPublicCategory);
    const siblings =
      (category.parentId ? portalStore.getChildren(category.parentId) : portalStore.getTopCategories())
        .filter((c) => c.id !== category.id)
        .map(toPublicCategory);

    res.json({
      category: toPublicCategory(category),
      trail,
      children,
      siblings,
      resources,
      total: portalStore.listResources({ categorySlug: category.slug }).length,
    });
  } catch (error) {
    next(error);
  }
};