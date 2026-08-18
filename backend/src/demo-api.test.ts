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

test("GET /api/classes/9 and /api/subjects/mathematics serve the SRS learning hierarchy", async () => {
    const app = createApp();
    const server = app.listen(0);

    await new Promise<void>((resolve) => server.once("listening", resolve));

    const address = server.address();
    assert.ok(address && typeof address !== "string");

    const classResponse = await fetch(`http://127.0.0.1:${address.port}/api/classes/9`);
    const classPayload = await classResponse.json();
    assert.equal(classResponse.status, 200);
    assert.equal(classPayload.slug, "9");
    assert.equal(classPayload.title, "Class 9");

    const subjectResponse = await fetch(`http://127.0.0.1:${address.port}/api/subjects/mathematics`);
    const subjectPayload = await subjectResponse.json();
    assert.equal(subjectResponse.status, 200);
    assert.equal(subjectPayload.slug, "mathematics");
    assert.equal(subjectPayload.title, "Mathematics");
    assert.ok(subjectPayload.chapters.some((chapter: { slug: string }) => chapter.slug === "real-numbers"));

    const chapterResponse = await fetch(
        `http://127.0.0.1:${address.port}/api/chapters/real-numbers`,
    );
    const chapterPayload = await chapterResponse.json();
    assert.equal(chapterResponse.status, 200);
    assert.equal(chapterPayload.slug, "real-numbers");
    assert.equal(chapterPayload.title, "Real Numbers");

    const questionResponse = await fetch(
        `http://127.0.0.1:${address.port}/api/boards/fbise/classes/9/subjects/mathematics/chapters/real-numbers/exercises/exercise-1-1/q/3`,
    );
    const questionPayload = await questionResponse.json();
    assert.equal(questionResponse.status, 200);
    assert.equal(questionPayload.question.num, 3);
    assert.equal(questionPayload.question.question, "Express 0.75 as a rational number in the form a/b.");

    const classPageResponse = await fetch(
        `http://127.0.0.1:${address.port}/api/boards/fbise/classes/9`,
    );
    const classPagePayload = await classPageResponse.json();
    assert.equal(classPageResponse.status, 200);
    assert.equal(classPagePayload.board.slug, "fbise");
    assert.equal(classPagePayload.class.slug, "9");
    assert.equal(classPagePayload.class.title, "Class 9");

    await new Promise<void>((resolve, reject) => {
        server.close((error) => {
            if (error) reject(error);
            else resolve();
        });
    });
});
