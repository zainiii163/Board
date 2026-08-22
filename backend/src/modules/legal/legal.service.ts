import { eq } from "drizzle-orm";

import { legalStore, type LegalPageRecord, type LegalPageSlug } from "../../store/legal-store.js";
import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { ApiError } from "../../utils/api-error.js";

const slugs: LegalPageSlug[] = ["about", "privacy", "terms", "copyright", "educational-notice"];

function mapLegalPage(slug: LegalPageSlug, content: Record<string, unknown>): LegalPageRecord {
  return { slug, ...content } as LegalPageRecord;
}

export async function listLegalPages() {
  if (useDb()) {
    const rows = await db.query.legalPages.findMany();
    return rows.map((row) => {
      const content = row.content as Omit<LegalPageRecord, "slug">;
      return { slug: row.slug as LegalPageSlug, title: content.title };
    });
  }
  return legalStore.list();
}

export async function getLegalPage(slug: string): Promise<LegalPageRecord> {
  if (!slugs.includes(slug as LegalPageSlug)) throw ApiError.notFound("Legal page not found.");
  if (useDb()) {
    const row = await db.query.legalPages.findFirst({
      where: eq(schema.legalPages.slug, slug),
    });
    if (!row) throw ApiError.notFound("Legal page not found.");
    return mapLegalPage(slug as LegalPageSlug, row.content);
  }
  const page = legalStore.get(slug as LegalPageSlug);
  if (!page) throw ApiError.notFound("Legal page not found.");
  return page;
}

export async function updateLegalPage(slug: string, input: Partial<Omit<LegalPageRecord, "slug">>) {
  if (!slugs.includes(slug as LegalPageSlug)) throw ApiError.notFound("Legal page not found.");
  if (useDb()) {
    const existing = await db.query.legalPages.findFirst({
      where: eq(schema.legalPages.slug, slug),
    });
    if (!existing) throw ApiError.notFound("Legal page not found.");
    const merged = { ...existing.content, ...input };
    const [row] = await db
      .update(schema.legalPages)
      .set({ content: merged })
      .where(eq(schema.legalPages.slug, slug))
      .returning();
    return mapLegalPage(slug as LegalPageSlug, row.content);
  }
  const updated = legalStore.update(slug as LegalPageSlug, input);
  if (!updated) throw ApiError.notFound("Legal page not found.");
  return updated;
}
