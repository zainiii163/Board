export type OfflineChapterRecord = {
  path: string;
  title: string;
  subjectLabel: string;
  savedAt: string;
  apiUrl: string;
  payload: unknown;
};

const INDEX_KEY = "boardnotes_offline_index";

function storageKey(path: string) {
  return `boardnotes_offline_${path}`;
}

export function listOfflineChapterPaths(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(INDEX_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function listOfflineChapters(): OfflineChapterRecord[] {
  return listOfflineChapterPaths()
    .map((path) => {
      try {
        const raw = localStorage.getItem(storageKey(path));
        return raw ? (JSON.parse(raw) as OfflineChapterRecord) : null;
      } catch {
        return null;
      }
    })
    .filter((entry): entry is OfflineChapterRecord => entry !== null)
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function isChapterSavedOffline(path: string) {
  return listOfflineChapterPaths().includes(path);
}

export function saveOfflineChapter(record: OfflineChapterRecord) {
  localStorage.setItem(storageKey(record.path), JSON.stringify(record));
  const paths = listOfflineChapterPaths();
  if (!paths.includes(record.path)) {
    localStorage.setItem(INDEX_KEY, JSON.stringify([record.path, ...paths]));
  }
}

export function removeOfflineChapter(path: string) {
  localStorage.removeItem(storageKey(path));
  localStorage.setItem(
    INDEX_KEY,
    JSON.stringify(listOfflineChapterPaths().filter((entry) => entry !== path)),
  );
}

export async function cacheUrlsForOffline(urls: string[]) {
  if (!("serviceWorker" in navigator)) return;
  const registration = await navigator.serviceWorker.ready;
  registration.active?.postMessage({ type: "CACHE_OFFLINE", urls });
}
