import cors from "cors";
import express from "express";

import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./utils/error-handler.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({
      name: "BoardNotes API",
      message: "Backend is running.",
    });
  });

  app.use("/api", apiRouter);
  app.use(errorHandler);

  return app;
}
