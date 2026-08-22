"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { apiAuthFetch, apiDelete, apiPost } from "@/lib/api-client";
import { HierarchyPicker } from "@/components/admin/hierarchy-picker";
import { useAuth } from "@/lib/auth-context";

type Classroom = {
  id: number;
  name: string;
  joinCode: string;
  boardSlug: string;
  classSlug: string;
  subjectSlug: string;
};

type ClassroomDetail = {
  classroom: Classroom;
  members: { id: number; userId: number; userName: string; joinedAt: string }[];
  assignments: { id: number; title: string; exercisePath: string; dueDate: string | null }[];
  isTeacher: boolean;
};

type ScoreRow = {
  userId: number;
  userName: string;
  chapterKey: string;
  score: number;
  total: number;
  createdAt: string;
};

type Chapter = {
  id: number;
  title: string;
  boardSlug: string;
  classSlug: string;
  subjectSlug: string;
  slug: string;
  status: string;
};

type Exercise = {
  id: number;
  chapterId: number;
  slug: string;
  title: string;
  questionCount: number;
};

const emptyForm = {
  name: "",
  boardSlug: "fbise",
  classSlug: "9",
  subjectSlug: "mathematics",
};

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? "");
          return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function ClassroomPage() {
  const { user, isTeacher, isEditor } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<ClassroomDetail | null>(null);
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [chapterId, setChapterId] = useState<number | "">("");
  const [exerciseId, setExerciseId] = useState<number | "">("");
  const [dueDate, setDueDate] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const canManageClassroom = isTeacher || isEditor || user?.role === "admin";

  const classroomChapters = useMemo(() => {
    if (!detail) return [];
    const { boardSlug, classSlug, subjectSlug } = detail.classroom;
    return chapters.filter(
      (c) =>
        c.boardSlug === boardSlug &&
        c.classSlug === classSlug &&
        c.subjectSlug === subjectSlug &&
        c.status === "published",
    );
  }, [chapters, detail]);

  const scoreSummary = useMemo(() => {
    if (scores.length === 0) return null;
    const uniqueStudents = new Set(scores.map((s) => s.userId)).size;
    const avgPercent =
      scores.reduce((sum, row) => sum + (row.total > 0 ? (row.score / row.total) * 100 : 0), 0) /
      scores.length;
    return {
      attempts: scores.length,
      uniqueStudents,
      avgPercent: Math.round(avgPercent),
    };
  }, [scores]);

  async function loadClassrooms() {
    const data = await apiAuthFetch<Classroom[]>("/api/classrooms/mine");
    setClassrooms(data);
    return data;
  }

  async function loadDetail(id: number) {
    const data = await apiAuthFetch<ClassroomDetail>(`/api/classrooms/${id}`);
    setDetail(data);
    setSelectedId(id);
    setChapterId("");
    setExerciseId("");
    setExercises([]);
    setDueDate("");
    if (data.isTeacher) {
      const scoreRows = await apiAuthFetch<ScoreRow[]>(`/api/classrooms/${id}/scores`);
      setScores(scoreRows);
    } else {
      setScores([]);
    }
  }

  useEffect(() => {
    loadClassrooms()
      .then((rooms) => {
        if (rooms[0]) return loadDetail(rooms[0].id);
      })
      .catch(() => setClassrooms([]));
    apiAuthFetch<Chapter[]>("/api/chapters").then(setChapters).catch(() => setChapters([]));
  }, []);

  useEffect(() => {
    if (!chapterId) {
      setExercises([]);
      setExerciseId("");
      return;
    }
    apiAuthFetch<Exercise[]>(`/api/exercises?chapterId=${chapterId}`)
      .then((rows) => {
        setExercises(rows);
        setExerciseId(rows[0]?.id ?? "");
      })
      .catch(() => {
        setExercises([]);
        setExerciseId("");
      });
  }, [chapterId]);

  async function createClassroom(e: React.FormEvent) {
    e.preventDefault();
    const created = await apiPost<Classroom>("/api/classrooms", form, true);
    setForm(emptyForm);
    const rooms = await loadClassrooms();
    const next = rooms.find((r) => r.id === created.id) ?? rooms[0];
    if (next) await loadDetail(next.id);
  }

  async function addAssignment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !detail || !chapterId || !exerciseId) return;
    const chapter = classroomChapters.find((c) => c.id === chapterId);
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!chapter || !exercise) return;

    const exercisePath = `/${chapter.boardSlug}/${chapter.classSlug}/${chapter.subjectSlug}/${chapter.slug}/${exercise.slug}`;
    await apiPost(
      `/api/classrooms/${selectedId}/assignments`,
      {
        title: `${chapter.title} — ${exercise.title}`,
        exercisePath,
        dueDate: dueDate || undefined,
      },
      true,
    );
    setDueDate("");
    await loadDetail(selectedId);
  }

  async function removeAssignment(assignmentId: number) {
    if (!selectedId) return;
    await apiDelete(`/api/classrooms/${selectedId}/assignments/${assignmentId}`);
    await loadDetail(selectedId);
  }

  async function copyJoinCode() {
    if (!detail) return;
    try {
      await navigator.clipboard.writeText(detail.classroom.joinCode);
      setCopyMessage("Join code copied.");
    } catch {
      setCopyMessage(detail.classroom.joinCode);
    }
    window.setTimeout(() => setCopyMessage(""), 2000);
  }

  function exportScores() {
    if (!detail || scores.length === 0) return;
    downloadCsv(`${detail.classroom.joinCode}-quiz-scores.csv`, [
      ["Student", "Chapter", "Score", "Total", "Percent", "Submitted"],
      ...scores.map((row) => [
        row.userName,
        row.chapterKey,
        String(row.score),
        String(row.total),
        row.total > 0 ? String(Math.round((row.score / row.total) * 100)) : "0",
        new Date(row.createdAt).toISOString(),
      ]),
    ]);
  }

  if (!canManageClassroom && user?.role === "student") {
    return (
      <div>
        <h1 className="font-serif text-3xl font-black text-foreground">My classroom</h1>
        <p className="mt-2 text-muted">Join a class from your account page using the teacher&apos;s class code.</p>
        <Link href="/account" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
          Go to account →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Teacher tools</p>
      <h1 className="mt-2 font-serif text-3xl font-black text-foreground">Classroom</h1>
      <p className="mt-2 text-muted">
        Create a class, share the join code, assign published exercises with due dates, and export quiz scores.
      </p>

      <form onSubmit={createClassroom} className="mt-8 space-y-3 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-bold text-foreground">Create classroom</h2>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Class name (e.g. Section A)"
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          required
        />
        <HierarchyPicker
          value={{ boardSlug: form.boardSlug, classSlug: form.classSlug, subjectSlug: form.subjectSlug }}
          onChange={(next) => setForm({ ...form, ...next })}
        />
        <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
          Create classroom
        </button>
      </form>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Your classrooms</h2>
          {classrooms.length === 0 && <p className="text-sm text-muted">No classrooms yet.</p>}
          {classrooms.map((room) => (
            <button
              key={room.id}
              type="button"
              onClick={() => loadDetail(room.id)}
              className={`block w-full rounded-2xl border p-4 text-left transition ${
                selectedId === room.id
                  ? "border-accent bg-accent/10"
                  : "border-border bg-card hover:border-accent/40"
              }`}
            >
              <p className="font-semibold text-foreground">{room.name}</p>
              <p className="mt-1 text-xs text-muted">
                {room.boardSlug}/{room.classSlug}/{room.subjectSlug}
              </p>
              <p className="mt-2 text-sm font-bold tracking-[0.2em] text-accent">{room.joinCode}</p>
            </button>
          ))}
        </div>

        {detail && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">{detail.classroom.name}</h2>
                <p className="mt-1 text-xs text-muted">
                  {detail.classroom.boardSlug} → {detail.classroom.classSlug} → {detail.classroom.subjectSlug}
                </p>
              </div>
              <button
                type="button"
                onClick={copyJoinCode}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
              >
                Copy join code
              </button>
            </div>

            <p className="mt-3 text-sm text-muted">
              Share this code with students:{" "}
              <span className="rounded-full bg-accent/15 px-3 py-1 font-bold tracking-[0.18em] text-accent">
                {detail.classroom.joinCode}
              </span>
            </p>
            {copyMessage && <p className="mt-2 text-sm text-accent">{copyMessage}</p>}

            <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-accent">
              Students ({detail.members.length})
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-foreground">
              {detail.members.length === 0 && <li className="text-muted">No students joined yet.</li>}
              {detail.members.map((member) => (
                <li key={member.id} className="flex items-center justify-between gap-2">
                  <span>{member.userName}</span>
                  <span className="text-xs text-muted">
                    joined {new Date(member.joinedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-accent">Assignments</h3>
            <div className="mt-2 space-y-2">
              {detail.assignments.length === 0 && (
                <p className="text-sm text-muted">No assignments yet. Pick a published exercise below.</p>
              )}
              {detail.assignments.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2"
                >
                  <div>
                    <Link href={item.exercisePath} className="font-semibold text-accent hover:underline">
                      {item.title}
                    </Link>
                    <p className="text-xs text-muted">{item.exercisePath}</p>
                    {item.dueDate && (
                      <p className="mt-1 text-xs font-semibold text-foreground">
                        Due {new Date(item.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {detail.isTeacher && (
                    <button
                      type="button"
                      onClick={() => removeAssignment(item.id)}
                      className="text-xs font-semibold text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {detail.isTeacher && (
              <form onSubmit={addAssignment} className="mt-4 space-y-2 rounded-xl border border-border bg-background p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Assign exercise</p>
                <select
                  value={chapterId}
                  onChange={(e) => setChapterId(Number(e.target.value) || "")}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
                  required
                >
                  <option value="">Choose chapter…</option>
                  {classroomChapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
                {classroomChapters.length === 0 && (
                  <p className="text-xs text-muted">
                    No published chapters for this board/class/subject yet. Publish content first.
                  </p>
                )}
                <select
                  value={exerciseId}
                  onChange={(e) => setExerciseId(Number(e.target.value) || "")}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
                  required
                  disabled={!chapterId || exercises.length === 0}
                >
                  <option value="">Choose exercise…</option>
                  {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.title} ({exercise.questionCount} questions)
                    </option>
                  ))}
                </select>
                <label className="block text-xs text-muted">
                  Due date (optional)
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
                  />
                </label>
                <button
                  type="submit"
                  disabled={!chapterId || !exerciseId}
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  Add assignment
                </button>
              </form>
            )}

            {detail.isTeacher && (
              <>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-accent">Quiz scores</h3>
                  <button
                    type="button"
                    onClick={exportScores}
                    disabled={scores.length === 0}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                  >
                    Export CSV
                  </button>
                </div>
                {scoreSummary && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-border bg-background px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wide text-muted">Attempts</p>
                      <p className="text-lg font-black text-foreground">{scoreSummary.attempts}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wide text-muted">Students</p>
                      <p className="text-lg font-black text-foreground">{scoreSummary.uniqueStudents}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wide text-muted">Avg %</p>
                      <p className="text-lg font-black text-foreground">{scoreSummary.avgPercent}%</p>
                    </div>
                  </div>
                )}
                <div className="mt-2 space-y-2">
                  {scores.length === 0 && (
                    <p className="text-sm text-muted">No quiz scores from students yet.</p>
                  )}
                  {scores.map((row) => (
                    <div
                      key={`${row.userId}-${row.chapterKey}-${row.createdAt}`}
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                    >
                      <p className="font-semibold text-foreground">{row.userName}</p>
                      <p className="text-accent">
                        {row.score}/{row.total}
                        {row.total > 0 ? ` (${Math.round((row.score / row.total) * 100)}%)` : ""} —{" "}
                        {row.chapterKey.replace(/\//g, " → ")}
                      </p>
                      <p className="text-xs text-muted">{new Date(row.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
