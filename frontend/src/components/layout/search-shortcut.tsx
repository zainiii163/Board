"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

export function SearchShortcut() {
  const router = useRouter();
  const openSearch = useCallback(() => router.push("/search"), [router]);
  useKeyboardShortcut("/", openSearch);
  return null;
}
