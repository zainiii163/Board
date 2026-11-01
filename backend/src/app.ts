import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { env } from "./config/env.js";
import { bootstrap } from "./bootstrap.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./utils/error-handler.js";
import { isR2Enabled } from "./storage/r2-storage.js";
import { readUploadBuffer, uploadExistsLocally } from "./store/pdf-store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");

export function createApp() {
  const app = express();

  // Lazy boot (migrate/seed) — no top-level await (breaks Vercel cold start).
  // Health stays available even if bootstrap fails (shows demo/empty instead of 500).
  app.use(async (req, _res, next) => {
    if (req.path === "/api/health" || req.url.startsWith("/api/health")) {
      return next();
    }
    try {
      await bootstrap();
      next();
    } catch (err) {
      console.error("[boot] bootstrap failed:", err);
      next(err);
    }
  });

  // Legacy Next rewrite prefix: /backend-api/api/... → /api/...
  app.use((req, _res, next) => {
    if (req.url.startsWith("/backend-api")) {
      req.url = req.url.slice("/backend-api".length) || "/";
    }
    next();
  });

  app.use(
    cors({
      origin: env.corsOrigins,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(express.json());
  app.use(
    "/demo-pdfs",
    express.static(path.join(PUBLIC_DIR, "demo-pdfs")),
  );
  app.use(
    "/book-covers",
    express.static(path.join(PUBLIC_DIR, "book-covers")),
  );

  app.get("/uploads/:filename", async (req, res, next) => {
    const filename = String(req.params.filename);
    if (!filename.toLowerCase().endsWith(".pdf") || filename.includes("..") || filename.includes("/")) {
      return res.status(400).json({ error: "Invalid filename." });
    }
    if (uploadExistsLocally(filename)) return next();
    if (!isR2Enabled()) return next();
    try {
      const buffer = await readUploadBuffer(filename);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.send(buffer);
    } catch {
      next();
    }
  });

  app.use(
    "/uploads",
    express.static(path.join(PUBLIC_DIR, "uploads")),
  );
  app.get("/", (_req, res) => {
    res.json({
      name: "BoardNotes API",
      message: "Backend is running.",
    });
  });

  // Override the lightweight health from vercel-app with DB diagnostics.
  app.get("/api/health", async (_req, res) => {
    const { isDbConfigured } = await import("./db/index.js");
    const { useDb, initDbMode } = await import("./db/mode.js");
    let connected = useDb();
    if (isDbConfigured && !connected) {
      connected = await initDbMode();
    }
    res.json({
      status: "ok",
      service: "boardnotes-backend",
      timestamp: new Date().toISOString(),
      vercel: Boolean(process.env.VERCEL),
      database: {
        configured: isDbConfigured,
        connected,
      },
    });
  });

  app.use("/api", apiRouter);
  app.use(errorHandler);

  return app;
}
