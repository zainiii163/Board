"use client";

import { useEffect, useState } from "react";

import { useLocale } from "@/lib/locale-context";

export function OfflineBanner() {
  const { tr } = useLocale();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-foreground print:hidden">
      {tr("offlineBanner")}
    </div>
  );
}
