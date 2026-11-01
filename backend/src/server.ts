import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { bootstrap } from "./bootstrap.js";

const app = createApp();

// Finish DB migrate/seed before serving traffic (local + Vercel cold start).
await bootstrap();

// Vercel detects `src/server.ts` and uses this default export as the function.
export default app;

// Local / Docker / Render keep a long-lived process.
if (!process.env.VERCEL) {
  app.listen(env.port, () => {
    console.log(`BoardNotes backend listening on port ${env.port}`);
  });
}
