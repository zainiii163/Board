"use client";

import Link from "next/link";

import { PageHeading } from "@/components/layout/page-heading";
import { useLocale } from "@/lib/locale-context";
import { pdfUrl } from "@/lib/api-client";
import { boardDisplayTitle } from "@/lib/constants";
import { DownloadGate } from "@/components/content/download-gate";

export type BookItem = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  classSlug: string;
  classTitle: string;
  title: string;
  priceLabel: string;
  pdfUrl: string | null;
  notesPath: string | null;
};

export function BooksList({ books }: { books: BookItem[] }) {
  const { tr } = useLocale();

  return (
    <>
      <PageHeading titleKey="books" subtitleKey="booksSubtitle" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {books.map((book) => {
          const classNum = parseInt(book.classSlug, 10) || 0;
          const boardLabel = boardDisplayTitle(book.boardTitle, book.boardSlug, classNum);
          return (
            <div key={book.id} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{boardLabel}</p>
              <h2 className="mt-2 text-xl font-bold text-foreground">{book.title}</h2>
              <p className="mt-2 text-sm text-muted">{book.classTitle}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-md bg-accent px-2 py-1 text-xs font-bold text-white underline">
                  {book.priceLabel}
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {book.pdfUrl && (
                    <DownloadGate url={pdfUrl(book.pdfUrl)} label={tr("downloadPdf")} compact />
                  )}
                  {book.notesPath && (
                    <Link
                      href={book.notesPath}
                      className="rounded-md border-2 border-accent/40 px-2 py-1 text-sm font-semibold text-accent underline transition hover:bg-accent hover:text-white"
                    >
                      {tr("viewNotes")}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
