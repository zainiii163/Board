"use client";

import { Breadcrumbs, type Crumb } from "@/components/layout/breadcrumbs";
import { useLocale } from "@/lib/locale-context";

export function LocalizedBreadcrumbs({ items }: { items: Crumb[] }) {
  const { tr } = useLocale();
  const localized = items.map((item, index) =>
    index === 0 && item.href === "/" ? { ...item, label: tr("home") } : item,
  );
  return <Breadcrumbs items={localized} />;
}
