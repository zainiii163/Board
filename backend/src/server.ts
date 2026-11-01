import express from "express";
import type { Express, Request, Response, NextFunction } from "express";

/**
 * Thin Vercel entry: no DB/seed imports at module load.
 * /api/health must work even when the full app fails to boot.
 */
const app = express();

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "boardnotes-backend",
    timestamp: new Date().toISOString(),
    vercel: Boolean(process.env.VERCEL),
  });
});

let fullAppPromise: Promise<Express> | null = null;

function loadFullApp() {
  if (!fullAppPromise) {
    fullAppPromise = import("./app.js")
      .then((mod) => mod.createApp())
      .catch((err) => {
        fullAppPromise = null;
        throw err;
      });
  }
  return fullAppPromise;
}

app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (req.path === "/api/health" || req.url.startsWith("/api/health")) {
    return next();
  }
  try {
    const fullApp = await loadFullApp();
    return fullApp(req, res, next);
  } catch (err) {
    console.error("[boot] failed to load Express app:", err);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Backend failed to start",
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  }
});

export default app;

if (!process.env.VERCEL) {
  const port = Number(process.env.PORT ?? 4000);
  Promise.all([import("./bootstrap.js"), loadFullApp()])
    .then(async ([boot]) => {
      await boot.bootstrap();
      app.listen(port, () => {
        console.log(`BoardNotes backend listening on port ${port}`);
      });
    })
    .catch((err) => {
      console.error("[boot] Failed to start:", err);
      process.exit(1);
    });
}
