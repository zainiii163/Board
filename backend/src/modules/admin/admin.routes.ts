import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { runCatalogBackfill } from "../../db/seed-if-empty.js";
import { useDb } from "../../db/mode.js";
import { ApiError } from "../../utils/api-error.js";

export const adminRouter = Router();

const admins = [requireAuth, requireRole("admin")] as const;

/** Re-sync books → subjects, covers, and other catalog enrichments. */
adminRouter.post("/seed-backfill", ...admins, async (_req, res, next) => {
  try {
    if (!useDb()) {
      throw ApiError.badRequest("Database is not configured.");
    }
    await runCatalogBackfill();
    res.json({ ok: true, message: "Catalog backfill completed." });
  } catch (error) {
    next(error);
  }
});
