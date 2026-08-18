import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-6 text-sm text-muted">
      <div className="mx-auto flex max-w-6xl flex-wrap gap-6">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/copyright">Copyright</Link>
      </div>
    </footer>
  );
}
