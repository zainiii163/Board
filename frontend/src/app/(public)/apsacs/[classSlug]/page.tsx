import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { APSACSClassPageContent } from "@/components/content/apsacs-pages";
import { APSACS_CLASSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ classSlug: string }> }): Promise<Metadata> {
  const { classSlug } = await params;
  const classNum = classSlug.replace("class-", "");
  const classNumInt = parseInt(classNum, 10);
  
  if (!(APSACS_CLASSES as readonly number[]).includes(classNumInt)) {
    return { title: "Class Not Found" };
  }

  return {
    title: `APSACS Class ${classNum} - Books & Notes | BoardNotes`,
    description: `Access APSACS Class ${classNum} textbooks, notes, and study materials. Comprehensive educational resources for Army Public Schools & Colleges System students.`,
    openGraph: { 
      title: `APSACS Class ${classNum} | BoardNotes`, 
      description: `Browse books and notes for APSACS Class ${classNum}` 
    },
  };
}

export default async function APSACSClassPage({ params }: { params: Promise<{ classSlug: string }> }) {
  const { classSlug } = await params;
  const classNum = classSlug.replace("class-", "");
  const classNumInt = parseInt(classNum, 10);
  
  if (!(APSACS_CLASSES as readonly number[]).includes(classNumInt)) {
    notFound();
  }

  // For now, return a placeholder. In production, this would fetch from API
  const subjects = [
    { slug: "english", title: "English" },
    { slug: "mathematics", title: "Mathematics" },
    { slug: "science", title: "Science" },
    { slug: "urdu", title: "Urdu" },
    { slug: "islamic-studies", title: "Islamic Studies" },
    { slug: "social-studies", title: "Social Studies" },
  ];

  return <APSACSClassPageContent 
    board="apsacs" 
    classSlug={classSlug} 
    boardTitle="APSACS" 
    classTitle={`Class ${classNum}`} 
    subjects={subjects} 
  />;
}
