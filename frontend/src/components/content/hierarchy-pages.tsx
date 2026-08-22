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
import { useLocale } from "@/lib/locale-context";
import { pickLocalized, pickLocalizedList } from "@/lib/i18n";

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
      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{tr("boardLabel")}</p>
        <h1 className="mt-3 text-3xl font-black text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-3 text-muted">{tr("chooseClassContinue")}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classes.length === 0 ? (
            <p className="text-sm text-muted md:col-span-2 xl:col-span-3">{tr("noClassesYet")}</p>
          ) : (
            classes.map((klass) => (
              <Link
                key={klass.slug}
                href={`/${board}/${klass.slug}`}
                className="rounded-2xl border border-border bg-background p-5 transition hover:border-accent/40 hover:bg-accent/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{tr("classLabel")}</p>
                <h2 className="mt-2 text-xl font-bold text-foreground">{klass.title}</h2>
                <p className="mt-2 text-sm text-muted">{tr("openSubjectsResources")}</p>
              </Link>
            ))
          )}
        </div>
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

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <LocalizedBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: boardTitle, href: `/${board}` },
          { label: classTitle },
        ]}
      />
      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{tr("classLabel")}</p>
        <h1 className="mt-3 text-3xl font-black text-foreground">{classTitle}</h1>
        <p className="mt-3 text-muted">{tr("chooseSubjectContinue").replace("{board}", boardTitle)}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {subjects.length === 0 ? (
            <p className="text-sm text-muted md:col-span-2 xl:col-span-3">{tr("noSubjectsYet")}</p>
          ) : (
            subjects.map((subject) => (
              <Link
                key={subject.slug}
                href={`/${board}/${classSlug}/${subject.slug}`}
                className="rounded-2xl border border-border bg-background p-5 transition hover:border-accent/40 hover:bg-accent/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{tr("subjectLabel")}</p>
                <h2 className="mt-2 text-xl font-bold text-foreground">{subject.title}</h2>
                <p className="mt-2 text-sm text-muted">{tr("openChaptersNotes")}</p>
              </Link>
            ))
          )}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{tr("notes")}</p>
            <p className="mt-2 font-semibold text-foreground">{tr("conceptSummaries")}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{tr("books")}</p>
            <p className="mt-2 font-semibold text-foreground">{tr("textbookLinks")}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{tr("pastPapers")}</p>
            <p className="mt-2 font-semibold text-foreground">{tr("solvedPaperSets")}</p>
          </div>
        </div>
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
      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{tr("subjectLabel")}</p>
            <h1 className="mt-3 text-3xl font-black text-foreground">{subjectTitle}</h1>
          </div>
          <div className="rounded-full bg-accent/15 px-3 py-1 text-sm font-semibold text-accent">{tr("sessionYear")}</div>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {chapters.map((chapter) => (
            <Link
              key={chapter.slug}
              href={`/${board}/${classSlug}/${subject}/${chapter.slug}`}
              className="rounded-2xl border border-border bg-background p-5 transition hover:border-accent/40 hover:bg-accent/10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{tr("chapterLabel")}</p>
              <h2 className="mt-2 text-xl font-bold text-foreground">{chapter.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {pickLocalized(locale, chapter.summary, chapter.summaryUr)}
              </p>
            </Link>
          ))}
        </div>
        <SubjectFaq />
        <div className="mt-8 rounded-2xl border border-border bg-card p-5">
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
      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{tr("chapterLabel")}</p>
        <h1 className="mt-3 text-3xl font-black text-foreground">{props.chapterTitle}</h1>
        <p className="mt-4 text-base leading-7 text-muted">{summary}</p>
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
};

export function ExercisePageContent(props: ExercisePageContentProps) {
  const { tr } = useLocale();

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
      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{tr("exerciseLabel")}</p>
            <h1 className="mt-3 text-3xl font-black text-foreground">{props.exerciseTitle}</h1>
          </div>
          {props.pdfDownloadUrl ? (
            <a
              href={props.pdfDownloadUrl}
              download
              className="rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {tr("downloadPdf")}
            </a>
          ) : (
            <span className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-muted">
              {tr("downloadPdf")}
            </span>
          )}
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-background p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">{tr("questionList")}</p>
          <div className="mt-4 space-y-3">
            {props.questions.length === 0 ? (
              <p className="text-sm text-muted">{tr("noQuestionsYet")}</p>
            ) : (
              props.questions.map((question) => (
                <Link
                  key={question.num}
                  href={`/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}/${props.exercise}/q/${question.num}`}
                  className="flex flex-col gap-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground/90 transition hover:border-accent/40 hover:text-accent sm:flex-row sm:items-center sm:justify-between"
                >
                  <span>{tr("questionN").replace("{num}", String(question.num))}</span>
                  <span>{question.question}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
