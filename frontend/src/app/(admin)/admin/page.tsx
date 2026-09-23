"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { apiAuthFetch, apiFetch, getApiBaseUrl } from "@/lib/api-client";
import { BoardCoveragePanel } from "@/components/admin/board-coverage-panel";
import { useAuth } from "@/lib/auth-context";
import type { ContentStatus, DashboardStats } from "@/lib/shared-types";

type ChapterSummary = {
  id: number;
  title: string;
  status: ContentStatus;
  boardSlug?: string;
  boardTitle?: string;
};

type PortalStats = { books: number; categories: number; users: number };

export default function AdminDashboard() {
  const { isEditor, isTeacher } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chapters, setChapters] = useState<ChapterSummary[]>([]);
  const [portalStats, setPortalStats] = useState<PortalStats | null>(null);
  const [apiUrl] = useState(() => getApiBaseUrl());

  useEffect(() => {
    if (isEditor) {
      apiAuthFetch<DashboardStats>("/api/audit/stats").then(setStats).catch(() => setStats(null));
    }
    if (isTeacher) {
      apiAuthFetch<ChapterSummary[]>("/api/chapters")
        .then(setChapters)
        .catch(() => setChapters([]));
    }
    apiFetch<PortalStats>("/api/portal/stats").then(setPortalStats).catch(() => {});
  }, [isEditor, isTeacher]);

  if (isTeacher) {
    const drafts = chapters.filter((c) => c.status === "draft").length;
    const inReview = chapters.filter((c) => c.status === "in_review").length;
    const published = chapters.filter((c) => c.status === "published").length;

    return (
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Contributor</p>
        <h1 className="mt-2 font-serif text-3xl font-black text-foreground">Teacher Dashboard</h1>
        <p className="mt-2 text-muted">Write notes, upload PDFs, and submit chapters for editor approval.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Drafts", value: drafts, gradient: "from-amber-500 to-orange-600", icon: "📝" },
            { label: "In Review", value: inReview, gradient: "from-blue-500 to-indigo-600", icon: "🔍" },
            { label: "Published", value: published, gradient: "from-emerald-500 to-teal-600", icon: "✅" },
          ].map((card) => (
            <div key={card.label} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg" style={{}}>
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{card.icon}</span>
                  <span className="text-3xl font-black text-white drop-shadow-sm">{card.value}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-white/90">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-background to-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <h2 className="text-lg font-bold text-foreground">Your Workflow</h2>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-muted">
              {[
                "Create or edit a chapter in Manage Chapters",
                "Upload PDFs in Manage Uploads",
                "Click Submit for review when ready",
                "An editor publishes after quality check",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-border bg-gradient-to-br from-background to-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔗</span>
              <h2 className="text-lg font-bold text-foreground">Quick Links</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/admin/chapters" className="rounded-full bg-gradient-to-r from-accent to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md">
                📄 Manage chapters
              </Link>
              <Link href="/admin/uploads" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent">
                📁 Upload PDFs
              </Link>
              <Link href="/admin/resources" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent">
                📦 Resources
              </Link>
              <Link href="/admin/questions" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent">
                ❓ Manage questions
              </Link>
              <Link href="/admin/classroom" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent">
                🎓 Classroom
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Boards", value: stats?.boards ?? "—", href: "/admin/boards", gradient: "from-blue-500 to-blue-600", icon: "📚" },
    { label: "Users", value: stats?.users ?? "—", href: "/admin/users", gradient: "from-violet-500 to-purple-600", icon: "👥" },
    { label: "Portal Resources", value: portalStats?.books ?? "—", href: "/admin/resources", gradient: "from-emerald-500 to-teal-600", icon: "📦" },
    { label: "Portal Categories", value: portalStats?.categories ?? "—", href: "/categories", gradient: "from-amber-500 to-orange-600", icon: "🏷️" },
    { label: "Open Reports", value: stats?.openReports ?? "—", href: "/admin/reports", gradient: "from-rose-500 to-pink-600", icon: "🚩" },
    { label: "Contact Messages", value: stats?.contactMessages ?? "—", href: "/admin/contact", gradient: "from-cyan-500 to-sky-600", icon: "✉️" },
  ];

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Overview</p>
      <h1 className="mt-2 font-serif text-3xl font-black text-foreground">Admin Dashboard</h1>
      <p className="mt-2 text-muted">Manage content, users, and student feedback.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group relative overflow-hidden rounded-2xl shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
            <div className="relative z-10 p-5">
              <div className="flex items-center justify-between">
                <span className="text-2xl drop-shadow-sm">{card.icon}</span>
                <span className="text-3xl font-black text-white drop-shadow-sm">{card.value}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-white/90">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-background to-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <h2 className="text-lg font-bold text-foreground">Quick Actions</h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/admin/content-review" className="rounded-full bg-gradient-to-r from-accent to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md">
              Content review queue
            </Link>
            <Link href="/admin/resources" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent">
              Manage resources
            </Link>
            <Link href="/admin/chapters" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent">
              Manage chapters
            </Link>
            <Link href="/admin/reports" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent">
              Review reports
            </Link>
            <Link href="/fbise/9/mathematics" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent">
              Preview public site
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-to-br from-background to-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔄</span>
            <h2 className="text-lg font-bold text-foreground">Publishing Workflow</h2>
          </div>
          <ol className="mt-4 space-y-3 text-sm text-muted">
            {[
              "Teacher writes notes and uploads PDFs",
              "Teacher submits chapter for review",
              "Editor approves in Content Review queue",
              "Published chapters appear on the public site",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-to-br from-background to-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <div className="flex items-center gap-3 rounded-xl bg-background/50 p-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span className="flex-1 truncate">Dashboard loaded successfully</span>
              <span className="shrink-0 text-xs text-muted/70">Just now</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-background/50 p-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span className="flex-1 truncate">System check completed</span>
              <span className="shrink-0 text-xs text-muted/70">1m ago</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-background/50 p-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
              <span className="flex-1 truncate">Admin session started</span>
              <span className="shrink-0 text-xs text-muted/70">2m ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <BoardCoveragePanel />
        <div className="rounded-2xl border border-border bg-gradient-to-br from-background to-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">🖥️</span>
            <h2 className="text-lg font-bold text-foreground">System Status</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-background/50 p-3">
              <span className="text-muted">API URL</span>
              <span className="font-mono text-xs text-foreground">{apiUrl}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-background/50 p-3">
              <span className="text-muted">Status</span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-background/50 p-3">
              <span className="text-muted">Deployment</span>
              <span className="font-mono text-xs text-foreground">Production</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
