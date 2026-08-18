import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border bg-card px-4 py-3">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-bold">
          BoardNotes
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/search">Search</Link>
          <Link href="/books">Books</Link>
          <Link href="/past-papers">Past Papers</Link>
          <Link href="/about">About</Link>
        </div>
      </nav>
    </header>
  );
}
