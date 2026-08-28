import Link from "next/link";
import { redirect } from "next/navigation";

import { apiFetchOrNull } from "@/lib/api-client";
import { AdBanner } from "@/components/portal/ad-banner";
import { type PortalCategory, type PortalResource } from "@/components/portal/portal-types";

type TuitionDetail = {
  category: PortalCategory;
  trail: { slug: string; name: string }[];
  children: PortalCategory[];
  resources: PortalResource[];
  total: number;
};

export const dynamic = "force-dynamic";

export default async function TuitionPage() {
  const data = await apiFetchOrNull<TuitionDetail>("/api/categories/tuition");
  if (!data) redirect("/categories/tuition");

  const { children, resources, total } = data;

  const tutors = resources.filter((r) => r.categoryId && resources.some((x) => x.id === r.id));
  const onlineClasses = resources.filter((r) => r.title.toLowerCase().includes("live") || r.title.toLowerCase().includes("online"));
  const findTutors = resources.filter((r) => r.title.toLowerCase().includes("find"));

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Tuition Hub
          </p>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">Find the Right Tutor</h1>
          <p className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
            Browse verified tutors, join live online classes, or request personalized tuition — all in one place.
          </p>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap gap-3">
            {children.map((child) => (
              <Link
                key={child.slug}
                href={`/categories/${child.slug}`}
                className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
              >
                {child.icon} {child.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: total, label: "Tutor Listings" },
              { value: onlineClasses.length, label: "Online Classes" },
              { value: findTutors.length, label: "Available Tutors" },
              { value: "4.8", label: "Avg Rating" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-foreground">{s.value}</p>
                <p className="mt-1 text-xs font-semibold text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Ad */}
        <AdBanner size="leaderboard" className="mx-auto mb-10" />

        {/* Featured Tutors */}
        <div className="mb-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">Featured Tutors</h2>
              <p className="mt-1 text-sm text-muted">Expert teachers for all subjects and classes</p>
            </div>
            <Link href="/categories/find-tutor" className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 text-sm font-bold text-accent transition hover:bg-accent/20">
              View All →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tutors.slice(0, 6).map((tutor) => (
              <div key={tutor.id} className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-lg font-bold text-accent">
                    {tutor.author.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-foreground">{tutor.title}</h3>
                    <p className="text-xs text-muted">{tutor.subject} • {tutor.board ?? "All Boards"}</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-xs text-muted">{tutor.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-accent">{tutor.downloads} students</span>
                  <Link href={`/books/${tutor.slug}`} className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground transition hover:bg-background">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Online Academy Classes */}
        <div className="mb-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">Online Academy Classes</h2>
              <p className="mt-1 text-sm text-muted">Live interactive sessions with expert tutors</p>
            </div>
            <Link href="/categories/online-academy-classes" className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 text-sm font-bold text-accent transition hover:bg-accent/20">
              View All →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {onlineClasses.slice(0, 6).map((cls) => (
              <Link key={cls.id} href={`/books/${cls.slug}`} className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Live</span>
                <h3 className="mt-2 font-semibold text-foreground">{cls.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted">{cls.description}</p>
                <p className="mt-2 text-xs font-semibold text-muted">{cls.author}</p>
              </Link>
            ))}
          </div>
        </div>

        <AdBanner size="inline" className="mb-12" />

        {/* Tuition Request CTA */}
        <div className="rounded-3xl bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 px-8 py-12 text-white">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">Request Tuition</h2>
              <p className="mt-2 max-w-md text-sm text-white/80">
                Tell us your requirements and we will match you with the best available tutor in your area.
              </p>
            </div>
            <Link href="/categories/tuition-request" className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-amber-700 shadow-sm transition hover:opacity-90">
              Submit Request
            </Link>
          </div>
        </div>

        {/* Become a Tutor CTA */}
        <div className="mt-8 rounded-3xl border border-border bg-card px-8 py-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">Become a Tutor</h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                Share your knowledge and reach thousands of students across Pakistan. Register as a verified tutor today.
              </p>
            </div>
            <Link href="/categories/become-tutor" className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-7 py-3.5 text-sm font-bold text-accent transition hover:bg-accent/20">
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}