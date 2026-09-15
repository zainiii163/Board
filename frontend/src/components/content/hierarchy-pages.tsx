"use client";

import Link from "next/link";

import { LocalizedBreadcrumbs } from "@/components/layout/localized-breadcrumbs";
import { ChapterQuiz } from "@/components/content/chapter-quiz";
import { SaveOfflineButton } from "@/components/content/save-offline-button";
import { ChapterFlashcards, type Flashcard } from "@/components/content/chapter-flashcards";
import { ChapterVideo } from "@/components/content/chapter-video";
import { ChapterZipDownload } from "@/components/content/chapter-zip-download";
import { ProgressTracker } from "@/components/content/progress-tracker";
import { SubjectFaq } from "@/components/content/subject-faq";
import { MathText } from "@/components/content/math-text";
import { PdfSection } from "@/components/content/pdf-section";
import { DownloadGate } from "@/components/content/download-gate";
import { AdBanner } from "@/components/portal/ad-banner";
import { useLocale } from "@/lib/locale-context";
import { pickLocalized, pickLocalizedList } from "@/lib/i18n";

const SUBJECT_COLORS = [
  { bg: "bg-gradient-to-br from-sky-50 to-blue-50", dark: "dark:from-sky-950/30 dark:to-blue-950/30", border: "border-sky-200/60 dark:border-sky-800/30", icon: "bg-gradient-to-br from-sky-500 to-blue-500", hover: "hover:border-sky-400", tag: "text-sky-600 dark:text-sky-300" },
  { bg: "bg-gradient-to-br from-emerald-50 to-teal-50", dark: "dark:from-emerald-950/30 dark:to-teal-950/30", border: "border-emerald-200/60 dark:border-emerald-800/30", icon: "bg-gradient-to-br from-emerald-500 to-teal-500", hover: "hover:border-emerald-400", tag: "text-emerald-600 dark:text-emerald-300" },
  { bg: "bg-gradient-to-br from-amber-50 to-orange-50", dark: "dark:from-amber-950/30 dark:to-orange-950/30", border: "border-amber-200/60 dark:border-amber-800/30", icon: "bg-gradient-to-br from-amber-500 to-orange-500", hover: "hover:border-amber-400", tag: "text-amber-600 dark:text-amber-300" },
  { bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50", dark: "dark:from-purple-950/30 dark:to-fuchsia-950/30", border: "border-purple-200/60 dark:border-purple-800/30", icon: "bg-gradient-to-br from-purple-500 to-fuchsia-500", hover: "hover:border-purple-400", tag: "text-purple-600 dark:text-purple-300" },
  { bg: "bg-gradient-to-br from-rose-50 to-pink-50", dark: "dark:from-rose-950/30 dark:to-pink-950/30", border: "border-rose-200/60 dark:border-rose-800/30", icon: "bg-gradient-to-br from-rose-500 to-pink-500", hover: "hover:border-rose-400", tag: "text-rose-600 dark:text-rose-300" },
  { bg: "bg-gradient-to-br from-cyan-50 to-sky-50", dark: "dark:from-cyan-950/30 dark:to-sky-950/30", border: "border-cyan-200/60 dark:border-cyan-800/30", icon: "bg-gradient-to-br from-cyan-500 to-sky-500", hover: "hover:border-cyan-400", tag: "text-cyan-600 dark:text-cyan-300" },
  { bg: "bg-gradient-to-br from-indigo-50 to-violet-50", dark: "dark:from-indigo-950/30 dark:to-violet-950/30", border: "border-indigo-200/60 dark:border-indigo-800/30", icon: "bg-gradient-to-br from-indigo-500 to-violet-500", hover: "hover:border-indigo-400", tag: "text-indigo-600 dark:text-indigo-300" },
  { bg: "bg-gradient-to-br from-red-50 to-rose-50", dark: "dark:from-red-950/30 dark:to-rose-950/30", border: "border-red-200/60 dark:border-red-800/30", icon: "bg-gradient-to-br from-red-500 to-rose-500", hover: "hover:border-red-400", tag: "text-red-600 dark:text-red-300" },
  { bg: "bg-gradient-to-br from-teal-50 to-emerald-50", dark: "dark:from-teal-950/30 dark:to-emerald-950/30", border: "border-teal-200/60 dark:border-teal-800/30", icon: "bg-gradient-to-br from-teal-500 to-emerald-500", hover: "hover:border-teal-400", tag: "text-teal-600 dark:text-teal-300" },
  { bg: "bg-gradient-to-br from-yellow-50 to-amber-50", dark: "dark:from-yellow-950/30 dark:to-amber-950/30", border: "border-yellow-200/60 dark:border-yellow-800/30", icon: "bg-gradient-to-br from-yellow-500 to-amber-500", hover: "hover:border-yellow-400", tag: "text-yellow-600 dark:text-yellow-300" },
];

const CLASS_ICONS = ["📚", "📖", "🎓", "✏️", "📝", "🧮", "🔬", "📐", "🌍", "📊"];

type BoardPageContentProps = {
  board: string;
  title: string;
  classes: { slug: string; title: string }[];
};

export function BoardPageContent({ board, title, classes }: BoardPageContentProps) {
  const { tr } = useLocale();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <LocalizedBreadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />

      {/* Colorful header banner */}
      <div className="hero-gradient relative mt-6 overflow-hidden rounded-3xl px-8 py-10 text-white shadow-xl sm:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl animate-float" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl animate-float-slow" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        </div>
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur-sm">
            🏫 {tr("boardLabel")}
          </span>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>{title}</h1>
          <p className="mt-2 max-w-lg text-sm text-white/85">{tr("chooseClassContinue")}</p>
        </div>
      </div>

      {/* Class cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {classes.length === 0 ? (
          <p className="text-sm text-muted md:col-span-2 xl:col-span-3">{tr("noClassesYet")}</p>
        ) : (
          classes.map((klass, i) => {
            const color = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
            const icon = CLASS_ICONS[i % CLASS_ICONS.length];
            return (
              <Link
                key={klass.slug}
                href={`/${board}/${klass.slug}`}
                className={`group relative overflow-hidden rounded-2xl border ${color.border} ${color.bg} ${color.dark} p-6 transition-all duration-400 hover:-translate-y-1 hover:shadow-xl ${color.hover} animate-fade-in-up stagger-${Math.min((i % 6) + 1, 6)}`}
              >
                <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${color.icon} opacity-[0.08] blur-xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-[0.15]`} />
                <span className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color.icon} text-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  {icon}
                </span>
                <p className={`text-xs font-bold uppercase tracking-[0.18em] ${color.tag}`}>{tr("classLabel")}</p>
                <h2 className="mt-1 text-xl font-black text-foreground transition-colors duration-200 group-hover:text-accent">{klass.title}</h2>
                <p className="mt-2 text-sm text-muted">{tr("openSubjectsResources")}</p>
                <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r opacity-60 transition-all duration-700 group-hover:w-full rounded-full" />
              </Link>
            );
          })
        )}
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
};

export function ClassPageContent({
  board,
  classSlug,
  boardTitle,
  classTitle,
  subjects,
}: ClassPageContentProps) {
  const { tr } = useLocale();

  const infoCards = [
    { icon: "📝", label: tr("notes"), desc: tr("conceptSummaries"), bg: "from-sky-50 to-blue-50", dark: "dark:from-sky-950/30 dark:to-blue-950/30", border: "border-sky-200/60 dark:border-sky-800/30", iconBg: "from-sky-500 to-blue-500" },
    { icon: "📚", label: tr("books"), desc: tr("textbookLinks"), bg: "from-emerald-50 to-teal-50", dark: "dark:from-emerald-950/30 dark:to-teal-950/30", border: "border-emerald-200/60 dark:border-emerald-800/30", iconBg: "from-emerald-500 to-teal-500" },
    { icon: "📄", label: tr("pastPapers"), desc: tr("solvedPaperSets"), bg: "from-amber-50 to-orange-50", dark: "dark:from-amber-950/30 dark:to-orange-950/30", border: "border-amber-200/60 dark:border-amber-800/30", iconBg: "from-amber-500 to-orange-500" },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <LocalizedBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: boardTitle, href: `/${board}` },
          { label: classTitle },
        ]}
      />

      {/* Colorful header banner */}
      <div className="hero-gradient relative mt-6 overflow-hidden rounded-3xl px-8 py-10 text-white shadow-xl sm:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl animate-float" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl animate-float-slow" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur-sm">
              🏫 {boardTitle}
            </span>
            <span className="text-white/40">/</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur-sm">
              🎓 {tr("classLabel")}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>{classTitle}</h1>
          <p className="mt-2 max-w-lg text-sm text-white/85">{tr("chooseSubjectContinue").replace("{board}", boardTitle)}</p>
        </div>
      </div>

      {/* Subject cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {subjects.length === 0 ? (
          <p className="text-sm text-muted md:col-span-2 xl:col-span-3">{tr("noSubjectsYet")}</p>
        ) : (
          subjects.map((subject, i) => {
            const color = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
            return (
              <Link
                key={subject.slug}
                href={`/${board}/${classSlug}/${subject.slug}`}
                className={`group relative overflow-hidden rounded-2xl border ${color.border} ${color.bg} ${color.dark} p-6 transition-all duration-400 hover:-translate-y-1 hover:shadow-xl ${color.hover} animate-fade-in-up stagger-${Math.min((i % 6) + 1, 6)}`}
              >
                <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${color.icon} opacity-[0.08] blur-xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-[0.15]`} />
                <span className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color.icon} text-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  📖
                </span>
                <p className={`text-xs font-bold uppercase tracking-[0.18em] ${color.tag}`}>{tr("subjectLabel")}</p>
                <h2 className="mt-1 text-xl font-black text-foreground transition-colors duration-200 group-hover:text-accent">{subject.title}</h2>
                <p className="mt-2 text-sm text-muted">{tr("openChaptersNotes")}</p>
                <span className={`absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r ${color.icon} opacity-60 transition-all duration-700 group-hover:w-full rounded-full`} />
              </Link>
            );
          })
        )}
      </div>

      {/* Info cards */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {infoCards.map((card, i) => (
          <Link
            key={card.label}
            href={`/${board}/${classSlug}/${subjects[0]?.slug ?? ""}`}
            className={`group overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-br ${card.bg} ${card.dark} p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up stagger-${i + 1}`}
          >
            <span className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.iconBg} text-lg text-white shadow-sm transition-transform duration-300 group-hover:scale-110`}>
              {card.icon}
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{card.label}</p>
            <p className="mt-1 font-bold text-foreground transition-colors duration-200 group-hover:text-accent">{card.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

type AuthorSummary = { slug: string; name: string };

type SubjectPageContentProps = {
  board: string;
  classSlug: string;
  subject: string;
  boardTitle: string;
  classTitle: string;
  subjectTitle: string;
  chapters: { slug: string; title: string; summary: string; summaryUr?: string }[];
  authors: AuthorSummary[];
};

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
  const tags = [tr("sloAligned"), tr("examFocused"), tr("stepwiseSolutions"), tr("pdfNotes")] as const;
  const color = SUBJECT_COLORS[chapters.length % SUBJECT_COLORS.length];

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <LocalizedBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: boardTitle, href: `/${board}` },
          { label: classTitle, href: `/${board}/${classSlug}` },
          { label: subjectTitle },
        ]}
      />

      {/* Colorful header banner */}
      <div className={`${color.bg} ${color.dark} relative mt-6 overflow-hidden rounded-3xl border ${color.border} px-8 py-10 shadow-xl sm:px-10`}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className={`absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${color.icon} opacity-[0.08] blur-2xl animate-float`} />
          <div className={`absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-gradient-to-br ${color.icon} opacity-[0.05] blur-3xl animate-float-slow`} />
        </div>
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-card/80 px-2.5 py-0.5 text-[10px] font-bold text-muted">🏫 {boardTitle}</span>
            <span className="text-muted/40">/</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-card/80 px-2.5 py-0.5 text-[10px] font-bold text-muted">🎓 {classTitle}</span>
          </div>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={`text-sm font-bold uppercase tracking-[0.18em] ${color.tag}`}>{tr("subjectLabel")}</p>
              <h1 className="mt-1 text-3xl font-black text-foreground sm:text-4xl">{subjectTitle}</h1>
            </div>
            <span className="rounded-full border border-border bg-card/80 px-3 py-1 text-sm font-semibold text-muted backdrop-blur-sm">{tr("sessionYear")}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={tag}
            className={`rounded-full border ${color.border} ${color.bg} ${color.dark} px-3 py-1 text-xs font-bold ${color.tag} animate-fade-in-up stagger-${i + 1}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Chapter cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {chapters.map((chapter, i) => {
          const cc = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
          return (
            <Link
              key={chapter.slug}
              href={`/${board}/${classSlug}/${subject}/${chapter.slug}`}
              className={`group relative overflow-hidden rounded-2xl border ${cc.border} ${cc.bg} ${cc.dark} p-5 transition-all duration-400 hover:-translate-y-1 hover:shadow-xl ${cc.hover} animate-fade-in-up stagger-${Math.min((i % 6) + 1, 6)}`}
            >
              <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${cc.icon} opacity-[0.08] blur-xl transition-all duration-700 group-hover:scale-150`} />
              <p className={`text-xs font-bold uppercase tracking-[0.18em] ${cc.tag}`}>{tr("chapterLabel")}</p>
              <h2 className="mt-1 text-lg font-black text-foreground transition-colors duration-200 group-hover:text-accent">{chapter.title}</h2>
              <p className="mt-2 text-xs leading-5 text-muted line-clamp-2">
                {pickLocalized(locale, chapter.summary, chapter.summaryUr)}
              </p>
              <span className={`absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r ${cc.icon} opacity-60 transition-all duration-700 group-hover:w-full rounded-full`} />
            </Link>
          );
        })}
      </div>

      <SubjectFaq />

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
  exercises: { slug: string; title: string }[];
};

export function ChapterPageContent(props: ChapterPageContentProps) {
  const { tr, locale } = useLocale();
  const subjectKey = `${props.board}/${props.classSlug}/${props.subject}`;
  const summary = pickLocalized(locale, props.summary, props.summaryUr);
  const formulas = pickLocalizedList(locale, props.formulas, props.formulasUr);
  const color = SUBJECT_COLORS[0];

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
          { label: props.boardTitle, href: `/${props.board}` },
          { label: props.classTitle, href: `/${props.board}/${props.classSlug}` },
          { label: props.subjectTitle, href: `/${props.board}/${props.classSlug}/${props.subject}` },
          { label: props.chapterTitle },
        ]}
      />

      {/* Header banner */}
      <div className={`${color.bg} ${color.dark} relative mt-6 overflow-hidden rounded-3xl border ${color.border} px-8 py-10 shadow-xl sm:px-10`}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className={`absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${color.icon} opacity-[0.08] blur-2xl animate-float`} />
        </div>
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-muted">
            <span className="rounded-full border border-border/50 bg-card/80 px-2.5 py-0.5">🏫 {props.boardTitle}</span>
            <span className="rounded-full border border-border/50 bg-card/80 px-2.5 py-0.5">🎓 {props.classTitle}</span>
            <span className="rounded-full border border-border/50 bg-card/80 px-2.5 py-0.5">📖 {props.subjectTitle}</span>
          </div>
          <p className={`mt-3 text-sm font-bold uppercase tracking-[0.18em] ${color.tag}`}>{tr("chapterLabel")}</p>
          <h1 className="mt-1 text-3xl font-black text-foreground sm:text-4xl">{props.chapterTitle}</h1>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-base leading-7 text-muted">{summary}</p>
        <ChapterVideo videoUrl={props.videoUrl} title={props.chapterTitle} />
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
        <ChapterQuiz
          board={props.board}
          classSlug={props.classSlug}
          subject={props.subject}
          chapter={props.chapter}
          chapterTitle={props.chapterTitle}
        />
        <ChapterZipDownload
          board={props.board}
          classSlug={props.classSlug}
          subject={props.subject}
          chapter={props.chapter}
        />
        <SaveOfflineButton
          path={`/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}`}
          title={props.chapterTitle}
          subjectLabel={`${props.boardTitle} · ${props.subjectTitle}`}
          apiPath={`/api/boards/${props.board}/classes/${props.classSlug}/subjects/${props.subject}/chapters/${props.chapter}`}
          payload={{
            board: { slug: props.board, title: props.boardTitle },
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

  const exerciseList = props.exercises ?? [];
  const currentIndex = exerciseList.findIndex((e) => e.slug === props.exercise);
  const prevExercise = currentIndex > 0 ? exerciseList[currentIndex - 1] : null;
  const nextExercise =
    currentIndex >= 0 && currentIndex < exerciseList.length - 1 ? exerciseList[currentIndex + 1] : null;

  const exercisePath = (slug: string) =>
    `/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}/${slug}`;

  const color = SUBJECT_COLORS[3];

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <LocalizedBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: props.boardTitle, href: `/${props.board}` },
          { label: props.classTitle, href: `/${props.board}/${props.classSlug}` },
          { label: props.subjectTitle, href: `/${props.board}/${props.classSlug}/${props.subject}` },
          { label: props.chapterTitle, href: `/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}` },
          { label: props.exerciseTitle },
        ]}
      />

      {/* Header banner */}
      <div className={`${color.bg} ${color.dark} relative mt-6 overflow-hidden rounded-3xl border ${color.border} px-8 py-10 shadow-xl sm:px-10`}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className={`absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${color.icon} opacity-[0.08] blur-2xl animate-float`} />
        </div>
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-muted">
              <span className="rounded-full border border-border/50 bg-card/80 px-2.5 py-0.5">📖 {props.subjectTitle}</span>
              <span className="rounded-full border border-border/50 bg-card/80 px-2.5 py-0.5">📑 {props.chapterTitle}</span>
            </div>
            <p className={`mt-3 text-sm font-bold uppercase tracking-[0.18em] ${color.tag}`}>{tr("exerciseLabel")}</p>
            <h1 className="mt-1 text-3xl font-black text-foreground sm:text-4xl">{props.exerciseTitle}</h1>
          </div>
          {props.pdfDownloadUrl ? (
            <DownloadGate url={props.pdfDownloadUrl} />
          ) : (
            <span className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-3 text-sm font-semibold text-muted backdrop-blur-sm">
              {tr("downloadPdf")}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {/* Ad — above question list */}
        <AdBanner size="leaderboard" className="mx-auto" />

        <div className="mt-6 rounded-2xl border border-border bg-background p-5">
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
      </div>
    </section>
  );
}
