import type { ContentStatus } from "@boardnotes/shared";

const chapterStatus = new Map<string, ContentStatus>();

export function chapterPublishKey(
  boardSlug: string,
  classSlug: string,
  subjectSlug: string,
  chapterSlug: string,
) {
  return `${boardSlug}/${classSlug}/${subjectSlug}/${chapterSlug}`;
}

export function getChapterPublishStatus(key: string): ContentStatus {
  return chapterStatus.get(key) ?? "published";
}

export function setChapterPublishStatus(key: string, status: ContentStatus) {
  chapterStatus.set(key, status);
}

export function deleteChapterPublishStatus(key: string) {
  chapterStatus.delete(key);
}

export function isChapterPublished(
  boardSlug: string,
  classSlug: string,
  subjectSlug: string,
  chapterSlug: string,
) {
  const key = chapterPublishKey(boardSlug, classSlug, subjectSlug, chapterSlug);
  return getChapterPublishStatus(key) === "published";
}

export function initChapterPublishStatus(
  boardSlug: string,
  classSlug: string,
  subjectSlug: string,
  chapterSlug: string,
  status: ContentStatus = "published",
) {
  const key = chapterPublishKey(boardSlug, classSlug, subjectSlug, chapterSlug);
  if (!chapterStatus.has(key)) chapterStatus.set(key, status);
}
