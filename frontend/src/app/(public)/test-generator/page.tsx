"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { apiPost, apiFetch } from "@/lib/api-client";
import { NAV_BOARDS, NAV_CLASSES } from "@/lib/constants";
import { useLocale } from "@/lib/locale-context";

type MCQ = {
  id: number;
  question: string;
  options: { label: string; text: string }[];
  correctLabel: string;
  reason: string;
  chapterKey: string;
};

type GenerateResponse = {
  test: { mcqs: MCQ[]; timeMinutes: number };
};

type Subject = { slug: string; title: string };
type Chapter = { slug: string; title: string };

type ResultItem = {
  id: number;
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  reason: string;
};

type SubmitResponse = {
  score: number;
  total: number;
  results: ResultItem[];
};

type Phase = "config" | "test" | "results";

const selectClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-accent";
const labelClass = "mb-2 block text-sm font-medium text-foreground";

export default function TestGeneratorPage() {
  const { tr } = useLocale();

  const [phase, setPhase] = useState<Phase>("config");

  const [board, setBoard] = useState<string>(NAV_BOARDS[0].slug);
  const [classSlug, setClassSlug] = useState<string>("9");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subject, setSubject] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [mcqCount, setMcqCount] = useState<number>(10);

  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [timeMinutes, setTimeMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const [results, setResults] = useState<ResultItem[] | null>(null);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!board || !classSlug) {
      setSubjects([]);
      setSubject("");
      setChapters([]);
      setSelectedChapters([]);
      return;
    }
    let cancelled = false;
    setLoadingSubjects(true);
    apiFetch<Subject[]>(`/api/subjects?board=${board}&class=${classSlug}`)
      .then((data) => {
        if (cancelled) return;
        setSubjects(data);
        setSubject("");
        setChapters([]);
        setSelectedChapters([]);
      })
      .catch(() => {
        if (cancelled) return;
        setSubjects([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSubjects(false);
      });
    return () => { cancelled = true; };
  }, [board, classSlug]);

  useEffect(() => {
    if (!board || !classSlug || !subject) {
      setChapters([]);
      setSelectedChapters([]);
      return;
    }
    let cancelled = false;
    setLoadingChapters(true);
    apiFetch<Chapter[]>(`/api/chapters?board=${board}&class=${classSlug}&subject=${subject}`)
      .then((data) => {
        if (cancelled) return;
        setChapters(data);
        setSelectedChapters([]);
      })
      .catch(() => {
        if (cancelled) return;
        setChapters([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingChapters(false);
      });
    return () => { cancelled = true; };
  }, [board, classSlug, subject]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    if (phase !== "test") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearTimer();
  }, [phase, clearTimer]);

  function toggleChapter(slug: string) {
    setSelectedChapters((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function handleGenerate() {
    setError("");
    if (selectedChapters.length === 0) {
      setError("Select at least one chapter");
      return;
    }
    setGenerating(true);
    try {
      const res = await apiPost<GenerateResponse>("/api/test-generator/generate", {
        board,
        classSlug,
        subject,
        chapterSlugs: selectedChapters,
        mcqCount,
      });
      setMcqs(res.test.mcqs);
      setTimeMinutes(res.test.timeMinutes);
      setTimeLeft(res.test.timeMinutes * 60);
      setCurrentQ(0);
      setAnswers({});
      setResults(null);
      setPhase("test");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate test");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmitTest() {
    clearTimer();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await apiPost<SubmitResponse>("/api/quiz/submit", {
        chapterKey: selectedChapters[0],
        answers: Object.fromEntries(
          mcqs.map((mcq) => [mcq.id, answers[mcq.id] ?? ""])
        ),
      }, true);
      setScore(res.score);
      setResults(res.results);
      setPhase("results");
    } catch {
      setResults(
        mcqs.map((mcq) => ({
          id: mcq.id,
          correct: (answers[mcq.id] ?? "") === mcq.correctLabel,
          userAnswer: answers[mcq.id] ?? "",
          correctAnswer: mcq.correctLabel,
          reason: mcq.reason,
        }))
      );
      const correctCount = mcqs.filter((mcq) => (answers[mcq.id] ?? "") === mcq.correctLabel).length;
      setScore(correctCount);
      setPhase("results");
    } finally {
      setSubmitting(false);
    }
  }

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  const answeredCount = Object.keys(answers).length;
  const progress = mcqs.length > 0 ? (answeredCount / mcqs.length) * 100 : 0;

  if (phase === "config") {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 p-6 text-white sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-100">Test Generator</p>
            <h1 className="mt-2 font-serif text-3xl font-black">Create Your Test</h1>
            <p className="mt-2 max-w-2xl text-teal-100">
              Choose your board, class, subject and chapters to generate a customized MCQ test.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Board</label>
              <select value={board} onChange={(e) => setBoard(e.target.value)} className={selectClass}>
                {NAV_BOARDS.map((b) => (
                  <option key={b.slug} value={b.slug}>{b.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Class</label>
              <select value={classSlug} onChange={(e) => setClassSlug(e.target.value)} className={selectClass}>
                {NAV_CLASSES.map((c) => (
                  <option key={c} value={String(c)}>Class {c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={selectClass}
                disabled={loadingSubjects}
              >
                <option value="">{loadingSubjects ? "Loading..." : "Select subject"}</option>
                {subjects.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Number of MCQs</label>
              <select value={mcqCount} onChange={(e) => setMcqCount(Number(e.target.value))} className={selectClass}>
                {[5, 10, 15, 20, 25, 30].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {subject && (
            <div className="mt-6">
              <label className={labelClass}>Chapters</label>
              {loadingChapters ? (
                <p className="text-sm text-muted">Loading chapters...</p>
              ) : chapters.length === 0 ? (
                <p className="text-sm text-muted">No chapters available</p>
              ) : (
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {chapters.map((ch) => (
                    <label
                      key={ch.slug}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                        selectedChapters.includes(ch.slug)
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border bg-background text-foreground hover:border-accent/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedChapters.includes(ch.slug)}
                        onChange={() => toggleChapter(ch.slug)}
                        className="h-4 w-4 rounded border-border text-accent accent-accent"
                      />
                      <span className="text-sm font-medium">{ch.title}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            onClick={handleGenerate}
            disabled={generating || selectedChapters.length === 0}
            className="mt-6 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {generating ? "Generating..." : "Generate Test"}
          </button>
        </div>
      </section>
    );
  }

  if (phase === "test") {
    const mcq = mcqs[currentQ];
    const timePercent = timeMinutes > 0 ? (timeLeft / (timeMinutes * 60)) * 100 : 0;
    const timerColor = timeLeft <= 60 ? "text-red-600" : timeLeft <= 300 ? "text-amber-500" : "text-foreground";

    return (
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="sticky top-0 z-10 -mx-4 rounded-b-2xl border-b border-border bg-card px-4 py-3 shadow-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex items-center justify-between">
            <div className={`font-mono text-2xl font-bold ${timerColor}`}>
              {formatTime(timeLeft)}
            </div>
            <span className="text-sm font-medium text-muted">
              {answeredCount}/{mcqs.length} answered
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {mcqs.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`h-8 w-8 rounded-full text-xs font-bold transition-colors ${
                  i === currentQ
                    ? "bg-accent text-white"
                    : answers[mcqs[i].id]
                      ? "bg-accent/20 text-accent"
                      : "bg-background text-muted hover:bg-accent/10"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Question {currentQ + 1} of {mcqs.length}
          </p>
          <p className="mt-3 text-lg font-medium text-foreground">{mcq.question}</p>

          <div className="mt-5 space-y-3">
            {mcq.options.map((opt) => (
              <label
                key={opt.label}
                className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
                  answers[mcq.id] === opt.label
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-background text-foreground hover:border-accent/50"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${mcq.id}`}
                  value={opt.label}
                  checked={answers[mcq.id] === opt.label}
                  onChange={() => setAnswers((prev) => ({ ...prev, [mcq.id]: opt.label }))}
                  className="h-4 w-4 border-border text-accent accent-accent"
                />
                <span className="text-sm font-semibold">{opt.label}.</span>
                <span className="text-sm">{opt.text}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
              disabled={currentQ === 0}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-card disabled:opacity-40"
            >
              Previous
            </button>
            {currentQ < mcqs.length - 1 ? (
              <button
                onClick={() => setCurrentQ((p) => p + 1)}
                className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Test"}
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  const pct = mcqs.length > 0 ? Math.round((score / mcqs.length) * 100) : 0;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 p-6 text-center text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-100">Results</p>
          <h1 className="mt-2 font-serif text-5xl font-black">{score}/{mcqs.length}</h1>
          <p className="mt-2 text-teal-100">
            {pct >= 80 ? "Excellent work!" : pct >= 50 ? "Good effort!" : "Keep practicing!"}
          </p>
          <div className="mx-auto mt-4 h-3 w-48 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-bold">{pct}%</p>
        </div>

        <div className="mt-8 space-y-4">
          {mcqs.map((mcq, i) => {
            const r = results?.find((x) => x.id === mcq.id);
            const isCorrect = r?.correct ?? false;
            return (
              <div
                key={mcq.id}
                className={`rounded-2xl border p-5 ${
                  isCorrect
                    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                    : "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                    isCorrect ? "bg-emerald-500" : "bg-red-500"
                  }`}>
                    {isCorrect ? "\u2713" : "\u2717"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-muted">Question {i + 1}</p>
                    <p className="mt-1 text-foreground">{mcq.question}</p>
                    <div className="mt-3 space-y-1.5 text-sm">
                      {mcq.options.map((opt) => {
                        const isUserAnswer = (r?.userAnswer ?? "") === opt.label;
                        const isCorrectOpt = opt.label === mcq.correctLabel;
                        return (
                          <div
                            key={opt.label}
                            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${
                              isCorrectOpt
                                ? "bg-emerald-100 font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                                : isUserAnswer && !isCorrectOpt
                                  ? "bg-red-100 text-red-700 line-through dark:bg-red-900/40 dark:text-red-300"
                                  : "text-foreground"
                            }`}
                          >
                            <span className="font-semibold">{opt.label}.</span>
                            <span>{opt.text}</span>
                            {isCorrectOpt && <span className="ml-auto text-xs font-bold">Correct</span>}
                            {isUserAnswer && !isCorrectOpt && <span className="ml-auto text-xs">Your answer</span>}
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-sm text-muted">{mcq.reason}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            setPhase("config");
            setResults(null);
            setMcqs([]);
            setAnswers({});
          }}
          className="mt-8 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}
