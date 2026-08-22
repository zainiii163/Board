"use client";

import { parseYouTubeVideoId, youTubeEmbedUrl } from "@/lib/youtube";
import { useLocale } from "@/lib/locale-context";

type ChapterVideoProps = {
  videoUrl?: string;
  title: string;
};

export function ChapterVideo({ videoUrl, title }: ChapterVideoProps) {
  const { tr } = useLocale();
  const videoId = videoUrl ? parseYouTubeVideoId(videoUrl) : null;

  if (!videoId) return null;

  return (
    <div className="mt-8 rounded-2xl border border-border bg-background p-5">
      <h2 className="text-lg font-bold text-foreground">{tr("videoLesson")}</h2>
      <p className="mt-1 text-sm text-muted">{tr("videoLessonHint")}</p>
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        <div className="relative aspect-video w-full">
          <iframe
            title={`${title} — ${tr("videoLesson")}`}
            src={youTubeEmbedUrl(videoId)}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  );
}
