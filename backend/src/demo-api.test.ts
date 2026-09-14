import test from "node:test";
import assert from "node:assert/strict";

import { createApp } from "./app.js";

test("GET /api/boards returns the demo boards", async () => {
    const app = createApp();
    const server = app.listen(0);

    await new Promise<void>((resolve) => server.once("listening", resolve));

    const address = server.address();
    assert.ok(address && typeof address !== "string");

    const response = await fetch(`http://127.0.0.1:${address.port}/api/boards`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.length, 6);
    assert.deepEqual(
        payload.map((board: { slug: string; title: string; ready: boolean; chapterCount: number }) => ({
            slug: board.slug,
            title: board.title,
            ready: board.ready,
            chapterCount: board.chapterCount,
        })),
        [
            { slug: "fbise", title: "Federal Board (FBISE)", ready: true, chapterCount: 9 },
            { slug: "punjab", title: "Punjab Board", ready: true, chapterCount: 8 },
            { slug: "kpk", title: "KPK Board", ready: true, chapterCount: 8 },
            { slug: "sindh", title: "Sindh Board", ready: true, chapterCount: 8 },
            { slug: "oxford", title: "Oxford Board", ready: true, chapterCount: 8 },
            { slug: "cambridge", title: "Cambridge Board", ready: true, chapterCount: 8 },
        ],
    );

    const levelClassResponse = await fetch(
        `http://127.0.0.1:${address.port}/api/boards/fbise/classes/5`,
    );
    const levelClassPayload = await levelClassResponse.json();
    assert.equal(levelClassResponse.status, 200);
    assert.equal(levelClassPayload.class.slug, "5");
    assert.equal(levelClassPayload.class.title, "Class 5");

    const levelChapterResponse = await fetch(
        `http://127.0.0.1:${address.port}/api/boards/oxford/classes/11/subjects/mathematics/chapters/trigonometry`,
    );
    const levelChapterPayload = await levelChapterResponse.json();
    assert.equal(levelChapterResponse.status, 200);
    assert.equal(levelChapterPayload.chapter.slug, "trigonometry");
    const levelChapterExercise = levelChapterPayload.chapter.exercises[0];
    assert.equal(levelChapterExercise.title, "Exercise 1.1");

    const levelQuestionResponse = await fetch(
        `http://127.0.0.1:${address.port}/api/boards/cambridge/classes/10/subjects/mathematics/chapters/quadratic-equations/exercises/exercise-1-1/q/2`,
    );
    const levelQuestionPayload = await levelQuestionResponse.json();
    assert.equal(levelQuestionResponse.status, 200);
    assert.equal(levelQuestionPayload.question.num, 2);
    assert.ok(levelQuestionPayload.question.question.includes("2x^2 - 5x - 3"));
    assert.ok(
        levelQuestionPayload.question.steps.some(
            (step: { content: string }) => step.content.includes("\\frac{5 \\pm \\sqrt{49}}{4}"),
        ),
    );

    const punjabChapter = await fetch(
        `http://127.0.0.1:${address.port}/api/boards/punjab/classes/9/subjects/mathematics/chapters/sets`,
    );
    assert.equal(punjabChapter.status, 200);
    const punjabPayload = await punjabChapter.json();
    assert.equal(punjabPayload.chapter.slug, "sets");
    assert.equal(punjabPayload.chapter.title, "Sets");

    const kpkChapter = await fetch(
        `http://127.0.0.1:${address.port}/api/boards/kpk/classes/9/subjects/mathematics/chapters/linear-equations`,
    );
    assert.equal(kpkChapter.status, 200);
    const kpkPayload = await kpkChapter.json();
    assert.equal(kpkPayload.chapter.slug, "linear-equations");

    const sindhChapter = await fetch(
        `http://127.0.0.1:${address.port}/api/boards/sindh/classes/9/subjects/mathematics/chapters/algebraic-expressions`,
    );
    assert.equal(sindhChapter.status, 200);
    const sindhPayload = await sindhChapter.json();
    assert.equal(sindhPayload.chapter.slug, "algebraic-expressions");

    const oxfordChapter = await fetch(
        `http://127.0.0.1:${address.port}/api/boards/oxford/classes/9/subjects/mathematics/chapters/number-systems`,
    );
    assert.equal(oxfordChapter.status, 200);
    const oxfordPayload = await oxfordChapter.json();
    assert.equal(oxfordPayload.chapter.slug, "number-systems");

    const cambridgeChapter = await fetch(
        `http://127.0.0.1:${address.port}/api/boards/cambridge/classes/9/subjects/mathematics/chapters/algebra`,
    );
    assert.equal(cambridgeChapter.status, 200);
    const cambridgePayload = await cambridgeChapter.json();
    assert.equal(cambridgePayload.chapter.slug, "algebra");

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
    assert.equal(questionPayload.question.question, "Express $0.75$ as a rational number in the form $\\frac{a}{b}$.");

    const q4Response = await fetch(
        `http://127.0.0.1:${address.port}/api/boards/fbise/classes/9/subjects/mathematics/chapters/real-numbers/exercises/exercise-1-1/q/4`,
    );
    const q4Payload = await q4Response.json();
    assert.equal(q4Response.status, 200);
    assert.equal(q4Payload.question.num, 4);
    assert.equal(q4Payload.question.question, "Simplify $\\sqrt{12} + \\sqrt{27}$.");

    const q5Response = await fetch(
        `http://127.0.0.1:${address.port}/api/boards/fbise/classes/9/subjects/mathematics/chapters/real-numbers/exercises/exercise-1-1/q/5`,
    );
    const q5Payload = await q5Response.json();
    assert.equal(q5Response.status, 200);
    assert.equal(q5Payload.question.num, 5);
    assert.equal(q5Payload.question.question, "Evaluate $\\frac{1}{\\sqrt{2} - 1}$.");

    const logsChapterResponse = await fetch(
        `http://127.0.0.1:${address.port}/api/chapters/logarithms`,
    );
    const logsChapterPayload = await logsChapterResponse.json();
    assert.equal(logsChapterResponse.status, 200);
    assert.equal(logsChapterPayload.slug, "logarithms");

    const logsQuestionResponse = await fetch(
        `http://127.0.0.1:${address.port}/api/boards/fbise/classes/9/subjects/mathematics/chapters/logarithms/exercises/exercise-3-2/q/2`,
    );
    const logsQuestionPayload = await logsQuestionResponse.json();
    assert.equal(logsQuestionResponse.status, 200);
    assert.equal(logsQuestionPayload.question.num, 2);
    assert.ok(logsQuestionPayload.question.question.includes("\\log_{10}"));

    const logsQ1Response = await fetch(
        `http://127.0.0.1:${address.port}/api/boards/fbise/classes/9/subjects/mathematics/chapters/logarithms/exercises/exercise-3-1/q/2`,
    );
    assert.equal(logsQ1Response.status, 200);
    const logsQ1Payload = await logsQ1Response.json();
    assert.equal(logsQ1Payload.question.num, 2);
    assert.ok(logsQ1Payload.question.question.includes("\\log_2 8"));

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
