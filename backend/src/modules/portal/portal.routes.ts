import { Router } from "express";

import { portalStore } from "../../store/portal-store.js";

export const portalRouter = Router();

portalRouter.get("/stats", async (_req, res, next) => {
  try {
    const { listUsers } = await import("../auth/auth.service.js");
    const users = await listUsers();
    res.json({
      books: portalStore.stats().books,
      categories: portalStore.stats().categories,
      users: users.length,
    });
  } catch (error) {
    next(error);
  }
});

portalRouter.get("/nav", (_req, res) => {
  res.json({
    tree: portalStore.getTopCategories().map((top) => ({
      slug: top.slug,
      name: top.name,
      nameUr: top.nameUr,
      icon: top.icon,
      gradient: top.gradient,
      children: portalStore.getChildren(top.id).map((child) => ({
        slug: child.slug,
        name: child.name,
        nameUr: child.nameUr,
        icon: child.icon,
        gradient: child.gradient,
      })),
    })),
  });
});

portalRouter.get("/categories", (_req, res) => {
  const all = portalStore.listCategories();
  res.json({ categories: all });
});