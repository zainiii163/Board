"use client";

import { useEffect, useState } from "react";

import { useLocale } from "@/lib/locale-context";

type Exam = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  classSlug: string;
  classTitle: string;
  title: string;
  examDate: string;
};

function formatCountdown(examDate: string, locale: string) {
  const target = new Date(examDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (locale === "ur") {
    return `${days} دن ${hours} گھنٹے`;
  }
  return `${days} days ${hours} hrs`;
}

export function ExamCountdown({ exams }: { exams: Exam[] }) {
  const { tr, locale } = useLocale();
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (exams.length === 0) return null;

  const nextExam = exams[0];

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-widest text-accent">{tr("examCountdown")}</p>
      <h2 className="mt-2 font-serif text-2xl font-bold text-foreground">{nextExam.title}</h2>
      <p className="mt-2 text-sm text-muted">
        {nextExam.boardTitle} • {nextExam.classTitle}
      </p>
      <p className="mt-4 text-3xl font-black text-accent" suppressHydrationWarning>
        {now > 0 ? formatCountdown(nextExam.examDate, locale) : "—"}
      </p>
      <p className="mt-1 text-xs text-muted">{tr("untilExam")}</p>
      {exams.length > 1 && (
        <ul className="mt-4 space-y-2 border-t border-border pt-4 text-sm text-muted">
          {exams.slice(1, 3).map((exam) => (
            <li key={exam.id}>
              {exam.classTitle}: {formatCountdown(exam.examDate, locale)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
