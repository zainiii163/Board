import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

import { apiFetchOrNull, getApiBaseUrl, pdfUrl } from "@/lib/api-client";
import { LocalizedBreadcrumbs } from "@/components/layout/localized-breadcrumbs";
import { CoverArt } from "@/components/portal/cover-art";
import { DownloadGate } from "@/components/content/download-gate";
import { PdfViewer } from "@/components/content/pdf-viewer";
import { DriveLinkButton } from "@/components/content/drive-link-button";
import { AdBanner } from "@/components/portal/ad-banner";
import { ACADEMIC_YEAR, boardDisplayTitle, boardShortName } from "@/lib/constants";
import { getBookCover } from "@/lib/book-covers";

export const dynamic = "force-dynamic";

type Book = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  classSlug: string;
  classTitle: string;
  subjectSlug: string | null;
  subjectTitle: string | null;
  title: string;
  priceLabel: string;
  coverUrl: string | null;
  pdfUrl: string | null;
  notesPath: string | null;
};

function prettifySubject(slug: string): string {
  return slug
    .split("-")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function resolveCover(book: Book | undefined, board: string, classNum: number, subjectTitle: string): string | null {
  if (book?.coverUrl) {
    if (book.coverUrl.startsWith("http")) return book.coverUrl;
    return `${getApiBaseUrl()}${book.coverUrl}`;
  }
  return getBookCover(board, classNum, subjectTitle);
}

type PageProps = {
  params: Promise<{ board: string; classSlug: string; subject: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { board, classSlug, subject } = await params;
  const books = await apiFetchOrNull<Book[]>(`/api/books?board=${board}&class=${classSlug}&subject=${subject}`);
  const book = books?.[0];
  const subjectTitle = book?.subjectTitle ?? prettifySubject(subject);
  const boardTitle = boardDisplayTitle(book?.boardTitle ?? "Board", board, parseInt(classSlug, 10) || 0);
  return {
    title: `${subjectTitle} Book - Class ${classSlug} | ${boardTitle} | BoardNotes`,
    description: `Download the official ${subjectTitle} textbook for Class ${classSlug} (${boardTitle}) — free PDF, read online or download.`,
    openGraph: {
      title: `${subjectTitle} Book - Class ${classSlug}`,
      description: `Free ${subjectTitle} textbook PDF for Class ${classSlug}, ${boardTitle}.`,
    },
  };
}

export default async function BookDetailPage({ params }: PageProps) {
  const { board, classSlug, subject } = await params;

  const books = await apiFetchOrNull<Book[]>(
    `/api/books?board=${board}&class=${classSlug}&subject=${subject}`,
  );
  const book = books?.[0];

  const classNum = parseInt(classSlug, 10) || 0;
  const subjectTitle = book?.subjectTitle ?? prettifySubject(subject);
  const boardTitle = boardDisplayTitle(book?.boardTitle ?? "Board", board, classNum);
  const short = boardShortName(board, classNum);
  const classTitle = book?.classTitle ?? `Class ${classSlug}`;
  const cover = resolveCover(book, board, classNum, subjectTitle);
  const fileUrl = book?.pdfUrl ?? null;
  const notesHref = book?.notesPath ?? `/${board}/${classSlug}/${subject}`;
  const isDrive = !!fileUrl && (fileUrl.includes("drive.google.com") || fileUrl.includes("docs.google.com"));

  if (!book && !cover) notFound();

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <LocalizedBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: `${boardTitle} Books`, href: `/${board}` },
            { label: classTitle, href: `/${board}/${classSlug}?view=books` },
            { label: subjectTitle },
          ]}
        />
      </div>

      {/* Header card */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="mx-auto w-56 overflow-hidden rounded-2xl border border-border shadow-lg lg:mx-0 lg:w-full">
            {cover ? (
              <Image
                src={cover}
                alt={`${subjectTitle} ${classSlug} book cover - ${boardTitle}`}
                width={280}
                height={373}
                className="h-auto w-full object-cover"
                priority
              />
            ) : (
              <CoverArt title={`${subjectTitle} ${classSlug}`} className="aspect-[3/4] h-full w-full" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">{boardTitle}</p>
            <h1 className="mt-2 font-serif text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              {subjectTitle} Book — {classTitle}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {book?.boardTitle ?? boardTitle} • {short} • {ACADEMIC_YEAR}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-card px-3 py-1 text-xs font-bold text-foreground ring-1 ring-border">
                {book?.priceLabel ?? "Free PDF"}
              </span>
              <span className="rounded-full bg-card px-3 py-1 text-xs font-bold text-foreground ring-1 ring-border">
                Textbook
              </span>
              <span className="rounded-full bg-card px-3 py-1 text-xs font-bold text-foreground ring-1 ring-border">
                {boardShortName(board, classNum)}
              </span>
            </div>

            {fileUrl ? (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <DownloadGate url={pdfUrl(fileUrl)} showAd={false} />
                <a
                  href="#pdf-reader"
                  className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 text-sm font-bold text-accent transition hover:bg-accent/20"
                >
                  Read Online
                </a>
                {isDrive && <DriveLinkButton href={fileUrl} label="Open in Google Drive" />}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-border bg-card/60 px-4 py-3 text-sm text-muted">
                PDF coming soon — meanwhile, chapter-wise notes are ready.
              </div>
            )}

            <div className="mt-4">
              <Link
                href={notesHref}
                className="text-sm font-bold text-accent transition hover:underline"
              >
                📝 Chapter-wise notes for {subjectTitle} {classSlug} →
              </Link>
            </div>

            {book && (
              <p className="mt-6 text-sm leading-relaxed text-muted">{book.title}</p>
            )}
          </div>
        </div>
      </section>

      {/* PDF reader */}
      {fileUrl && (
        <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
            <div id="pdf-reader">
              <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Read Online</h2>
              <PdfViewer url={fileUrl} title={`${subjectTitle} ${classTitle} Textbook`} />
            </div>
          </div>
        </section>
      )}

      {/* Ad — bottom only */}
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <AdBanner size="leaderboard" className="mx-auto" />
      </div>

      {/* SEO block */}
      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card/50 p-6">
          <h3 className="mb-3 text-lg font-bold text-foreground">
            {subjectTitle} Book {classSlug} — {boardTitle}
          </h3>
          <p className="mb-3 text-sm leading-6 text-muted">
            Get the official {subjectTitle} textbook for {classTitle} under {boardTitle}. Read the full book online
            or download the PDF for free — organized per class so you always land on the right book.
          </p>
          <p className="text-sm leading-6 text-muted">
            Pair it with chapter-wise notes, solved exercises, and MCQs for {subjectTitle} {classSlug} to prepare
            faster for exams in the {ACADEMIC_YEAR} session.
          </p>
        </div>
      </div>
    </div>
  );
}
