import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { env } from "../config/env.js";
import { isR2Enabled, r2DeletePdf, r2ListUploads, r2PublicUrl, r2PutPdf } from "../storage/r2-storage.js";

export type StoredPdf = {
  id: string;
  filename: string;
  url: string;
  size: string;
  uploadedAt: string;
  source: "demo" | "upload";
  storage?: "local" | "r2";
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const UPLOAD_DIR = path.join(PUBLIC_DIR, "uploads");
const DEMO_DIR = path.join(PUBLIC_DIR, "demo-pdfs");

const demoFiles = [
  "fbise-9-math-ch1-ex1-1.pdf",
  "fbise-9-math-ch1-ex1-1-q4.pdf",
  "fbise-9-math-ch1-ex1-1-q5.pdf",
  "fbise-9-math-ch1-ex1-1-q6.pdf",
  "fbise-9-math-ch1-ex1-1-q7.pdf",
  "fbise-9-math-ch3-ex3-1.pdf",
  "fbise-9-math-ch3-ex3-2.pdf",
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function resolvePublicUrl(relativePath: string) {
  if (relativePath.startsWith("http")) return relativePath;
  return env.publicApiUrl ? `${env.publicApiUrl}${relativePath}` : relativePath;
}

function uploadPublicUrl(filename: string) {
  const direct = r2PublicUrl(filename);
  if (direct) return direct;
  return resolvePublicUrl(`/uploads/${filename}`);
}

function sanitizeFilename(filename: string) {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  return safeName.endsWith(".pdf") ? safeName : `${safeName}.pdf`;
}

function buildDemoPdf(filename: string): StoredPdf {
  const filePath = path.join(DEMO_DIR, filename);
  let size = "—";
  try {
    const stat = fs.statSync(filePath);
    size = formatSize(stat.size);
  } catch {
    size = "1.2 MB";
  }
  return {
    id: filename,
    filename,
    url: resolvePublicUrl(`/demo-pdfs/${filename}`),
    size,
    uploadedAt: new Date().toISOString(),
    source: "demo",
    storage: "local",
  };
}

function listLocalUploads(): StoredPdf[] {
  ensureUploadDir();
  return fs
    .readdirSync(UPLOAD_DIR)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .map((filename) => {
      const stat = fs.statSync(path.join(UPLOAD_DIR, filename));
      return {
        id: filename,
        filename,
        url: uploadPublicUrl(filename),
        size: formatSize(stat.size),
        uploadedAt: stat.mtime.toISOString(),
        source: "upload" as const,
        storage: "local" as const,
      };
    });
}

async function listR2UploadRecords(): Promise<StoredPdf[]> {
  const objects = await r2ListUploads();
  return objects.map((item) => ({
    id: item.filename,
    filename: item.filename,
    url: uploadPublicUrl(item.filename),
    size: formatSize(item.size),
    uploadedAt: item.uploadedAt,
    source: "upload" as const,
    storage: "r2" as const,
  }));
}

function saveLocalUpload(filename: string, buffer: Buffer): StoredPdf {
  ensureUploadDir();
  const finalName = sanitizeFilename(filename);
  const target = path.join(UPLOAD_DIR, finalName);
  let savedName = finalName;
  if (fs.existsSync(target)) {
    savedName = `${finalName.replace(/\.pdf$/i, "")}-${Date.now()}.pdf`;
  }
  fs.writeFileSync(path.join(UPLOAD_DIR, savedName), buffer);
  const stat = fs.statSync(path.join(UPLOAD_DIR, savedName));
  return {
    id: savedName,
    filename: savedName,
    url: uploadPublicUrl(savedName),
    size: formatSize(stat.size),
    uploadedAt: stat.mtime.toISOString(),
    source: "upload",
    storage: "local",
  };
}

async function saveR2Upload(filename: string, buffer: Buffer): Promise<StoredPdf> {
  let finalName = sanitizeFilename(filename);
  const existing = await r2ListUploads();
  if (existing.some((item) => item.filename === finalName)) {
    finalName = `${finalName.replace(/\.pdf$/i, "")}-${Date.now()}.pdf`;
  }
  await r2PutPdf(finalName, buffer);
  return {
    id: finalName,
    filename: finalName,
    url: uploadPublicUrl(finalName),
    size: formatSize(buffer.length),
    uploadedAt: new Date().toISOString(),
    source: "upload",
    storage: "r2",
  };
}

export const pdfStore = {
  storageMode: () => (isR2Enabled() ? "r2" : "local"),

  list: async (): Promise<StoredPdf[]> => {
    const demo = demoFiles.map(buildDemoPdf);
    const uploaded = isR2Enabled() ? await listR2UploadRecords() : listLocalUploads();
    return [...uploaded, ...demo].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  },

  getById: async (id: string): Promise<StoredPdf | null> => {
    const items = await pdfStore.list();
    return items.find((p) => p.id === id) ?? null;
  },

  saveUpload: async (filename: string, buffer: Buffer): Promise<StoredPdf> => {
    if (isR2Enabled()) return saveR2Upload(filename, buffer);
    return saveLocalUpload(filename, buffer);
  },

  remove: async (id: string): Promise<boolean> => {
    if (demoFiles.includes(id)) return false;
    if (isR2Enabled()) {
      const objects = await r2ListUploads();
      if (!objects.some((item) => item.filename === id)) return false;
      await r2DeletePdf(id);
      return true;
    }
    ensureUploadDir();
    const target = path.join(UPLOAD_DIR, id);
    if (!fs.existsSync(target)) return false;
    fs.unlinkSync(target);
    return true;
  },
};

export async function readUploadBuffer(filename: string) {
  if (isR2Enabled()) {
    const { r2GetPdfBuffer } = await import("../storage/r2-storage.js");
    return r2GetPdfBuffer(filename);
  }
  ensureUploadDir();
  return fs.readFileSync(path.join(UPLOAD_DIR, filename));
}

/** Resolve a PDF from demo files, local uploads, or R2. */
export async function readPdfBuffer(filename: string): Promise<Buffer | null> {
  const safe = path.basename(filename);
  if (!safe.toLowerCase().endsWith(".pdf")) return null;

  const demoPath = path.join(DEMO_DIR, safe);
  if (fs.existsSync(demoPath)) {
    return fs.readFileSync(demoPath);
  }

  try {
    if (isR2Enabled()) {
      return await readUploadBuffer(safe);
    }
    ensureUploadDir();
    const uploadPath = path.join(UPLOAD_DIR, safe);
    if (!fs.existsSync(uploadPath)) return null;
    return fs.readFileSync(uploadPath);
  } catch {
    return null;
  }
}

export function uploadExistsLocally(filename: string) {
  ensureUploadDir();
  return fs.existsSync(path.join(UPLOAD_DIR, filename));
}
