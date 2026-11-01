import assert from "node:assert/strict";
import { test } from "node:test";

import {
  isBooksNotesAllowedBoard,
  isBooksNotesPublicResource,
  isPastPaperTypeTitle,
} from "./utils/books-notes-filter.js";

test("Books & Notes allowlist accepts Federal and Punjab board names", () => {
  assert.equal(isBooksNotesAllowedBoard("Federal Board"), true);
  assert.equal(isBooksNotesAllowedBoard("Federal Board (FBISE)"), true);
  assert.equal(isBooksNotesAllowedBoard("Punjab Board"), true);
  assert.equal(isBooksNotesAllowedBoard("National Book Foundation (NBF)"), true);
});

test("Books & Notes allowlist rejects Oxford, Sindh, Cambridge, AQA", () => {
  assert.equal(isBooksNotesAllowedBoard("Oxford"), false);
  assert.equal(isBooksNotesAllowedBoard("Sindh Board"), false);
  assert.equal(isBooksNotesAllowedBoard("Cambridge International"), false);
  assert.equal(isBooksNotesAllowedBoard("AQA"), false);
  assert.equal(isBooksNotesAllowedBoard(null), false);
});

test("past-paper titles are detected", () => {
  assert.equal(isPastPaperTypeTitle("Class 10 - Physics Past Paper 2025 (Annual) - Sindh Board"), true);
  assert.equal(isPastPaperTypeTitle("Class 10 - Biology - Punjab Board"), false);
});

test("public Books & Notes resource filter keeps Federal notes and drops excluded cards", () => {
  assert.equal(
    isBooksNotesPublicResource({
      board: "Federal Board",
      title: "Class 12 - Physics Notes - Federal Board",
      categoryTrailSlugs: ["notes", "federal-board-notes"],
    }),
    true,
  );
  assert.equal(
    isBooksNotesPublicResource({
      board: "Punjab Board",
      title: "Class 10 - Biology - Punjab Board",
      categoryTrailSlugs: ["textbooks", "punjab-text-books"],
    }),
    true,
  );
  assert.equal(
    isBooksNotesPublicResource({
      board: "Oxford",
      title: "Class 11 - Biology Notes - Oxford",
      categoryTrailSlugs: ["notes", "oxford-notes"],
    }),
    false,
  );
  assert.equal(
    isBooksNotesPublicResource({
      board: "Sindh Board",
      title: "Class 10 - Physics Past Paper 2025 (Annual) - Sindh Board",
      categoryTrailSlugs: ["model-papers", "10th-class-model-papers"],
    }),
    false,
  );
  assert.equal(
    isBooksNotesPublicResource({
      board: "Federal Board",
      title: "Class 10 Physics Past Paper 2025",
      categoryTrailSlugs: ["notes", "federal-board-notes"],
    }),
    false,
  );
});
