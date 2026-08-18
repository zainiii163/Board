import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-sm text-sky-700">
            B
          </span>
          BoardNotes
        </Link>

        <Link
          href="/fbise"
          className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
        >
          Explore FBISE
        </Link>
      </nav>
    </header>
  );
}
