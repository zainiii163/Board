"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { apiAuthFetch, apiFetch } from "@/lib/api-client";
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
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted">Drafts</p>
            <p className="mt-2 text-3xl font-black text-foreground">{drafts}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted">In review</p>
            <p className="mt-2 text-3xl font-black text-foreground">{inReview}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted">Published</p>
            <p className="mt-2 text-3xl font-black text-foreground">{published}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-foreground">Your workflow</h2>
            <ol className="mt-4 space-y-2 text-sm text-muted">
              <li>1. Create or edit a chapter in Manage Chapters</li>
              <li>2. Upload PDFs in Manage Uploads</li>
              <li>3. Click Submit for review when ready</li>
              <li>4. An editor publishes after quality check</li>
            </ol>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-foreground">Quick links</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/admin/chapters" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
                Manage chapters
              </Link>
              <Link href="/admin/uploads" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
                Upload PDFs
              </Link>
              <Link href="/admin/resources" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
                Resources
              </Link>
              <Link href="/admin/questions" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
                Manage questions
              </Link>
              <Link href="/admin/classroom" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
                Classroom
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Boards", value: stats?.boards ?? "—", href: "/admin/boards" },
    { label: "Users", value: stats?.users ?? "—", href: "/admin/users" },
    { label: "Portal Resources", value: portalStats?.books ?? "—", href: "/admin/resources" },
    { label: "Portal Categories", value: portalStats?.categories ?? "—", href: "/categories" },
    { label: "Open reports", value: stats?.openReports ?? "—", href: "/admin/reports" },
    { label: "Contact messages", value: stats?.contactMessages ?? "—", href: "/admin/contact" },
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
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-accent"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-black text-foreground">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold text-foreground">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/admin/content-review" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
              Content review queue
            </Link>
            <Link href="/admin/resources" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
              Manage resources
            </Link>
            <Link href="/admin/chapters" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
              Manage chapters
            </Link>
            <Link href="/admin/reports" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
              Review reports
            </Link>
            <Link href="/fbise/9/mathematics" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
              Preview public site
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold text-foreground">Publishing workflow</h2>
          <ol className="mt-4 space-y-2 text-sm text-muted">
            <li>1. Teacher writes notes and uploads PDFs</li>
            <li>2. Teacher submits chapter for review</li>
            <li>3. Editor approves in Content Review queue</li>
            <li>4. Published chapters appear on the public site</li>
          </ol>
        </div>
      </div>

      <BoardCoveragePanel />
    </div>
  );
}
