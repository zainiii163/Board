"use client";

import { useEffect, useMemo, useState } from "react";

import { apiAuthFetch, apiFetch } from "@/lib/api-client";

export type HierarchyValue = {
  boardSlug: string;
  classSlug: string;
  subjectSlug: string;
};

type BoardOption = { slug: string; title: string };
type ClassOption = { id: number; boardSlug: string; slug: string; title: string };
type SubjectOption = {
  id: number;
  boardSlug: string;
  classSlug: string;
  slug: string;
  title: string;
};

type HierarchyPickerProps = {
  value: HierarchyValue;
  onChange: (next: HierarchyValue) => void;
  includeSubject?: boolean;
  disabled?: boolean;
};

const selectClass =
  "w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground disabled:opacity-60";

export function HierarchyPicker({
  value,
  onChange,
  includeSubject = true,
  disabled = false,
}: HierarchyPickerProps) {
  const [boards, setBoards] = useState<BoardOption[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiFetch<BoardOption[]>("/api/boards"),
      apiAuthFetch<ClassOption[]>("/api/classes"),
      includeSubject ? apiAuthFetch<SubjectOption[]>("/api/subjects") : Promise.resolve([] as SubjectOption[]),
    ])
      .then(([boardRows, classRows, subjectRows]) => {
        if (cancelled) return;
        setBoards(boardRows);
        setClasses(classRows);
        setSubjects(subjectRows);
      })
      .catch(() => {
        if (cancelled) return;
        setBoards([]);
        setClasses([]);
        setSubjects([]);
      });
    return () => {
      cancelled = true;
    };
  }, [includeSubject]);

  const classOptions = useMemo(
    () => classes.filter((item) => item.boardSlug === value.boardSlug),
    [classes, value.boardSlug],
  );

  const subjectOptions = useMemo(
    () =>
      subjects.filter(
        (item) => item.boardSlug === value.boardSlug && item.classSlug === value.classSlug,
      ),
    [subjects, value.boardSlug, value.classSlug],
  );

  function pickFirstSubject(boardSlug: string, classSlug: string) {
    if (!includeSubject) return "";
    return subjects.find((s) => s.boardSlug === boardSlug && s.classSlug === classSlug)?.slug ?? "";
  }

  function changeBoard(boardSlug: string) {
    const nextClass = classes.find((c) => c.boardSlug === boardSlug);
    const classSlug = nextClass?.slug ?? "";
    onChange({
      boardSlug,
      classSlug,
      subjectSlug: pickFirstSubject(boardSlug, classSlug),
    });
  }

  function changeClass(classSlug: string) {
    onChange({
      boardSlug: value.boardSlug,
      classSlug,
      subjectSlug: pickFirstSubject(value.boardSlug, classSlug),
    });
  }

  return (
    <div className={`grid gap-3 ${includeSubject ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
      <label className="block text-sm">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Board</span>
        <select
          value={value.boardSlug}
          disabled={disabled || boards.length === 0}
          onChange={(e) => changeBoard(e.target.value)}
          className={selectClass}
          required
        >
          {boards.length === 0 && <option value={value.boardSlug}>Loading boards…</option>}
          {boards.map((board) => (
            <option key={board.slug} value={board.slug}>
              {board.title}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Class</span>
        <select
          value={value.classSlug}
          disabled={disabled || classOptions.length === 0}
          onChange={(e) => changeClass(e.target.value)}
          className={selectClass}
          required
        >
          {classOptions.length === 0 ? (
            <option value="">No classes for this board</option>
          ) : (
            classOptions.map((klass) => (
              <option key={`${klass.boardSlug}-${klass.slug}`} value={klass.slug}>
                {klass.title}
              </option>
            ))
          )}
        </select>
      </label>

      {includeSubject && (
        <label className="block text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Subject</span>
          <select
            value={value.subjectSlug}
            disabled={disabled || subjectOptions.length === 0}
            onChange={(e) => onChange({ ...value, subjectSlug: e.target.value })}
            className={selectClass}
            required
          >
            {subjectOptions.length === 0 ? (
              <option value="">No subjects for this class</option>
            ) : (
              subjectOptions.map((subject) => (
                <option
                  key={`${subject.boardSlug}-${subject.classSlug}-${subject.slug}`}
                  value={subject.slug}
                >
                  {subject.title}
                </option>
              ))
            )}
          </select>
        </label>
      )}
    </div>
  );
}

/** Board-only dropdown for forms that only need a board slug. */
export function BoardSelect({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (boardSlug: string) => void;
  disabled?: boolean;
}) {
  const [boards, setBoards] = useState<BoardOption[]>([]);

  useEffect(() => {
    apiFetch<BoardOption[]>("/api/boards")
      .then(setBoards)
      .catch(() => setBoards([]));
  }, []);

  return (
    <select
      value={value}
      disabled={disabled || boards.length === 0}
      onChange={(e) => onChange(e.target.value)}
      className={selectClass}
      required
    >
      {boards.length === 0 && <option value={value}>Loading boards…</option>}
      {boards.map((board) => (
        <option key={board.slug} value={board.slug}>
          {board.title}
        </option>
      ))}
    </select>
  );
}
