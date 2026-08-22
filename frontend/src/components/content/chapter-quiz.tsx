"use client";

import { useEffect, useState } from "react";

import { MathText } from "@/components/content/math-text";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/locale-context";
import { apiAuthFetch, apiFetch, apiPost } from "@/lib/api-client";
import Link from "next/link";

type QuizQuestion = {
  id: number;
  question: string;
  options: { label: string; text: string }[];
};

type QuizResult = {
  score: number;
  total: number;
  results: { id: number; correct: boolean; selected: string; correctLabel: string; reason: string }[];
};

type ChapterQuizProps = {
  board: string;
  classSlug: string;
  subject: string;
  chapter: string;
  chapterTitle: string;
};

export function ChapterQuiz({ board, classSlug, subject, chapter, chapterTitle }: ChapterQuizProps) {
  const { user } = useAuth();
  const { tr } = useLocale();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch<QuizQuestion[]>(
      `/api/quiz?board=${board}&class=${classSlug}&subject=${subject}&chapter=${chapter}`,
    ).then(setQuestions).catch(() => setQuestions([]));
  }, [board, classSlug, subject, chapter]);

  if (questions.length === 0) return null;

  async function submitQuiz(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiPost<QuizResult>(
        "/api/quiz/submit",
        { chapterKey: `${board}/${classSlug}/${subject}/${chapter}`, answers },
        true,
      );
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-border bg-background p-5">
      <h2 className="text-lg font-bold text-foreground">{tr("practiceQuiz")} — {chapterTitle}</h2>
      <p className="mt-1 text-sm text-muted">{questions.length} {tr("mcqsTimed")}</p>

      {!user ? (
        <p className="mt-4 text-sm text-muted">
          <Link href="/login" className="font-semibold text-accent hover:underline">{tr("signIn")}</Link> {tr("signInToSaveScore")}
        </p>
      ) : result ? (
        <div className="mt-4 space-y-3">
          <p className="text-lg font-bold text-accent">{tr("scoreLabel")} {result.score}/{result.total}</p>
          {result.results.map((r) => (
            <div key={r.id} className={`rounded-xl border p-3 text-sm ${r.correct ? "border-accent/30 bg-accent/10" : "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/30"}`}>
              <p className="font-semibold">{r.correct ? tr("correctAnswer") : `${tr("incorrectAnswer")} ${r.correctLabel}`}</p>
              <p className="mt-1 text-muted"><MathText text={r.reason} /></p>
            </div>
          ))}
          <button type="button" onClick={() => { setResult(null); setAnswers({}); }} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">{tr("tryAgain")}</button>
        </div>
      ) : (
        <form onSubmit={submitQuiz} className="mt-4 space-y-5">
          {questions.map((q, index) => (
            <fieldset key={q.id} className="rounded-xl border border-border bg-card p-4">
              <legend className="px-1 text-sm font-semibold text-foreground">Q{index + 1}. <MathText text={q.question} /></legend>
              <div className="mt-3 space-y-2">
                {q.options.map((opt) => (
                  <label key={opt.label} className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-background">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt.label}
                      checked={answers[q.id] === opt.label}
                      onChange={() => setAnswers({ ...answers, [q.id]: opt.label })}
                      className="mt-1"
                      required
                    />
                    <span className="text-sm"><span className="font-semibold">{opt.label}.</span> <MathText text={opt.text} /></span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <button type="submit" disabled={loading || !user} className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? tr("checking") : user ? tr("submitQuiz") : tr("signInToSubmit")}
          </button>
        </form>
      )}
    </div>
  );
}
