import Link from "next/link";

type Props = {
  prevHref?: string;
  nextHref?: string;
};

export function QuestionNav({ prevHref, nextHref }: Props) {
  return (
    <div className="flex justify-between py-4">
      {prevHref ? (
        <Link href={prevHref} className="text-sm text-accent hover:underline">
          ← Previous
        </Link>
      ) : (
        <span />
      )}
      {nextHref && (
        <Link href={nextHref} className="text-sm text-accent hover:underline">
          Next →
        </Link>
      )}
    </div>
  );
}
