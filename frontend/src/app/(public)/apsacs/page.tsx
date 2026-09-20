import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BoardPageContent } from "@/components/content/hierarchy-pages";
import { apiFetchOrNull } from "@/lib/api-client";
import { APSACS_CLASSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

type BoardData = {
  slug: string;
  title: string;
  classes: { slug: string; title: string }[];
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "APSACS - Army Public Schools & Colleges System | BoardNotes",
    description: "Explore APSACS textbooks and resources for Class 1-8. Access study materials, notes, and educational resources tailored for Army Public Schools & Colleges System.",
    openGraph: { 
      title: "APSACS | BoardNotes", 
      description: "Browse APSACS classes and resources" 
    },
  };
}

export default async function APSACSPage() {
  // Generate APSACS classes dynamically
  const classes = APSACS_CLASSES.map((num) => ({
    slug: `class-${num}`,
    title: `Class ${num}`,
  }));

  return <BoardPageContent board="apsacs" title="APSACS - Army Public Schools & Colleges System" classes={classes} />;
}
