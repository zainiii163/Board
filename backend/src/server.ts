import app from "./vercel-app.js";
import { env } from "./config/env.js";
import { bootstrap } from "./bootstrap.js";

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
