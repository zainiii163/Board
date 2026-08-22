import { apiFetch, apiFetchOrNull } from "@/lib/api-client";
import { HomeResumeCard } from "@/components/content/home-resume-card";
import { SavedOfflineCard } from "@/components/content/saved-offline-card";
import { HomeBoardsSection, HomeHero, HomeLatestSection } from "@/components/content/home-sections";
import { ExamCountdown } from "@/components/content/exam-countdown";

async function getBoards() {
  try {
    return await apiFetch<
      { slug: string; title: string; ready?: boolean; chapterCount?: number; classCount?: number }[]
    >("/api/boards");
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [boards, exams] = await Promise.all([
    getBoards(),
    apiFetchOrNull<{ id: number; boardSlug: string; boardTitle: string; classSlug: string; classTitle: string; title: string; examDate: string }[]>("/api/exams"),
  ]);

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <HomeHero />

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <HomeResumeCard />
          <SavedOfflineCard />
        </div>
        {exams && exams.length > 0 && <ExamCountdown exams={exams} />}
      </div>

      <HomeBoardsSection boards={boards} />
      <HomeLatestSection />
    </section>
  );
}
