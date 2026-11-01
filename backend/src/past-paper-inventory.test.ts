import test from "node:test";
import assert from "node:assert/strict";

import { createApp } from "./app.js";
import {
  buildFbiseSourceCatalog,
  CLASS_9_SUBJECTS,
  CLASS_10_SUBJECTS,
  CLASS_SOURCE_URLS,
  FBISE_SOURCE_ROW_COUNT,
} from "./db/seed-fbise-past-paper-sources.js";
import { mergeFbisePastPaperInventory } from "./modules/past-papers/past-papers.service.js";
import type { PastPaperRecord } from "./store/resources-store.js";

test("merge hides empty Class 9 Math 2026 model orphan and backfills archive driveUrl", () => {
  const orphan: PastPaperRecord = {
    id: 1,
    boardSlug: "fbise",
    boardTitle: "Federal Board (FBISE)",
    classSlug: "9",
    classTitle: "Class 9",
    subjectSlug: "mathematics",
    subjectTitle: "Mathematics",
    year: "2026",
    sessionType: "annual",
    paperType: "model",
    isSolved: false,
    syllabus: "new",
    pdfUrl: null,
    driveUrl: null,
  };
  const catalogMatch: PastPaperRecord = {
    ...orphan,
    id: 2,
    year: "2024",
    paperType: "model",
    driveUrl: null,
  };

  const merged = mergeFbisePastPaperInventory([orphan, catalogMatch]);
  assert.equal(
    merged.some((p) => p.classSlug === "9" && p.subjectTitle === "Mathematics" && p.year === "2026" && p.paperType === "model"),
    false,
    "unannotated empty orphan must not appear in public inventory",
  );

  const model2024 = merged.find(
    (p) => p.classSlug === "9" && p.subjectTitle === "Mathematics" && p.year === "2024" && p.paperType === "model",
  );
  assert.ok(model2024);
  assert.equal(model2024.pdfUrl, null);
  assert.equal(model2024.driveUrl, CLASS_SOURCE_URLS["9"]);
  assert.ok(merged.every((p) => p.pdfUrl === null || Boolean(p.pdfUrl)));
  assert.ok(merged.every((p) => p.pdfUrl || p.driveUrl), "every public row needs pdf or archive source");
});

test("FBISE source catalog rows are archive links, never fabricated local PDFs", () => {
  const rows = buildFbiseSourceCatalog();
  assert.equal(rows.length, FBISE_SOURCE_ROW_COUNT);

  const class9 = rows.filter((r) => r.classSlug === "9");
  const class10 = rows.filter((r) => r.classSlug === "10");
  assert.equal(class9.length, CLASS_9_SUBJECTS.length * 7);
  assert.equal(class10.length, CLASS_10_SUBJECTS.length * 3 + 1);

  for (const row of rows) {
    assert.equal(row.pdfUrl, null, `${row.subjectTitle} ${row.year} ${row.paperType} must not invent pdfUrl`);
    assert.equal(row.syllabus, "new");
    assert.ok(row.driveUrl?.startsWith("https://"));
    if (row.classSlug === "9") {
      assert.equal(row.driveUrl, CLASS_SOURCE_URLS["9"]);
      assert.notEqual(row.subjectTitle, "Pakistan Studies");
    }
    if (row.classSlug === "10") {
      assert.equal(row.driveUrl, CLASS_SOURCE_URLS["10"]);
      assert.notEqual(row.subjectTitle, "Islamiat");
    }
  }

  const pba = rows.filter((r) => r.paperType === "pba");
  assert.equal(pba.length, 1);
  assert.equal(pba[0].subjectTitle, "Chemistry");
  assert.equal(pba[0].year, "2026");

  const class9Years = new Set(class9.map((r) => `${r.year}:${r.paperType}`));
  for (const key of [
    "2027:paper-pattern",
    "2027:model",
    "2026:second-annual",
    "2026:first-annual",
    "2025:second-annual",
    "2025:first-annual",
    "2024:model",
  ]) {
    assert.ok(class9Years.has(key), `missing Class 9 session ${key}`);
  }
});

test("public past-papers API keeps Class 9/10 policy and never exposes Download without pdfUrl", async () => {
  const app = createApp();
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;

  const res = await fetch(`${base}/api/past-papers?board=fbise`);
  assert.equal(res.status, 200);
  const papers = (await res.json()) as {
    classSlug: string;
    subjectTitle: string;
    year: string;
    paperType: string;
    syllabus: string;
    pdfUrl: string | null;
    driveUrl: string | null;
  }[];

  assert.ok(papers.length >= FBISE_SOURCE_ROW_COUNT);

  let archiveOnly = 0;
  let hostedPdf = 0;
  for (const paper of papers) {
    if (paper.classSlug === "9") assert.notEqual(paper.subjectTitle, "Pakistan Studies");
    if (paper.classSlug === "10") assert.notEqual(paper.subjectTitle, "Islamiat");
    if (paper.classSlug === "9" || paper.classSlug === "10") {
      assert.notEqual(paper.syllabus, "old");
    }
    if (paper.pdfUrl) hostedPdf += 1;
    else if (paper.driveUrl) archiveOnly += 1;
  }

  // In demo/source inventory mode we expect archive-only rows, not invented PDFs.
  assert.ok(archiveOnly > 0);
  assert.equal(hostedPdf, 0, "demo inventory must not claim hosted exam PDFs");

  const chemPba = papers.find(
    (p) => p.classSlug === "10" && p.subjectTitle === "Chemistry" && p.paperType === "pba",
  );
  assert.ok(chemPba);
  assert.equal(chemPba.pdfUrl, null);

  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});
