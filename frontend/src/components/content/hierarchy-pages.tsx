"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { LocalizedBreadcrumbs } from "@/components/layout/localized-breadcrumbs";
import { BookOpen, GraduationCap, NotebookPen, School } from "lucide-react";
import { ChapterQuiz } from "@/components/content/chapter-quiz";
import { BookmarkButton } from "@/components/content/bookmark-button";
import { SaveOfflineButton } from "@/components/content/save-offline-button";
import { ChapterFlashcards, type Flashcard } from "@/components/content/chapter-flashcards";
import { ChapterVideo } from "@/components/content/chapter-video";
import { ChapterZipDownload } from "@/components/content/chapter-zip-download";
import { ProgressTracker } from "@/components/content/progress-tracker";
import { SubjectFaq } from "@/components/content/subject-faq";
import { MathText } from "@/components/content/math-text";
import { PdfSection } from "@/components/content/pdf-section";
import { DownloadGate } from "@/components/content/download-gate";
import { DriveLinkButton } from "@/components/content/drive-link-button";
import { PastPapersList, type PastPaperItem } from "@/components/content/past-papers-list";
import { AdBanner } from "@/components/portal/ad-banner";
import { CoverArt } from "@/components/portal/cover-art";
import { useLocale } from "@/lib/locale-context";
import { pickLocalized, pickLocalizedList } from "@/lib/i18n";
import {
  ACADEMIC_YEAR,
  APSACS_CLASSES,
  NAV_CLASSES,
  boardDisplayTitle,
  boardShortName,
  boardTextbookCategory,
  classLabel,
  classLabelFromSlug,
  parseClassNumber,
  sortClasses,
  sortSubjects,
} from "@/lib/constants";
import { getBookCover } from "@/lib/book-covers";

type BoardSubject = { slug: string; title: string };
type BoardClass = { slug: string; title: string; subjects?: BoardSubject[] };

type BoardPageContentProps = {
  board: string;
  title: string;
  classes: BoardClass[];
  pastPapers?: PastPaperItem[];
};

