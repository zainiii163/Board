const STATIC_CACHE = "boardnotes-static-v1";
const API_CACHE = "boardnotes-api-v1";
const PAGE_CACHE = "boardnotes-pages-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(["/icon.svg", "/manifest.webmanifest"])),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_OFFLINE" || !Array.isArray(event.data.urls)) return;
  event.waitUntil(
    caches.open(PAGE_CACHE).then(async (pageCache) => {
      const apiCache = await caches.open(API_CACHE);
      for (const url of event.data.urls) {
        try {
          const response = await fetch(url, { credentials: "same-origin" });
          if (!response.ok) continue;
          if (url.includes("/api/")) await apiCache.put(url, response.clone());
          else await pageCache.put(url, response.clone());
        } catch {
          // ignore individual cache failures
        }
      }
    }),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(event.request, API_CACHE));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request, PAGE_CACHE));
    return;
  }

  if (url.pathname.startsWith("/_next/static/") || url.pathname === "/icon.svg") {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
  }
});

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error("Offline and no cached response");
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}
