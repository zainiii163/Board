import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { apiFetchOrNull } from "@/lib/api-client";

type ExerciseData = {
  board: { slug: string; title: string } | null;
  class: { slug: string; title: string } | null;
  subject: { slug: string; title: string } | null;
  chapter: { slug: string; title: string } | null;
  exercise: {
    slug: string;
    title: string;
    questions: { num: number; question: string }[];
  };
};

export default async function ExercisePage({
  params,
}: {
  params: Promise<{
    board: string;
    classSlug: string;
    subject: string;
    chapter: string;
    exercise: string;
  }>;
}) {
  const { board, classSlug, subject, chapter, exercise } = await params;
  const data = await apiFetchOrNull<ExerciseData>(
    `/api/boards/${board}/classes/${classSlug}/subjects/${subject}/chapters/${chapter}/exercises/${exercise}`,
  );

  if (!data) notFound();

  return (
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: data.board?.title ?? "Board", href: `/${board}` },
            { label: data.class?.title ?? "Class", href: `/${board}/${classSlug}` },
            { label: data.subject?.title ?? "Subject", href: `/${board}/${classSlug}/${subject}` },
            { label: data.chapter?.title ?? "Chapter", href: `/${board}/${classSlug}/${subject}/${chapter}` },
            { label: data.exercise.title },
          ]}
        />

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Exercise</p>
              <h1 className="mt-3 text-3xl font-black text-slate-900">{data.exercise.title}</h1>
            </div>
            <button type="button" className="rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
              Download PDF
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Question list</p>
            <div className="mt-4 space-y-3">
              {(data.exercise.questions ?? []).length === 0 ? (
                <p className="text-sm text-slate-600">No questions published for this exercise yet.</p>
              ) : (
                data.exercise.questions.map((question) => (
                  <Link
                    key={question.num}
                    href={`/${board}/${classSlug}/${subject}/${chapter}/${exercise}/q/${question.num}`}
                    className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-sky-200 hover:text-sky-700 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span>Question {question.num}</span>
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
