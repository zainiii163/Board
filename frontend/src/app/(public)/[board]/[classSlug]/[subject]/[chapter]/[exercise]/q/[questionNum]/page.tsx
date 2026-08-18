import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { apiFetch } from "@/lib/api-client";

type QuestionData = {
  board: { slug: string; title: string } | null;
  class: { slug: string; title: string } | null;
  subject: { slug: string; title: string } | null;
  chapter: { slug: string; title: string } | null;
  exercise: { slug: string; title: string } | null;
  question: {
    num: number;
    question: string;
    marks: number;
    difficulty: string;
    pdfName: string;
    steps: { title: string; content: string }[];
  };
};

export default async function QuestionPage({
  params,
}: {
  params: Promise<{
    board: string;
    classSlug: string;
    subject: string;
    chapter: string;
    exercise: string;
    questionNum: string;
  }>;
}) {
  const { board, classSlug, subject, chapter, exercise, questionNum } = await params;

  try {
    const data = await apiFetch<QuestionData>(`/api/boards/${board}/classes/${classSlug}/subjects/${subject}/chapters/${chapter}/exercises/${exercise}/q/${questionNum}`);

    return (
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: data.board?.title ?? "Board", href: `/${board}` },
            { label: data.class?.title ?? "Class", href: `/${board}/${classSlug}` },
            { label: data.subject?.title ?? "Subject", href: `/${board}/${classSlug}/${subject}` },
            { label: data.chapter?.title ?? "Chapter", href: `/${board}/${classSlug}/${subject}/${chapter}` },
            { label: data.exercise?.title ?? "Exercise", href: `/${board}/${classSlug}/${subject}/${chapter}/${exercise}` },
            { label: `Question ${data.question.num}` },
          ]}
        />

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Question {data.question.num}</p>
              <h1 className="mt-3 text-3xl font-black text-slate-900">{data.question.question}</h1>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              {data.question.marks} marks • {data.question.difficulty}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Previous</p>
              <Link href={`/${board}/${classSlug}/${subject}/${chapter}/${exercise}`} className="mt-2 inline-block text-sm font-medium text-slate-700 hover:text-sky-700">
                Back to exercise
              </Link>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">PDF</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{data.question.pdfName}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Next</p>
              <p className="mt-2 text-sm font-medium text-slate-700">Question {Number(questionNum) + 1}</p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {data.question.steps.map((step) => (
              <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-lg font-bold text-slate-900">{step.title}</h2>
                <p className="mt-2 leading-7 text-slate-700">{step.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch {
    notFound();
  }
}
