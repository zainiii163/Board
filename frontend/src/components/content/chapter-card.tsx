import Link from "next/link";
import { Card } from "@/components/ui/card";

type Props = {
  title: string;
  href: string;
  exerciseCount: number;
};

export function ChapterCard({ title, href, exerciseCount }: Props) {
  return (
    <Link href={href}>
      <Card className="hover:border-accent/40 transition-colors">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted">
          {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
        </p>
      </Card>
    </Link>
  );
}
