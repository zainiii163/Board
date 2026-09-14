"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch, apiDelete, apiUploadFile, pdfUrl } from "@/lib/api-client";

type PdfFile = {
  id: string;
  filename: string;
  url: string;
  size: string;
  uploadedAt: string;
  source: "demo" | "upload";
  storage?: "local" | "r2";
};

export default function ManageUploadsPage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [storageMode, setStorageMode] = useState<"local" | "r2">("local");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const [data, info] = await Promise.all([
      apiAuthFetch<PdfFile[]>("/api/pdfs"),
      apiAuthFetch<{ mode: "local" | "r2" }>("/api/pdfs/storage/info"),
    ]);
    setFiles(data);
    setStorageMode(info.mode);
  }

  useEffect(() => {
    Promise.all([
      apiAuthFetch<PdfFile[]>("/api/pdfs"),
      apiAuthFetch<{ mode: "local" | "r2" }>("/api/pdfs/storage/info"),
    ])
      .then(([data, info]) => {
        setFiles(data);
        setStorageMode(info.mode);
      })
      .catch(() => setFiles([]));
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      await apiUploadFile("/api/pdfs/upload", file);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(id: string, source: string) {
    if (source === "demo") return;
    if (!confirm(`Delete ${id}?`)) return;
    await apiDelete(`/api/pdfs/${id}`);
    await load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Manage Uploads</h1>
      <p className="mt-2 text-muted">
        Upload PDFs for exercises and questions. Max 10 MB, PDF only. Storage:{" "}
        <span className="font-semibold text-accent">{storageMode === "r2" ? "Cloudflare R2" : "Local disk"}</span>.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5">
        <label className="block text-sm font-semibold text-foreground">Upload PDF</label>
        <input
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleUpload}
          disabled={uploading}
          className="mt-2 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
        {uploading && <p className="mt-2 text-sm text-muted">Uploading…</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <p className="mt-4 text-xs text-muted">
          After upload, set the filename in Admin → Questions → PDF filename field (e.g.{" "}
          <code className="rounded bg-background px-1">my-notes.pdf</code>).
        </p>
      </div>

      <div className="mt-8 space-y-2">
        {files.map((file) => (
          <div key={file.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <div>
              <p className="font-semibold text-foreground">{file.filename}</p>
              <p className="text-xs text-muted">
                {file.size} • {file.source} • {file.storage ?? "local"} • {new Date(file.uploadedAt).toLocaleString()}
              </p>
              <a
                href={pdfUrl(file.url)}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-accent hover:underline"
              >
                Preview
              </a>
            </div>
            {file.source === "upload" ? (
              <button
                type="button"
                onClick={() => handleDelete(file.id, file.source)}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Delete
              </button>
            ) : (
              <span className="text-xs text-muted">Demo file</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
