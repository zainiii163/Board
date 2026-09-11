"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AccountGuard } from "@/components/auth/account-guard";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/locale-context";
import { apiAuthFetch, apiDelete, apiPatch, apiPost, apiPut } from "@/lib/api-client";
import type { Bookmark } from "@/lib/shared-types";

type Classroom = {
  id: number;
  name: string;
  joinCode: string;
};

type ClassroomDetail = {
  classroom: Classroom;
  assignments: { id: number; title: string; exercisePath: string; dueDate?: string | null }[];
};

type QuizScore = { id: number; chapterKey: string; score: number; total: number; createdAt: string };
type ProgressEntry = {
  subjectKey: string;
  subjectLabel: string;
  percent: number;
  visitedChapters: string[];
  totalChapters: number;
  lastPath: string;
};

const LAST_PATH_KEY = "boardnotes_last_path";

export default function AccountPage() {
  return (
    <AccountGuard>
      <AccountContent />
    </AccountGuard>
  );
}

function AccountContent() {
  const { user, signOut, isStaff, isTeacher, refreshUser } = useAuth();
  const { tr } = useLocale();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [quizScores, setQuizScores] = useState<QuizScore[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [lastPath, setLastPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [classroomDetails, setClassroomDetails] = useState<ClassroomDetail[]>([]);
  const [emailUpdates, setEmailUpdates] = useState(Boolean(user?.emailUpdates));
  const [prefMessage, setPrefMessage] = useState("");
  const [prefSaving, setPrefSaving] = useState(false);

  useEffect(() => {
    setEmailUpdates(Boolean(user?.emailUpdates));
  }, [user?.emailUpdates]);

  async function loadClassrooms() {
    const rooms = await apiAuthFetch<Classroom[]>("/api/classrooms/mine");
    setClassrooms(rooms);
    const details = await Promise.all(
      rooms.map((room) => apiAuthFetch<ClassroomDetail>(`/api/classrooms/${room.id}`)),
    );
    setClassroomDetails(details);
  }

  useEffect(() => {
    setLastPath(localStorage.getItem(LAST_PATH_KEY));
    apiAuthFetch<Bookmark[]>("/api/bookmarks")
      .then(setBookmarks)
      .finally(() => setLoading(false));
    apiAuthFetch<QuizScore[]>("/api/quiz/scores").then(setQuizScores).catch(() => setQuizScores([]));
    apiAuthFetch<ProgressEntry[]>("/api/progress").then(setProgress).catch(() => setProgress([]));
    loadClassrooms().catch(() => {
      setClassrooms([]);
      setClassroomDetails([]);
    });
  }, []);

  async function joinClassroom(e: React.FormEvent) {
    e.preventDefault();
    setJoinMessage("");
    try {
      await apiPost("/api/classrooms/join", { joinCode }, true);
      setJoinCode("");
      setJoinMessage("Joined classroom successfully.");
      await loadClassrooms();
    } catch (err) {
      setJoinMessage(err instanceof Error ? err.message : "Could not join classroom.");
    }
  }

  async function toggleEmailUpdates(next: boolean) {
    setPrefSaving(true);
    setPrefMessage("");
    try {
      await apiPatch<{ user: { emailUpdates?: boolean } }>("/api/auth/preferences", { emailUpdates: next });
      setEmailUpdates(next);
      await refreshUser();
      setPrefMessage(next ? tr("emailUpdatesOn") : tr("emailUpdatesOff"));
    } catch (err) {
      setPrefMessage(err instanceof Error ? err.message : "Could not update preference.");
    } finally {
      setPrefSaving(false);
    }
  }

  async function removeBookmark(id: number) {
    await apiDelete(`/api/bookmarks/${id}`);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{tr("myAccount")}</p>
            <h1 className="mt-2 font-serif text-3xl font-black text-foreground">{user?.name}</h1>
            <p className="mt-1 text-sm text-muted">{user?.email}</p>
            <span className="mt-3 inline-block rounded-full bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
              {user?.role}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {isStaff && (
              <Link
                href="/admin"
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-background"
              >
                {tr("adminPanel")}
              </Link>
            )}
            {isTeacher && (
              <Link href="/admin/classroom" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-background">
                Classroom
              </Link>
            )}
            <button
              type="button"
              onClick={signOut}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              {tr("signOut")}
            </button>
          </div>
        </div>

        {lastPath && (
          <div className="mt-8 rounded-2xl border border-border bg-background p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{tr("continueReading")}</p>
            <Link href={lastPath} className="mt-2 inline-block text-lg font-bold text-accent hover:underline">
              {tr("resumeReading")}
            </Link>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-border bg-background p-5">
          <h2 className="text-xl font-bold text-foreground">{tr("emailUpdatesTitle")}</h2>
          <p className="mt-1 text-sm text-muted">{tr("emailUpdatesHint")}</p>
          <label className="mt-4 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={emailUpdates}
              disabled={prefSaving}
              onChange={(e) => toggleEmailUpdates(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--accent)]"
            />
            <span className="text-sm text-foreground">{tr("emailUpdatesLabel")}</span>
          </label>
          {prefMessage && <p className="mt-2 text-sm text-accent">{prefMessage}</p>}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-background p-5">
          <h2 className="text-xl font-bold text-foreground">My classroom</h2>
          <p className="mt-1 text-sm text-muted">Enter your teacher&apos;s class code to see assigned exercises.</p>
          <form onSubmit={joinClassroom} className="mt-4 flex flex-wrap gap-2">
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Class code (e.g. FB9MAT)"
              className="min-w-[180px] flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold tracking-[0.16em] text-foreground"
            />
            <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
              Join class
            </button>
          </form>
          {joinMessage && <p className="mt-2 text-sm text-accent">{joinMessage}</p>}

          <div className="mt-4 space-y-4">
            {classrooms.length === 0 ? (
              <p className="text-sm text-muted">You have not joined a classroom yet.</p>
            ) : (
              classroomDetails.map((entry) => (
                <div key={entry.classroom.id} className="rounded-xl border border-border bg-card px-4 py-3">
                  <p className="font-semibold text-foreground">{entry.classroom.name}</p>
                  <p className="text-xs text-muted">Code: {entry.classroom.joinCode}</p>
                  {entry.assignments.length === 0 ? (
                    <p className="mt-2 text-sm text-muted">No assignments yet.</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {entry.assignments.map((assignment) => (
                        <li key={assignment.id}>
                          <Link href={assignment.exercisePath} className="text-sm font-semibold text-accent hover:underline">
                            {assignment.title}
                          </Link>
                          {assignment.dueDate && (
                            <p className="text-xs text-muted">Due {new Date(assignment.dueDate).toLocaleDateString()}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">{tr("savedBookmarks")}</h2>
            <Link href="/fbise/9/mathematics" className="text-sm font-semibold text-accent hover:underline">
              {tr("browseNotes")}
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-muted">{tr("loadingBookmarks")}</p>
          ) : bookmarks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted">
              {tr("noBookmarks")}
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <Link href={bookmark.path} className="font-semibold text-foreground hover:text-accent">
                      {bookmark.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted">{bookmark.path}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBookmark(bookmark.id)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:bg-card"
                  >
                    {tr("remove")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-foreground">{tr("subjectProgress")}</h2>
          {progress.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted">
              {tr("noProgress")}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {progress.map((p) => (
                <div key={p.subjectKey} className="rounded-xl border border-border bg-background px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <Link href={p.lastPath} className="font-semibold text-foreground hover:text-accent">{p.subjectLabel}</Link>
                    <span className="text-sm font-semibold text-accent">{p.percent}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/60">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${p.percent}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted">{p.visitedChapters.length} {tr("chaptersVisited")} {p.totalChapters} {tr("chaptersLabel")}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-foreground">{tr("quizScores")}</h2>
          {quizScores.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted">
              {tr("noQuizScores")}
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {quizScores.map((s) => (
                <div key={s.id} className="rounded-xl border border-border bg-background px-4 py-3 text-sm">
                  <p className="font-semibold text-foreground">{s.chapterKey.replace(/\//g, " → ")}</p>
                  <p className="text-accent">{s.score}/{s.total} {tr("correct")}</p>
                  <p className="text-xs text-muted">{new Date(s.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
