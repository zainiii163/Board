import { env, isProduction, isR2Configured } from "./config/env.js";
import { seedDefaultUsers } from "./modules/auth/auth.service.js";
import { initDbMode, resetDbModeForTests } from "./db/mode.js";
import { runCatalogBackfill, seedIfEmpty } from "./db/seed-if-empty.js";
import { applyMigrations } from "./db/migrate.js";

let bootstrapPromise: Promise<boolean> | null = null;

async function runBootstrap(): Promise<boolean> {
  if (isProduction()) {
    if (!env.databaseUrl) {
      console.warn("[warn] DATABASE_URL is not set — CMS data will not persist.");
    }
    if (env.jwtSecret === "change-me" || env.jwtSecret.includes("dev-secret")) {
      console.warn("[warn] Set a strong JWT_SECRET in production.");
    }
    const r2Vars = [env.r2Bucket, env.r2AccessKey, env.r2SecretKey, env.r2Endpoint].filter(Boolean).length;
    if (r2Vars > 0 && r2Vars < 4) {
      console.warn(
        "[warn] R2 storage is partially configured — set R2_BUCKET, R2_ACCESS_KEY, R2_SECRET_KEY, and R2_ENDPOINT together.",
      );
    }
    if (process.env.VERCEL && !isR2Configured()) {
      console.warn(
        "[warn] Running on Vercel without R2 — uploaded PDFs will not persist. Configure R2_* env vars.",
      );
    }
  }

  const dbOk = await initDbMode();

  if (dbOk) {
    if (env.autoMigrate) {
      try {
        await applyMigrations();
      } catch (err) {
        console.warn("[db] Auto-migration failed:", err instanceof Error ? err.message : err);
      }
    }
    // Full catalog seed is too heavy for Vercel serverless cold starts (OOM / crash).
    // Run once locally or set SEED_ON_BOOT=true for a single deploy.
    // SEED_BACKFILL=true alone re-applies subject/book enrichments without a full empty-DB seed.
    const shouldSeed =
      process.env.SEED_ON_BOOT === "true" || (!process.env.VERCEL && process.env.SEED_ON_BOOT !== "false");
    const shouldBackfill = process.env.SEED_BACKFILL === "true";
    if (shouldSeed) {
      try {
        await seedIfEmpty();
      } catch (err) {
        console.warn("[db] Auto-seed skipped:", err instanceof Error ? err.message : err);
      }
    } else if (shouldBackfill) {
      try {
        await runCatalogBackfill();
      } catch (err) {
        console.warn("[db] Catalog backfill skipped:", err instanceof Error ? err.message : err);
      }
    } else if (process.env.VERCEL) {
      console.log("[db] Skipping catalog seed on Vercel cold start (set SEED_ON_BOOT / SEED_BACKFILL to force).");
    }
  } else {
    console.log(
      "[db] Running in demo memory mode — CMS changes reset on restart. Set DATABASE_URL and run migrations for real persistence.",
    );
  }

  await seedDefaultUsers();

  console.log(
    dbOk ? "[db] PostgreSQL is the source of truth for CMS content." : "[db] Using in-memory demo CMS fallback.",
  );
  console.log(
    isR2Configured()
      ? "[storage] PDF uploads use Cloudflare R2."
      : "[storage] PDF uploads use local disk (public/uploads).",
  );

  return dbOk;
}

/** Idempotent boot (migrate/seed). Safe to await on every cold start. */
export function bootstrap() {
  if (!bootstrapPromise) {
    bootstrapPromise = runBootstrap();
  }
  return bootstrapPromise;
}

/** Test helper: allow a fresh bootstrap after forcing BOARDNOTES_DATA_MODE. */
export function resetBootstrapForTests() {
  bootstrapPromise = null;
  resetDbModeForTests();
}