export function BoardPageContent({ board, title, classes, pastPapers = [] }: BoardPageContentProps) {
  const { tr } = useLocale();
  const displayTitle = boardDisplayTitle(title, board);
  const [view, setView] = useState<"notes" | "books">("notes");

  const seen = new Set<string>();
  const uniqueClasses = sortClasses(
    classes.filter((c) => {
      if (seen.has(c.slug)) return false;
      seen.add(c.slug);
      return true;
    }),
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
      {/* The H1 is the board name and the navbar already shows it as the active
          menu, so there is no eyebrow or repeated board label above it. */}
      <h1 className="text-3xl font-black text-foreground sm:text-4xl">{displayTitle}</h1>
      <p className="mt-1.5 text-sm text-muted">{tr("chooseClassContinue")}</p>

      {/* Notes | Books */}
      <div className="mt-5 inline-flex rounded-full border border-border bg-card p-1" role="tablist" aria-label="View mode">
        <button
          type="button"
          role="tab"
          aria-selected={view === "notes"}
          onClick={() => setView("notes")}
          className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold transition ${view === "notes" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-foreground"}`}
        >
          <NotebookPen className="h-4 w-4" aria-hidden="true" /> {tr("notes")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "books"}
          onClick={() => setView("books")}
          className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold transition ${view === "books" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-foreground"}`}
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" /> {tr("books")}
        </button>
      </div>

      {uniqueClasses.length === 0 ? (
        <p className="mt-8 text-sm text-muted">{tr("noClassesYet")}</p>
      ) : (
        <>
          {/* ─── Class Sections ─── */}
          {uniqueClasses.map((klass) => {
            const num = parseClassNumber(klass.slug);
            const short = boardShortName(board, num);
            const subjects = sortSubjects(klass.subjects ?? []);
            // In primary/middle grades science is taught as General Science, so the
            // separate Physics/Chemistry/Biology cards are only hidden when that
            // combined subject actually exists for the class.
            const hasGeneralScience = subjects.some((s) => /general science/i.test(s.title));
            const displaySubjects = subjects.filter((subject) => {
              if (num >= 5 && num <= 8 && hasGeneralScience) {
                const title = subject.title.toLowerCase();
                if (title.includes("physics") || title.includes("chemistry") || title.includes("biology")) {
                  return false;
                }
              }
              return true;
            });
            return (
              <div key={klass.slug} id={`class-${klass.slug}`} className="mt-10 scroll-mt-24">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
<h2 className="text-xl font-black text-foreground sm:text-2xl">
                      {(() => {
                        const label = classLabel(num);
                        return label || `Class ${classLabelFromSlug(klass.slug)}`;
                      })()}{" "}
                      <span className="text-accent">({short})</span>
                    </h2>
                    <p className="mt-1 text-sm text-muted">{view === "notes" ? "Chapter-wise notes, SLO-based solutions, and exercises." : "Official textbooks — read online or download PDF."}</p>
                  </div>
                  <Link
                    href={`/${board}/${klass.slug}${view === "books" ? "?view=books" : ""}`}
                    className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-bold text-accent transition hover:bg-accent hover:text-white"
                  >
                    View All →
                  </Link>
                </div>
                {displaySubjects.length === 0 ? (
                  <p className="mt-4 text-sm text-muted">{tr("noSubjectsYet")}</p>
                ) : (
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-thin snap-x-mandatory">
                    {displaySubjects.slice(0, 6).map((subject) => {
                      const cover = getBookCover(board, num, subject.title);
                      const href = view === "books"
                        ? `/${board}/books/${klass.slug}/${subject.slug}`
                        : `/${board}/${klass.slug}/${subject.slug}`;
                      return (
                        <Link
                          key={`${klass.slug}-${subject.slug}`}
                          href={href}
                          className="group shrink-0"
                        >
                          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                            {cover ? (
                              <Image
                                src={cover}
alt={`${classLabelFromSlug(klass.slug)} ${subject.title}`}
                                width={160}
                                height={208}
                                className="aspect-[3/4] w-full object-cover"
                              />
                            ) : (
                              <CoverArt title={`${classLabelFromSlug(klass.slug)} ${subject.title}`} className="aspect-[3/4] w-full" />
                            )}
                          </div>
                          <p className="mt-2 text-center text-xs font-semibold text-foreground group-hover:text-accent">
{subject.title}
                          </p>
                        </Link>
                      );
                    })}
                    {displaySubjects.length > 6 && (
                      <Link
                        href={`/${board}/${klass.slug}${view === "books" ? "?view=books" : ""}`}
                        className="group flex shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 transition hover:border-accent hover:bg-accent/10"
                      >
                        <span className="text-sm font-semibold text-muted group-hover:text-accent">
                          +{displaySubjects.length - 6} more
                        </span>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* Past papers — Drive-linked board exam papers */}
      <div className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Exam Prep</p>
            <h2 className="mt-1 text-2xl font-black text-foreground">Past Papers — {displayTitle}</h2>
            <p className="mt-1 text-sm text-muted">Model papers, 1st &amp; 2nd annual, and PBAs with Drive links.</p>
          </div>
          <Link
            href="/past-papers"
            className="inline-flex items-center gap-2 rounded-md border-2 border-accent px-3 py-1.5 text-sm font-semibold text-foreground underline transition hover:bg-accent hover:text-white"
          >
            Browse all past papers →
          </Link>
        </div>
        <div className="mt-4">
          <PastPapersList papers={pastPapers} hideHeading />
        </div>
      </div>

      {/* SEO Content Block */}
      <div className="mt-12 rounded-2xl border border-border bg-card/50 p-6">
        <h3 className="mb-3 text-lg font-bold text-foreground">
          {displayTitle} Books and Notes — Complete Study Material
        </h3>
        <p className="mb-3 text-sm leading-6 text-muted">
          Access comprehensive study materials for {displayTitle}, including textbooks, chapter-wise notes, past papers,
          and solved exercises. Choose a class above to jump straight to its Notes or Books section — every class
          page is bookmarkable for quick access during study sessions.
        </p>
        <p className="mb-3 text-sm leading-6 text-muted">
          Find subject-specific guides for Mathematics, Physics, Chemistry, Biology, English, Urdu, and Computer
          Science. Each subject includes SLO-based chapter notes, solved exercises, MCQs, and downloadable PDFs
          aligned with the latest curriculum standards.
        </p>
        <p className="text-sm leading-6 text-muted">
          All study materials follow the {displayTitle} curriculum guidelines for the {ACADEMIC_YEAR} session, making them
          ideal for classroom learning, homework assistance, and exam preparation.
        </p>
      </div>

      {/* Ad — bottom only */}
      <div className="mt-8">
        <AdBanner size="leaderboard" className="mx-auto" />
      </div>
    </section>
  );
}

type ClassPageContentProps = {
  board: string;
  classSlug: string;
  boardTitle: string;
  classTitle: string;
  subjects: { slug: string; title: string }[];
  initialView?: "notes" | "books" | "past-papers";
  pastPapers?: PastPaperItem[];
};

export function ClassPageContent({
  board,
  classSlug,
  boardTitle,
  classTitle,
  subjects,
  initialView = "notes",
  pastPapers = [],
}: ClassPageContentProps) {
  const { tr } = useLocale();
  const [view, setView] = useState<"notes" | "books">(initialView === "books" ? "books" : "notes");
  const classNum = parseClassNumber(classSlug);
  const short = boardShortName(board, classNum);
  const displayTitle = boardDisplayTitle(boardTitle, board, classNum);
  const booksCategory = boardTextbookCategory(board);

/**
   * The server re-renders this component for every `/board/class` navigation, but
   * React keeps the state of a component mounted across the same route segment.
   * Without this reset the Notes/Books tab stayed on the previous class's choice,
   * which is what made switching classes feel broken. Adjusting during render
   * (the documented "reset state on prop change" pattern) avoids the stale frame.
   */
  const routeKey = `${board}/${classSlug}`;
  const [lastRouteKey, setLastRouteKey] = useState(routeKey);
  if (routeKey !== lastRouteKey) {
    setLastRouteKey(routeKey);
    setView(initialView === "books" ? "books" : "notes");
  }

  // Uniform subject order, plus grade-wise curriculum mapping: in primary and
  // middle grades the separate science subjects are dropped when the class
  // actually carries a combined General Science subject.
  const hasGeneralScience = subjects.some((s) => /general science/i.test(s.title));
  const filteredSubjects = sortSubjects(subjects).filter((subject) => {
    if (classNum >= 5 && classNum <= 8 && hasGeneralScience) {
      const title = subject.title.toLowerCase();
      if (title.includes("physics") || title.includes("chemistry") || title.includes("biology")) {
        return false;
      }
    }
    return true;
  });

  // `?view=past-papers` is a deep link: land on the dedicated past papers section
  // instead of dropping the visitor at the top of the subject list.
  useEffect(() => {
    if (initialView !== "past-papers") return;
    document.getElementById("past-papers")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [initialView]);

  const tabClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold transition ${
      active ? "bg-accent text-white shadow-sm" : "text-muted hover:text-foreground"
    }`;

  function selectView(next: "notes" | "books") {
    setView(next);
    const url = new URL(window.location.href);
    if (next === "notes") url.searchParams.delete("view");
    else url.searchParams.set("view", next);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  const classSlugs = (board === "apsacs" ? APSACS_CLASSES : NAV_CLASSES).map((n) =>
    board === "apsacs" ? `class-${n}` : String(n),
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
      {/* Compact header — no stacked board/banner chips, subjects sit right below */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{displayTitle}</p>
          <h1 className="mt-1 text-3xl font-black text-foreground sm:text-4xl">{classTitle}</h1>
          {/* Board name already sits above as the eyebrow and in the navbar, so the
              helper line stays generic instead of repeating it back to back. */}
          <p className="mt-1.5 max-w-xl text-sm text-muted">
            {tr("chooseSubjectContinue").replace("{board} ", "")}
          </p>
        </div>
        <BookmarkButton title={`${classTitle} · ${displayTitle}`} path={`/${board}/${classSlug}`} />
      </div>

      {/* Sticky class switcher — jump between classes without going back a page */}
      <nav
        className="scrollbar-none sticky top-16 z-20 -mx-4 mt-5 flex gap-2 overflow-x-auto border-b border-border/50 bg-background/85 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        aria-label="Switch class"
      >
        {classSlugs.map((slug) => {
          const active = slug === classSlug;
          return (
            <Link
              key={slug}
              href={`/${board}/${slug}${view === "books" ? "?view=books" : ""}`}
              scroll={false}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                active
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-card text-foreground hover:border-accent hover:text-accent"
              }`}
            >
              {(() => {
                const label = classLabel(parseClassNumber(slug));
                return label || `Class ${slug.replace(/^class-/i, "")}`;
              })()}
            </Link>
          );
        })}
      </nav>

      {/* Notes / Books toggle — past papers live in their own section further down */}
      <div className="mt-5 inline-flex rounded-full border border-border bg-card p-1" role="tablist" aria-label="View mode">
        <button
          type="button"
          role="tab"
          aria-selected={view === "notes"}
          onClick={() => selectView("notes")}
          className={tabClass(view === "notes")}
        >
          <NotebookPen className="h-4 w-4" aria-hidden="true" /> {tr("notes")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "books"}
          onClick={() => selectView("books")}
          className={tabClass(view === "books")}
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" /> {tr("books")}
        </button>
      </div>

      {view === "notes" ? (
        <>
          <p className="mt-4 text-sm text-muted">Chapter-wise notes, SLO-based solutions, and solved exercises.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredSubjects.length === 0 ? (
              <p className="text-sm text-muted md:col-span-2 xl:col-span-3">{tr("noSubjectsYet")}</p>
            ) : (
              filteredSubjects.map((subject) => {
                const cover = getBookCover(board, classNum, subject.title);
                return (
                  <Link
                    key={subject.slug}
                    href={`/${board}/${classSlug}/${subject.slug}`}
                    className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md animate-fade-in-up"
                  >
                    <span className="mb-3 flex h-16 w-11 items-center justify-center overflow-hidden rounded-md border border-border bg-accent/10 shadow-sm transition group-hover:border-accent/40">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={`${subject.title} book cover`}
                          width={44}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <BookOpen className="h-5 w-5 text-accent" aria-hidden="true" />
                      )}
                    </span>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{tr("subjectLabel")}</p>
                    <h2 className="mt-1 text-lg font-black text-foreground transition-colors group-hover:text-accent">{subject.title}</h2>
                    <p className="mt-1 text-sm text-muted">{tr("openChaptersNotes")}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[10px] font-bold text-muted">
                        {ACADEMIC_YEAR}
                      </span>
                      <span className="text-xs font-semibold text-accent">Click More →</span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </>
      ) : (
        <>
          <p className="mt-4 text-sm text-muted">Official {short} textbooks — read online or download PDF.</p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredSubjects.length === 0 ? (
              <p className="text-sm text-muted col-span-full">No books listed yet.</p>
            ) : (
              filteredSubjects.map((subject) => {
                const cover = getBookCover(board, classNum, subject.title);
                const label = `${classLabelFromSlug(classSlug)} ${subject.title}`;
                return (
                  <Link
                    key={`bk-${subject.slug}`}
                    href={`/${board}/books/${classSlug}/${subject.slug}`}
                    className="group relative block overflow-hidden rounded-md border border-border shadow-sm transition hover:grayscale-[60%]"
                  >
                    {cover ? (
                      <Image
                        src={cover}
                        alt={`${classTitle} ${subject.title}`}
                        width={200}
                        height={300}
                        className="aspect-[2/3] w-full object-cover"
                      />
                    ) : (
                      <CoverArt title={`${classTitle} ${subject.title}`} className="aspect-[2/3] w-full" />
                    )}
                    <p className="absolute inset-x-0 bottom-0 bg-accent p-1 text-center text-xs font-bold text-white underline">
                      {label}
                    </p>
                  </Link>
                );
              })
            )}
          </div>
          <div className="mt-6">
            <Link
              href={`/categories/${booksCategory}`}
              className="inline-flex items-center gap-2 rounded-md border-2 border-accent px-3 py-1.5 text-sm font-semibold text-foreground underline transition hover:bg-accent hover:text-white"
            >
              Browse all {classTitle} books →
            </Link>
          </div>
        </>
      )}

      {/* Past papers — its own section, never mixed into the notes/books tabs */}
      <div id="past-papers" className="mt-12 scroll-mt-32">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Exam Prep</p>
            <h2 className="mt-1 text-xl font-black text-foreground sm:text-2xl">
              Past Papers — {classTitle}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Model papers, 1st &amp; 2nd annual, and PBAs — filter by type and open from Google Drive.
            </p>
          </div>
          <Link
            href="/past-papers"
            className="inline-flex items-center gap-2 rounded-full border-2 border-accent px-3 py-1.5 text-sm font-semibold text-foreground underline transition hover:bg-accent hover:text-white"
          >
            View all past papers →
          </Link>
        </div>
        <div className="mt-4">
          <PastPapersList papers={pastPapers} hideHeading />
        </div>
      </div>

      {/* SEO Content Block */}
      <div className="mt-12 rounded-2xl border border-border bg-card/50 p-6">
        <h3 className="mb-3 text-lg font-bold text-foreground">{displayTitle} {classTitle} Study Resources</h3>
        <p className="mb-3 text-sm leading-6 text-muted">
          Access comprehensive study materials for {displayTitle} {classTitle}, including textbooks, notes, past papers, and solved exercises.
          Our resources are aligned with the latest curriculum standards, ensuring students have access to high-quality educational content
          that supports their learning journey.
        </p>
        <p className="mb-3 text-sm leading-6 text-muted">
          Find subject-specific guides for Mathematics, Physics, Chemistry, Biology, English, Urdu, and Computer Science.
          Each subject includes detailed chapter notes, solved exercises, and additional practice materials to help students
          excel in their academic performance and board examinations.
        </p>
        <p className="text-sm leading-6 text-muted">
          All study materials are designed to follow the {displayTitle} curriculum guidelines, making them perfect for classroom learning,
          homework assistance, and exam preparation. Teachers and students can rely on these resources for consistent and accurate
          educational content based on the National Curriculum 2022–23 standards.
        </p>
      </div>

      {/* Ad — bottom only, never above the subject cards */}
      <div className="mt-8">
        <AdBanner size="leaderboard" className="mx-auto" />
      </div>
    </section>
  );
}

type AuthorSummary = { slug: string; name: string };

type SubjectExercise = { slug: string; title: string };
type SubjectChapter = {
  slug: string;
  title: string;
  summary: string;
  summaryUr?: string;
  exercises?: SubjectExercise[];
};

type SubjectPageContentProps = {
  board: string;
  classSlug: string;
  subject: string;
  boardTitle: string;
  classTitle: string;
  subjectTitle: string;
  chapters: SubjectChapter[];
  authors: AuthorSummary[];
};

const MCQ_ELIGIBLE_CLASSES = new Set([9, 11, 12]);

export function SubjectPageContent({
  board,
  classSlug,
  subject,
  boardTitle,
  classTitle,
  subjectTitle,
  chapters,
  authors,
}: SubjectPageContentProps) {
  const { tr, locale } = useLocale();
  const classNum = parseClassNumber(classSlug);
  const short = boardShortName(board, classNum);
  const displayTitle = boardDisplayTitle(boardTitle, board, classNum);
  const isFbiseMcq = MCQ_ELIGIBLE_CLASSES.has(classNum);
  const tags = [
    boardShortName(board, classNum),
    classTitle,
    `Session ${ACADEMIC_YEAR}`,
    tr("sloAligned"),
    tr("examFocused"),
    tr("stepwiseSolutions"),
    tr("pdfNotes"),
    "Chapter-Wise Notes",
  ] as const;

  const sscLabel = classNum === 9 || classNum === 10 ? "SSC" : classNum === 11 || classNum === 12 ? "HSSC" : null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Detail hero — Study++ style */}
      <div className="hero-band -mx-4 -mt-8 sm:-mx-6 lg:-mx-8">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-white/70 md:text-left">
            {displayTitle} · {classTitle}
          </p>
          <h1 className="mt-1 text-center text-3xl font-black text-white sm:text-4xl md:text-left">
            {classTitle} {subjectTitle} Notes {short}
          </h1>
        </div>
      </div>

      {/* Header chips + bookmark */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-muted">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5">
            <School className="h-3 w-3 text-accent" aria-hidden="true" />
            {displayTitle}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5">
            <GraduationCap className="h-3 w-3 text-accent" aria-hidden="true" />
            {classTitle}
          </span>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-accent">{short}</span>
          {sscLabel && (
            <span className="rounded-full border border-border bg-card px-2.5 py-0.5">{sscLabel}-{classNum === 9 || classNum === 11 ? "I" : "II"}</span>
          )}
          <span className="rounded-full border border-border bg-card px-2.5 py-0.5">{ACADEMIC_YEAR}</span>
        </div>
        <BookmarkButton title={`${classTitle} ${subjectTitle} · ${displayTitle}`} path={`/${board}/${classSlug}/${subject}`} />
      </div>

      {/* Quick Answer */}
      <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-accent">Quick Answer</h2>
        <p className="mt-2 text-sm leading-6 text-foreground/90">
          These free {classTitle} {subjectTitle} notes for {displayTitle} cover all {chapters.length} chapters with
          SLO-based explanations, solved exercises, key formulas, and downloadable PDFs — aligned with the{" "}
          {ACADEMIC_YEAR} syllabus. Use the chapter cards below to jump straight into any exercise.
        </p>
      </div>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-muted animate-fade-in-up"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* MCQ practice CTA — board exams 9/11/12 now heavy on MCQs */}
      {isFbiseMcq && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-300/50 bg-emerald-50/60 p-4 dark:border-emerald-800/40 dark:bg-emerald-950/30">
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
            {short} exams now feature ~50% MCQs in {classTitle} {subjectTitle}
          </span>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/online-quizzes?board=${board}&class=${classSlug}&subject=${subject}`}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
            >
              Practice MCQs →
            </Link>
            <Link
              href="/test-generator"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-600/40 bg-white/60 px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-white dark:bg-transparent dark:text-emerald-300"
            >
              Full Test →
            </Link>
          </div>
        </div>
      )}

      {/* Chapter cards with SLO / exercises / numericals sub-links */}
      <div className="mt-8">
        <h2 className="text-xl font-black text-foreground sm:text-2xl">
          Chapter-Wise {subjectTitle} Notes
        </h2>
        <p className="mt-1 text-sm text-muted">SLO-based, exercise-wise, and numerical solutions for every chapter.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {chapters.map((chapter) => {
            const exercises = chapter.exercises ?? [];
            const chapterHref = `/${board}/${classSlug}/${subject}/${chapter.slug}`;
            const numericalHref = exercises.length > 0
              ? `${chapterHref}/${exercises[exercises.length - 1].slug}`
              : chapterHref;
            return (
              <div
                key={chapter.slug}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md animate-fade-in-up"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{tr("chapterLabel")}</p>
                <h3 className="mt-1 text-lg font-black text-foreground">
                  <Link href={chapterHref} className="transition hover:text-accent">
                    {chapter.title}
                  </Link>
                </h3>
                <p className="mt-2 text-xs leading-5 text-muted line-clamp-2">
                  {pickLocalized(locale, chapter.summary, chapter.summaryUr)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={chapterHref}
                    className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-bold text-accent transition hover:bg-accent hover:text-white"
                  >
                    SLO Notes
                  </Link>
                  <Link
                    href={numericalHref}
                    className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold text-foreground/80 transition hover:border-accent hover:text-accent"
                  >
                    Numericals
                  </Link>
                  {exercises.map((exercise) => (
                    <Link
                      key={exercise.slug}
                      href={`${chapterHref}/${exercise.slug}`}
                      className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold text-foreground/80 transition hover:border-accent hover:text-accent"
                    >
                      {exercise.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chapter-wise MCQs — 9/11/12 board pattern is ~50% MCQs */}
      {isFbiseMcq && (
        <div className="mt-10 rounded-2xl border border-border bg-card/50 p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-foreground sm:text-xl">
                Chapter-Wise {subjectTitle} MCQs
              </h2>
              <p className="mt-1 text-sm text-muted">
                {classTitle} {short} exams are ~50% MCQs — drill every chapter with instant feedback.
              </p>
            </div>
            <Link
              href={`/online-quizzes?board=${board}&class=${classSlug}&subject=${subject}`}
              className="shrink-0 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
            >
              All {subjectTitle} MCQs →
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {chapters.map((chapter) => (
              <Link
                key={`mcq-${chapter.slug}`}
                href={`/${board}/${classSlug}/${subject}/${chapter.slug}#quiz`}
                className="group rounded-xl border border-border bg-background px-3.5 py-3 transition hover:border-emerald-500/50 hover:shadow-sm"
              >
                <p className="truncate text-xs font-bold text-foreground group-hover:text-emerald-600">
                  {chapter.title}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-emerald-600/90">MCQ practice →</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* What's Included */}
      <div className="mt-10 rounded-2xl border border-border bg-card/50 p-6">
        <h2 className="text-lg font-bold text-foreground">What Is Included in the Notes?</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            "Solved Exercises",
            "MCQs",
            "Short Questions",
            "Long Questions",
            "Definitions",
            "Diagrams",
            "SLO-based Questions",
            "PDF Download",
          ].map((item, i) => (
            <div
              key={item}
              className={`flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-foreground/90 animate-fade-in-up stagger-${Math.min((i % 6) + 1, 6)}`}
            >
              <span className="text-accent">✓</span>
              {item}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">
          All {subjectTitle} notes follow the Single National Curriculum (SNC) and are prepared from the official{" "}
          {short} textbook. Each chapter is broken into exercise-wise solutions so you can revise exactly the part you
          need before an exam.
        </p>
      </div>

      {/* Course & book description */}
      <div className="mt-10 rounded-2xl border border-border bg-card/50 p-6">
        <h2 className="text-lg font-black text-foreground sm:text-xl">
          About the {classTitle} {subjectTitle} Course &amp; Book ({short})
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          {classTitle} {subjectTitle} under {displayTitle} follows the Single National Curriculum and is examined by{" "}
          {short} in the {ACADEMIC_YEAR} session. The course spans {chapters.length} chapters, each combining theory,
          worked examples, and board-style exercises.{" "}
          {classNum >= 9
            ? `For matric and intermediate students (${short}), the written paper pairs these long/short questions with a heavy MCQ component — which is why every chapter above ships with both exercise solutions and a chapter quiz.`
            : `At this stage students build strong fundamentals through exercise-wise solutions and regular practice checks before assessment.`}
        </p>
        <p className="mt-3 text-sm leading-6 text-muted">
          The core book for this course is the official {short} {subjectTitle} textbook; our notes are structured
          chapter-by-chapter against it, so you can read the book, revise from the SLO Notes pill, then confirm
          understanding with the Numericals and exercise sub-links. Pair the course with {subjectTitle} pairing
          schemes and past papers from your board page to mirror the exact exam pattern before test day.
        </p>
        <p className="mt-3 text-sm leading-6 text-muted">
          Everything here is free to read in the browser; PDFs of each exercise and the full chapter zip are one
          gated download away. Bookmark this subject page (★) to resume revision from any device.
        </p>
      </div>

      {/* Authors */}
      <div className="mt-8 rounded-2xl border border-border bg-card/50 p-5">
        <p className="text-sm text-muted">
          {authors.length === 0 ? (
            tr("notesByContributors").replace("{author}", tr("authorLabel"))
          ) : (
            <>
              {tr("notesByContributors").split("{author}")[0]}
              {authors.map((author, index) => (
                <span key={author.slug}>
                  {index > 0 && (index === authors.length - 1 ? ` ${tr("and")} ` : ", ")}
                  <Link href={`/authors/${author.slug}`} className="font-semibold text-accent hover:underline">
                    {author.name}
                  </Link>
                </span>
              ))}
              {tr("notesByContributors").split("{author}")[1] ?? ""}
            </>
          )}
        </p>
      </div>

      {/* FAQ — true bottom, above only the ad */}
      <SubjectFaq board={board} classNum={classNum} />

      {/* Ad — bottom only */}
      <div className="mt-8">
        <AdBanner size="leaderboard" className="mx-auto" />
      </div>
    </section>
  );
}

type ChapterPageContentProps = {
  board: string;
  classSlug: string;
  subject: string;
  chapter: string;
  boardTitle: string;
  classTitle: string;
  subjectTitle: string;
  chapterTitle: string;
  summary: string;
  summaryUr?: string;
  formulas: string[];
  formulasUr?: string[];
  definitions?: Flashcard[];
  videoUrl?: string;
  driveUrl?: string;
  exercises: { slug: string; title: string }[];
};

export function ChapterPageContent(props: ChapterPageContentProps) {
  const { tr, locale } = useLocale();
  const subjectKey = `${props.board}/${props.classSlug}/${props.subject}`;
  const summary = pickLocalized(locale, props.summary, props.summaryUr);
  const formulas = pickLocalizedList(locale, props.formulas, props.formulasUr);
  const classNum = parseClassNumber(props.classSlug);
  const displayTitle = boardDisplayTitle(props.boardTitle, props.board, classNum);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <ProgressTracker
        path={`/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}`}
        subjectKey={subjectKey}
        chapterSlug={props.chapter}
        label={props.chapterTitle}
      />
      <LocalizedBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: displayTitle, href: `/${props.board}` },
          { label: props.classTitle, href: `/${props.board}/${props.classSlug}` },
          { label: props.subjectTitle, href: `/${props.board}/${props.classSlug}/${props.subject}` },
          { label: props.chapterTitle },
        ]}
      />

      {/* Header — simple */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-muted">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5">
            <School className="h-3 w-3 text-accent" aria-hidden="true" />
            {displayTitle}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5">
            <GraduationCap className="h-3 w-3 text-accent" aria-hidden="true" />
            {props.classTitle}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5">
            <BookOpen className="h-3 w-3 text-accent" aria-hidden="true" />
            {props.subjectTitle}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">{tr("chapterLabel")}</p>
            <h1 className="mt-1 text-3xl font-black text-foreground sm:text-4xl">{props.chapterTitle}</h1>
          </div>
          <BookmarkButton title={props.chapterTitle} path={`/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}`} />
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-base leading-7 text-muted">{summary}</p>
        <ChapterVideo videoUrl={props.videoUrl} title={props.chapterTitle} />
        {props.driveUrl && (
          <div className="mt-4">
            <DriveLinkButton href={props.driveUrl} label="Open chapter resource on Drive" />
          </div>
        )}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-5">
            <h2 className="text-lg font-bold text-foreground">{tr("keyFormulas")}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground/90">
              {formulas.length === 0 ? (
                <li className="text-muted">{tr("noFormulasYet")}</li>
              ) : (
                formulas.map((formula) => (
                  <li key={formula} className="flex gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent" />
                    <MathText text={formula} />
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5">
            <h2 className="text-lg font-bold text-foreground">{tr("exercisesSection")}</h2>
            <div className="mt-4 space-y-3">
              {props.exercises.map((exercise) => (
                <Link
                  key={exercise.slug}
                  href={`/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}/${exercise.slug}`}
                  className="block rounded-xl border border-border bg-card px-3 py-3 text-sm font-medium text-foreground/90 transition hover:border-accent/40 hover:text-accent"
                >
                  {exercise.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <ChapterFlashcards
          cards={props.definitions ?? []}
          chapterKey={`${props.board}/${props.classSlug}/${props.subject}/${props.chapter}`}
        />
        <div id="quiz" className="scroll-mt-24">
          <ChapterQuiz
            board={props.board}
            classSlug={props.classSlug}
            subject={props.subject}
            chapter={props.chapter}
            chapterTitle={props.chapterTitle}
          />
        </div>
        <ChapterZipDownload
          board={props.board}
          classSlug={props.classSlug}
          subject={props.subject}
          chapter={props.chapter}
        />
        <SaveOfflineButton
          path={`/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}`}
          title={props.chapterTitle}
          subjectLabel={`${displayTitle} · ${props.subjectTitle}`}
          apiPath={`/api/boards/${props.board}/classes/${props.classSlug}/subjects/${props.subject}/chapters/${props.chapter}`}
          payload={{
            board: { slug: props.board, title: displayTitle },
            class: { slug: props.classSlug, title: props.classTitle },
            subject: { slug: props.subject, title: props.subjectTitle },
            chapter: {
              slug: props.chapter,
              title: props.chapterTitle,
              summary: props.summary,
              summaryUr: props.summaryUr,
              formulas: props.formulas,
              formulasUr: props.formulasUr,
              definitions: props.definitions,
              videoUrl: props.videoUrl,
              exercises: props.exercises,
            },
          }}
          exercisePaths={props.exercises.map(
            (exercise) =>
              `/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}/${exercise.slug}`,
          )}
        />
      </div>
    </section>
  );
}

type ExercisePageContentProps = {
  board: string;
  classSlug: string;
  subject: string;
  chapter: string;
  exercise: string;
  boardTitle: string;
  classTitle: string;
  subjectTitle: string;
  chapterTitle: string;
  exerciseTitle: string;
  questions: { num: number; question: string }[];
  pdfDownloadUrl?: string | null;
  exercises?: { slug: string; title: string }[];
};

export function ExercisePageContent(props: ExercisePageContentProps) {
  const { tr } = useLocale();
  const classNum = parseClassNumber(props.classSlug);
  const displayTitle = boardDisplayTitle(props.boardTitle, props.board, classNum);

  const exerciseList = props.exercises ?? [];
  const currentIndex = exerciseList.findIndex((e) => e.slug === props.exercise);
  const prevExercise = currentIndex > 0 ? exerciseList[currentIndex - 1] : null;
  const nextExercise =
    currentIndex >= 0 && currentIndex < exerciseList.length - 1 ? exerciseList[currentIndex + 1] : null;

  const exercisePath = (slug: string) =>
    `/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}/${slug}`;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <LocalizedBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: displayTitle, href: `/${props.board}` },
          { label: props.classTitle, href: `/${props.board}/${props.classSlug}` },
          { label: props.subjectTitle, href: `/${props.board}/${props.classSlug}/${props.subject}` },
          { label: props.chapterTitle, href: `/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}` },
          { label: props.exerciseTitle },
        ]}
      />

      {/* Header — simple */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5">
              <BookOpen className="h-3 w-3 text-accent" aria-hidden="true" />
              {props.subjectTitle}
            </span>
            <span className="rounded-full border border-border bg-card px-2.5 py-0.5">📑 {props.chapterTitle}</span>
          </div>
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-accent">{tr("exerciseLabel")}</p>
          <h1 className="mt-1 text-3xl font-black text-foreground sm:text-4xl">{props.exerciseTitle}</h1>
        </div>
        {props.pdfDownloadUrl ? (
          <DownloadGate url={props.pdfDownloadUrl} showAd={false} />
        ) : (
          <span className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-muted">
            {tr("downloadPdf")}
          </span>
        )}
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">{tr("questionList")}</p>
          <div className="mt-4 space-y-3">
            {props.questions.length === 0 ? (
              <p className="text-sm text-muted">{tr("noQuestionsYet")}</p>
            ) : (
              props.questions.map((question, i) => (
                <Link
                  key={question.num}
                  href={`/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}/${props.exercise}/q/${question.num}`}
                  className={`flex flex-col gap-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground/90 transition hover:border-accent/40 hover:text-accent animate-fade-in-up stagger-${Math.min((i % 6) + 1, 6)} sm:flex-row sm:items-center sm:justify-between`}
                >
                  <span className="font-bold text-accent">Q{question.num}</span>
                  <span>{question.question}</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {props.pdfDownloadUrl && <PdfSection url={props.pdfDownloadUrl} title={props.exerciseTitle} />}

        <div className="mt-4">
          <AdBanner size="inline" className="mx-auto" />
        </div>

        {/* Prev / Next exercise navigation */}
        <nav className="mt-6 grid gap-3 border-t border-border pt-5 sm:flex sm:items-center sm:justify-between">
          {prevExercise ? (
            <Link
              href={exercisePath(prevExercise.slug)}
              className="inline-flex items-center gap-2 overflow-hidden rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent"
            >
              <span aria-hidden="true" className="shrink-0">←</span>
              <span className="truncate">{tr("previous")} · {prevExercise.title}</span>
            </Link>
          ) : (
            <span className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted/50">{tr("previous")}</span>
          )}
          {nextExercise ? (
            <Link
              href={exercisePath(nextExercise.slug)}
              className="inline-flex items-center gap-2 overflow-hidden rounded-xl border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm font-bold text-accent transition hover:bg-accent/20"
            >
              <span className="truncate">{tr("next")} · {nextExercise.title}</span>
              <span aria-hidden="true" className="shrink-0">→</span>
            </Link>
          ) : (
            <span className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted/50">{tr("next")}</span>
          )}
        </nav>

        {/* Ad — bottom only */}
        <div className="mt-6 border-t border-border pt-5">
          <AdBanner size="leaderboard" className="mx-auto" />
        </div>
      </div>
    </section>
  );
}
