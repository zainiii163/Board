"use client";

import { useEffect, useState } from "react";

import { useLocale } from "@/lib/locale-context";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "boardnotes_pwa_dismissed";

export function PwaInstallPrompt() {
  const { tr } = useLocale();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISS_KEY)) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    function onBeforeInstall(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (!visible || !installEvent) return null;

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
      setInstallEvent(null);
    }
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
    setInstallEvent(null);
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 mx-auto max-w-lg rounded-2xl border border-border bg-card p-4 shadow-lg print:hidden sm:left-auto sm:right-6">
      <p className="text-sm font-bold text-foreground">{tr("pwaInstallTitle")}</p>
      <p className="mt-1 text-sm text-muted">{tr("pwaInstallDesc")}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={install}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          {tr("pwaInstallAction")}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-background"
        >
          {tr("pwaInstallDismiss")}
        </button>
      </div>
    </div>
  );
}
