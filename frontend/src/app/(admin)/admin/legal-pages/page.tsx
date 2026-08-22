"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch, apiPut } from "@/lib/api-client";
import type { LegalPageData } from "@/components/content/legal-page-content";

const slugs = ["about", "privacy", "terms", "copyright", "educational-notice"] as const;

export default function ManageLegalPagesPage() {
  const [slug, setSlug] = useState<(typeof slugs)[number]>("about");
  const [titleEn, setTitleEn] = useState("");
  const [titleUr, setTitleUr] = useState("");
  const [bodyEn, setBodyEn] = useState("");
  const [bodyUr, setBodyUr] = useState("");
  const [cardsJson, setCardsJson] = useState("[]");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiAuthFetch<LegalPageData>(`/api/legal/${slug}`).then((page) => {
      setTitleEn(page.title.en);
      setTitleUr(page.title.ur);
      setBodyEn(page.paragraphs.en.join("\n"));
      setBodyUr(page.paragraphs.ur.join("\n"));
      setCardsJson(JSON.stringify(page.cards ?? [], null, 2));
    });
  }, [slug]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    await apiPut(`/api/legal/${slug}`, {
      title: { en: titleEn, ur: titleUr },
      paragraphs: {
        en: bodyEn.split("\n").filter(Boolean),
        ur: bodyUr.split("\n").filter(Boolean),
      },
      cards: slug === "about" ? JSON.parse(cardsJson) : undefined,
    });
    setSaved(true);
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Manage Legal Pages</h1>
      <p className="mt-2 text-muted">About, privacy, terms, copyright, and PDF educational notice.</p>

      <div className="mt-6 max-w-md">
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value as (typeof slugs)[number])}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
        >
          {slugs.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={save} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="font-semibold text-foreground">Title (English)</span>
            <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" />
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-foreground">Title (Urdu)</span>
            <input value={titleUr} onChange={(e) => setTitleUr(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" dir="rtl" />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="font-semibold text-foreground">Body (English, one paragraph per line)</span>
            <textarea value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} className="mt-1 min-h-32 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" />
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-foreground">Body (Urdu)</span>
            <textarea value={bodyUr} onChange={(e) => setBodyUr(e.target.value)} className="mt-1 min-h-32 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground" dir="rtl" />
          </label>
        </div>
        {slug === "about" && (
          <label className="block text-sm">
            <span className="font-semibold text-foreground">About cards (JSON)</span>
            <textarea value={cardsJson} onChange={(e) => setCardsJson(e.target.value)} className="mt-1 min-h-40 w-full rounded-xl border border-border px-3 py-2 font-mono text-xs" />
          </label>
        )}
        <div className="flex items-center gap-3">
          <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
            Save page
          </button>
          {saved && <span className="text-sm text-accent">Saved.</span>}
        </div>
      </form>
    </div>
  );
}
