import { ComingSoonPage } from "@/components/portal/coming-soon-page";

export const dynamic = "force-dynamic";

export default function TestGeneratorPage() {
  return (
    <ComingSoonPage
      titleKey="testGeneratorTitle"
      descKey="testGeneratorDesc"
      detailKey="testGeneratorComingSoon"
      gradient="from-violet-400 to-purple-600"
      icon="⚡"
      features={[
        { icon: "🎲", title: "Randomized Tests", desc: "Generate unique tests every time from our question bank." },
        { icon: "📋", title: "Custom Patterns", desc: "Choose board, class, subject, chapters, and question types." },
        { icon: "📝", title: "MCQ + Subjective", desc: "Mix objective and subjective questions in one test." },
        { icon: "⏱️", title: "Time Limits", desc: "Set custom time limits for timed practice sessions." },
        { icon: "📊", title: "Auto-grading", desc: "MCQs are graded instantly with detailed answer explanations." },
        { icon: "🖨️", title: "Print Ready", desc: "Export tests as PDF for printing and offline practice." },
      ]}
    />
  );
}