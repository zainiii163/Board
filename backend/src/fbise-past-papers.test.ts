import test from "node:test";
import assert from "node:assert/strict";

import { createApp } from "./app.js";
import {
  CLASS_9_SUBJECTS,
  CLASS_10_SUBJECTS,
  CLASS_SOURCE_URLS,
  FBISE_SOURCE_ROW_COUNT,
} from "./db/seed-fbise-past-paper-sources.js";

test("FBISE Class 9/10 source inventory matches client subject policy", () => {
  assert.ok(CLASS_9_SUBJECTS.includes("Tarjuma-tul-Quran"));
  assert.ok(!CLASS_9_SUBJECTS.includes("Pakistan Studies"));
  assert.ok(CLASS_10_SUBJECTS.includes("Pakistan Studies"));
  assert.ok(!CLASS_10_SUBJECTS.includes("Islamiat"));
  assert.equal(CLASS_SOURCE_URLS["9"], "https://fbisepastpapers.com/class-9-fbise-past-papers/");
  assert.equal(CLASS_SOURCE_URLS["10"], "https://fbisepastpapers.com/class-10-fbise-past-papers/");
  // 9 subjects × 7 sessions + 8 subjects × 3 sessions + 1 Chemistry PBA = 88
  assert.equal(FBISE_SOURCE_ROW_COUNT, CLASS_9_SUBJECTS.length * 7 + CLASS_10_SUBJECTS.length * 3 + 1);
});

test("GET /api/past-papers returns arrays and never claims source rows as local PDFs in demo mode", async () => {
  const app = createApp();
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));

  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;

  const all = await fetch(`${base}/api/past-papers?board=fbise`);
  assert.equal(all.status, 200);
  const papers = await all.json();
  assert.ok(Array.isArray(papers));

  for (const paper of papers as {
    boardSlug: string;
    classSlug: string;
    subjectTitle: string;
    syllabus?: string;
    pdfUrl?: string | null;
    driveUrl?: string | null;
  }[]) {
    assert.equal(paper.boardSlug, "fbise");
    if (paper.classSlug === "9" || paper.classSlug === "10") {
      if (paper.classSlug === "9") {
        assert.notEqual(paper.subjectTitle, "Pakistan Studies");
      }
      if (paper.classSlug === "10") {
        assert.notEqual(paper.subjectTitle, "Islamiat");
      }
    }
    // Source inventory must not be presented as a hosted PDF.
    if (!paper.pdfUrl && paper.driveUrl) {
      assert.match(paper.driveUrl, /^https?:\/\//);
    }
  }

  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});
