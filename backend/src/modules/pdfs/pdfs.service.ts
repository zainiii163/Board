import { pdfStore } from "../../store/pdf-store.js";
import { isR2Enabled } from "../../storage/r2-storage.js";
import { ApiError } from "../../utils/api-error.js";

export async function listPdfs() {
  return pdfStore.list();
}

export function getStorageMode() {
  return pdfStore.storageMode();
}

export async function getPdf(id: string) {
  const pdf = await pdfStore.getById(id);
  if (!pdf) throw ApiError.notFound("PDF not found.");
  return pdf;
}

export async function savePdfUpload(filename: string, buffer: Buffer) {
  if (buffer.length > 10 * 1024 * 1024) {
    throw ApiError.badRequest("PDF must be under 10 MB.");
  }
  if (!filename.toLowerCase().endsWith(".pdf")) {
    throw ApiError.badRequest("Only PDF files are allowed.");
  }
  return pdfStore.saveUpload(filename, buffer);
}

export async function deletePdf(id: string) {
  const deleted = await pdfStore.remove(id);
  if (!deleted) throw ApiError.badRequest("Cannot delete demo PDFs or missing file.");
  return { deleted: true };
}

export function isUsingR2() {
  return isR2Enabled();
}
