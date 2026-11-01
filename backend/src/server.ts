import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { bootstrap } from "./bootstrap.js";

const app = createApp();

export default app;

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
