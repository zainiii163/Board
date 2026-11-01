function serverApiBase() {
  // Vercel multi-service binding (runtime). Do not use NEXT_PUBLIC_* for this —
  // bindings are not available at build time.
  const fromBinding = process.env.BACKEND_URL?.replace(/\/$/, "");
  if (fromBinding) return fromBinding;
  return (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
}

// Browser: same-origin `/api/...` (Vercel routes `/api` → backend service).
// Server: call backend directly via BACKEND_URL binding (or local NEXT_PUBLIC_API_URL).
function apiBase() {
  return typeof window === "undefined" ? serverApiBase() : "";
}

export function getApiBaseUrl() {
  // Asset URLs stay relative so SSR/client markup matches and Vercel edge
  // rewrites can send /uploads, /demo-pdfs, /book-covers to the backend.
  return "";
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("boardnotes_token");
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("boardnotes_token", token);
  else localStorage.removeItem("boardnotes_token");
}

export function getAuthToken() {
  return getToken();
}

async function parseResponse<T>(res: Response, path: string): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = typeof data.error === "string" ? data.error : `API ${res.status}: ${path}`;
    throw new Error(message);
  }
  return data as T;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    next: init?.method ? undefined : { revalidate: 60 },
  });
  return parseResponse<T>(res, path);
}

export async function apiFetchOrNull<T>(path: string): Promise<T | null> {
  try {
    return await apiFetch<T>(path);
  } catch {
    return null;
  }
}

export async function apiAuthFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  return parseResponse<T>(res, path);
}

export async function apiAuthFetchWithQuery<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  return apiAuthFetch<T>(`${path}?${qs}`);
}

export async function apiPost<T>(path: string, body: unknown, auth = false): Promise<T> {
  const fetcher = auth ? apiAuthFetch : apiFetch;
  return fetcher<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return apiAuthFetch<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  return apiAuthFetch<T>(path, { method: "PUT", body: JSON.stringify(body) });
}

export async function apiDelete<T>(path: string): Promise<T> {
  return apiAuthFetch<T>(path, { method: "DELETE" });
}

export async function apiUploadFile<T>(path: string, file: File): Promise<T> {
  const token = getToken();
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${apiBase()}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  return parseResponse<T>(res, path);
}

export function pdfUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${getApiBaseUrl()}${path}`;
}
