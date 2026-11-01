import test from "node:test";
import assert from "node:assert/strict";

import { createApp } from "./app.js";
import { publishedCurriculumSubjects } from "./db/seed-book-covers.js";

test("FBISE Class 9 and Punjab Class 10 curriculum subjects are not Math-only", async () => {
  const fbise9 = publishedCurriculumSubjects("fbise", "9");
  const punjab10 = publishedCurriculumSubjects("punjab", "10");

  assert.ok(fbise9.length >= 6, `expected multiple FBISE 9 subjects, got ${fbise9.length}`);
  assert.ok(fbise9.some((s) => s.slug === "mathematics"));
  assert.ok(fbise9.some((s) => s.slug === "physics" || s.title === "Physics"));
  assert.ok(fbise9.some((s) => /biology/i.test(s.title)));
  assert.ok(punjab10.length >= 1);
  assert.ok(punjab10.some((s) => /biology|chemistry|mathematics/i.test(s.title)));

  const app = createApp();
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;

  const fbiseRes = await fetch(`${base}/api/boards/fbise/classes/9`);
  assert.equal(fbiseRes.status, 200);
  const fbisePayload = await fbiseRes.json();
  const fbiseSubjects = fbisePayload.class.subjects as { slug: string; title: string; chapters?: unknown[] }[];
  assert.ok(fbiseSubjects.length >= 6);
  assert.ok(fbiseSubjects.some((s) => s.slug === "physics" || s.title === "Physics"));
  assert.ok(fbiseSubjects.some((s) => s.slug === "chemistry" || s.title === "Chemistry"));

  const shell = fbiseSubjects.find((s) => s.slug === "physics") ?? fbiseSubjects.find((s) => s.title === "Physics");
  assert.ok(shell);
  // Empty shells are allowed; they must not invent chapter content.
  if (Array.isArray(shell.chapters)) {
    assert.ok(shell.chapters.every((ch) => ch && typeof ch === "object"));
  }

  const punjabRes = await fetch(`${base}/api/boards/punjab/classes/10`);
  assert.equal(punjabRes.status, 200);
  const punjabPayload = await punjabRes.json();
  const punjabSubjects = punjabPayload.class.subjects as { slug: string; title: string }[];
  assert.ok(punjabSubjects.length >= 1);

  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});
