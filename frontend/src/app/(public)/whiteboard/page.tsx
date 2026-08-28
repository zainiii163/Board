import { ComingSoonPage } from "@/components/portal/coming-soon-page";

export const dynamic = "force-dynamic";

export default function WhiteboardPage() {
  return (
    <ComingSoonPage
      titleKey="whiteboardTitle"
      descKey="whiteboardDesc"
      detailKey="whiteboardComingSoon"
      gradient="from-amber-400 to-yellow-600"
      icon="🖊️"
      features={[
        { icon: "✏️", title: "Draw & Annotate", desc: "Freehand drawing, text, shapes, and highlighters." },
        { icon: "🤝", title: "Real-time Collaboration", desc: "Work together with classmates on the same board." },
        { icon: "📐", title: "Math Tools", desc: "Built-in graphing, equation editor, and geometry tools." },
        { icon: "💾", title: "Save & Share", desc: "Save your whiteboard sessions and share with others." },
        { icon: "📱", title: "Works Everywhere", desc: "Use on desktop, tablet, or mobile — no app needed." },
        { icon: "🎓", title: "Tutor Mode", desc: "Tutors can lead sessions and control what students see." },
      ]}
    />
  );
}