import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { bootstrap } from "./bootstrap.js";

const app = createApp();

// Vercel detects `src/server.ts` and uses this default export.
export default app;

// Local / Docker keep a long-lived process.
if (!process.env.VERCEL) {
  bootstrap()
    .then(() => {
      app.listen(env.port, () => {
        console.log(`BoardNotes backend listening on port ${env.port}`);
      });
    })
    .catch((err) => {
      console.error("[boot] Failed to start:", err);
      process.exit(1);
    });
}
