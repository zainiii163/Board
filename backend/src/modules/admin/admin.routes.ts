import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { runCatalogBackfill } from "../../db/seed-if-empty.js";
import { isDbConfigured } from "../../db/index.js";
import { initDbMode, useDb } from "../../db/mode.js";
import { ApiError } from "../../utils/api-error.js";

export const adminRouter = Router();

const admins = [requireAuth, requireRole("admin")] as const;

/** Re-sync books → subjects, covers, and other catalog enrichments. */
adminRouter.post("/seed-backfill", ...admins, async (_req, res, next) => {
  try {
    if (!isDbConfigured) {
      throw ApiError.badRequest("DATABASE_URL is not set on this deployment.");
    }
    // Cold starts can race bootstrap — re-check the pool before backfill.
    if (!useDb()) {
      const ok = await initDbMode();
      if (!ok) {
        throw ApiError.badRequest("PostgreSQL is unreachable right now. Retry in a minute.");
      }
    }
    await runCatalogBackfill();
    res.json({ ok: true, message: "Catalog backfill completed." });
  } catch (error) {
    next(error);
  }
});
