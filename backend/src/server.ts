import { createApp } from "./app.js";
import { env, isProduction, isR2Configured } from "./config/env.js";
import { seedDefaultUsers } from "./modules/auth/auth.service.js";
import { initDbMode } from "./db/mode.js";
import { seedIfEmpty } from "./db/seed-if-empty.js";

const app = createApp();

async function start() {
  if (isProduction()) {
    if (!env.databaseUrl) {
      console.warn("[warn] DATABASE_URL is not set — CMS data will not persist.");
    }
    if (env.jwtSecret === "change-me" || env.jwtSecret.includes("dev-secret")) {
      console.warn("[warn] Set a strong JWT_SECRET in production.");
    }
    const r2Vars = [env.r2Bucket, env.r2AccessKey, env.r2SecretKey, env.r2Endpoint].filter(Boolean).length;
    if (r2Vars > 0 && r2Vars < 4) {
      console.warn("[warn] R2 storage is partially configured — set R2_BUCKET, R2_ACCESS_KEY, R2_SECRET_KEY, and R2_ENDPOINT together.");
    }
  }

  const dbOk = await initDbMode();

  if (dbOk) {
    try {
      await seedIfEmpty();
    } catch (err) {
      console.warn("[db] Auto-seed skipped:", err instanceof Error ? err.message : err);
    }
  } else {
    console.log(
      "[db] Running in demo memory mode — CMS changes reset on restart. Set DATABASE_URL and run migrations for real persistence.",
    );
  }

  await seedDefaultUsers();

  app.listen(env.port, () => {
    console.log(`BoardNotes backend listening on port ${env.port}`);
    console.log(
      dbOk ? "[db] PostgreSQL is the source of truth for CMS content." : "[db] Using in-memory demo CMS fallback.",
    );
    console.log(
      isR2Configured()
        ? "[storage] PDF uploads use Cloudflare R2."
        : "[storage] PDF uploads use local disk (public/uploads).",
    );
  });
}

start();
