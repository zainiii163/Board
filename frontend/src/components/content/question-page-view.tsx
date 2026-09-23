"use client";

import Link from "next/link";
import type { PdfSummary } from "@/lib/shared-types";

import { LocalizedBreadcrumbs } from "@/components/layout/localized-breadcrumbs";
import { MathText } from "@/components/content/math-text";
import { PdfSection } from "@/components/content/pdf-section";
import { ReportMistakeForm } from "@/components/content/report-mistake-form";
import { QuestionComments } from "@/components/content/question-comments";
import { ShareButtons } from "@/components/content/share-buttons";
import { BookmarkButton } from "@/components/content/bookmark-button";
import { ProgressTracker } from "@/components/content/progress-tracker";
import { TextSizeControl } from "@/components/content/text-size-control";
import { useLocale } from "@/lib/locale-context";
import { pickLocalized, pickLocalizedSteps } from "@/lib/i18n";
import { boardDisplayTitle } from "@/lib/constants";

type QuestionPageViewProps = {
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
  question: {
    num: number;
    question: string;
    questionUr?: string;
    marks: number;
    difficulty: string;
    steps: { title: string; content: string }[];
    stepsUr?: { title: string; content: string }[];
  };
  questions: { num: number }[];
  pdfData: PdfSummary | null;
  pagePath: string;
  pageTitle: string;
  questionRef: string;
};

export function QuestionPageView(props: QuestionPageViewProps) {
  const { tr, locale } = useLocale();
  const questionText = pickLocalized(locale, props.question.question, props.question.questionUr);
  const steps = pickLocalizedSteps(locale, props.question.steps, props.question.stepsUr);
  const currentIndex = props.questions.findIndex((item) => item.num === props.question.num);
  const previousQuestion = currentIndex > 0 ? props.questions[currentIndex - 1] : null;
  const nextQuestion =
    currentIndex >= 0 && currentIndex < props.questions.length - 1
      ? props.questions[currentIndex + 1]
      : null;
  const subjectKey = `${props.board}/${props.classSlug}/${props.subject}`;
  const progressLabel = `${props.subjectTitle} → ${props.chapterTitle}`;
  const classNum = parseInt(props.classSlug, 10) || 0;
  const displayTitle = boardDisplayTitle(props.boardTitle, props.board, classNum);

  return (
    <section className="question-page mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <ProgressTracker
        path={props.pagePath}
        subjectKey={subjectKey}
        chapterSlug={props.chapter}
        label={progressLabel}
      />
      <div className="print:hidden">
        <LocalizedBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: displayTitle, href: `/${props.board}` },
            { label: props.classTitle, href: `/${props.board}/${props.classSlug}` },
            { label: props.subjectTitle, href: `/${props.board}/${props.classSlug}/${props.subject}` },
            { label: props.chapterTitle, href: `/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}` },
            { label: props.exerciseTitle, href: `/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}/${props.exercise}` },
            { label: tr("questionN").replace("{num}", String(props.question.num)) },
          ]}
        />
      </div>
      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {tr("questionN").replace("{num}", String(props.question.num))}
            </p>
            <h1 className="mt-3 text-3xl font-black text-foreground">
              <MathText text={questionText} />
            </h1>
          </div>
          <div className="rounded-full bg-background px-3 py-1 text-sm font-semibold text-foreground">
            {props.question.marks} {tr("marksLabel")} • {props.question.difficulty}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <ShareButtons title={props.pageTitle} />
          <div className="flex flex-wrap items-center gap-3">
            <TextSizeControl />
            <BookmarkButton title={props.pageTitle} path={props.pagePath} />
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 print:hidden">
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{tr("previous")}</p>
            {previousQuestion ? (
              <Link
                href={`/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}/${props.exercise}/q/${previousQuestion.num}`}
                className="mt-2 inline-block text-sm font-medium text-foreground hover:text-accent"
              >
                {tr("questionN").replace("{num}", String(previousQuestion.num))}
              </Link>
            ) : (
              <Link
                href={`/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}/${props.exercise}`}
                className="mt-2 inline-block text-sm font-medium text-foreground hover:text-accent"
              >
                {tr("backToExercise")}
              </Link>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-background p-4 text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{tr("next")}</p>
            {nextQuestion ? (
              <Link
                href={`/${props.board}/${props.classSlug}/${props.subject}/${props.chapter}/${props.exercise}/q/${nextQuestion.num}`}
                className="mt-2 inline-block text-sm font-medium text-foreground hover:text-accent"
              >
                {tr("questionN").replace("{num}", String(nextQuestion.num))}
              </Link>
            ) : (
              <p className="mt-2 text-sm font-medium text-foreground">{tr("endOfExercise")}</p>
            )}
          </div>
        </div>
        {props.pdfData && <PdfSection url={props.pdfData.url} title={props.pdfData.filename} />}
        <div className="mt-8 space-y-5">
          <h2 className="text-lg font-bold text-foreground">{tr("stepByStepSolution")}</h2>
          {steps.map((step) => (
            <div key={`${step.title}-${step.content.slice(0, 20)}`} className="rounded-2xl border border-border bg-background p-5">
              <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 whitespace-pre-line leading-7 text-foreground">
                <MathText text={step.content} />
              </p>
            </div>
          ))}
        </div>
        <ReportMistakeForm pageUrl={props.pagePath} boardSlug={props.board} questionRef={props.questionRef} />
        <QuestionComments pagePath={props.pagePath} questionRef={props.questionRef} />
      </div>
    </section>
  );
}
