import { ComingSoonPage } from "@/components/portal/coming-soon-page";

export const dynamic = "force-dynamic";

export default function OnlineQuizzesPage() {
  return (
    <ComingSoonPage
      titleKey="quizzesTitle"
      descKey="quizzesDesc"
      detailKey="quizzesComingSoon"
      gradient="from-sky-500 to-blue-600"
      icon="❓"
      features={[
        { icon: "⏱️", title: "Timed Quizzes", desc: "Practice under real exam conditions with countdown timers." },
        { icon: "📊", title: "Instant Results", desc: "Get your score and detailed breakdown immediately after submission." },
        { icon: "📚", title: "Subject-wise Practice", desc: "Physics, Chemistry, Biology, Mathematics — all covered." },
        { icon: "🎯", title: "Board-aligned Content", desc: "Questions designed to match your board exam pattern." },
        { icon: "📈", title: "Progress Tracking", desc: "Track your improvement over time with detailed analytics." },
        { icon: "🏆", title: "Leaderboards", desc: "Compete with students across Pakistan and climb the ranks." },
      ]}
    />
  );
}