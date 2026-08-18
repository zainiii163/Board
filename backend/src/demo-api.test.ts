import test from "node:test";
import assert from "node:assert/strict";

import { createApp } from "./app.js";

test("GET /api/boards returns the four demo boards", async () => {
    const app = createApp();
    const server = app.listen(0);

    await new Promise<void>((resolve) => server.once("listening", resolve));

    const address = server.address();
    assert.ok(address && typeof address !== "string");

    const response = await fetch(`http://127.0.0.1:${address.port}/api/boards`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(payload, [
        { slug: "fbise", title: "Federal Board (FBISE)" },
        { slug: "punjab", title: "Punjab Board" },
        { slug: "kpk", title: "KPK Board" },
        { slug: "sindh", title: "Sindh Board" },
    ]);

    await new Promise<void>((resolve, reject) => {
        server.close((error) => {
            if (error) reject(error);
            else resolve();
        });
    });
});
