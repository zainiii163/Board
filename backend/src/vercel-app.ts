import express from "express";
import type { Express, Request, Response, NextFunction } from "express";

const app = express();

app.get(["/", "/api/health"], (_req, res) => {
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
  if (req.path === "/" || req.path === "/api/health" || req.url.startsWith("/api/health")) {
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
        detail: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
        stack: err instanceof Error ? err.stack?.split("\n").slice(0, 12) : undefined,
      });
    }
  }
});

export default app;
