import Link from "next/link";
import { apiFetch } from "@/lib/api-client";

async function getBoards() {
  try {
    return await apiFetch<{ slug: string; title: string }[]>("/api/boards");
  } catch {
    return [];
  }
}

const latestNotes = [
  {
    title: "Real Numbers",
    subject: "Mathematics",
    board: "FBISE",
    className: "Class 9",
    description: "Quick concept recap and worked examples covering rational and irrational values.",
    path: "/fbise/9/mathematics/real-numbers"
  },
  {
    title: "Exercise 1.1",
    subject: "Mathematics",
    board: "FBISE",
    className: "Class 9",
    description: "Solved decimal-to-rational questions including Question 3, 5, 6 and 7.",
    path: "/fbise/9/mathematics/real-numbers/exercise-1-1"
  },
  {
    title: "Question 6",
    subject: "Mathematics",
    board: "FBISE",
    className: "Class 9",
    description: "Simplify $\\sqrt{18} - \\sqrt{8}$ with a clear factor-by-factor solution.",
    path: "/fbise/9/mathematics/real-numbers/exercise-1-1/q/6"
  },
  {
    title: "Question 7",
    subject: "Mathematics",
    board: "FBISE",
    className: "Class 9",
    description: "Rationalize $\\frac{1}{\\sqrt{5} + 2}$ using the conjugate method.",
    path: "/fbise/9/mathematics/real-numbers/exercise-1-1/q/7"
  },
];

export default async function HomePage() {
  const boards = await getBoards();

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pb-20 pt-8 sm:px-6 lg:px-8">

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#182333] px-8 py-14 text-white shadow-xl sm:px-12 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="font-serif text-5xl font-medium tracking-tight sm:text-6xl lg:text-[4.5rem] leading-none text-white">
              other way around.
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-slate-300">
              Board → Class → Chapter → Exercise → Question. Read solutions on screen, then download the PDF when you need it.
            </p>
            <form action="/search" method="get" className="mt-10 flex max-w-md items-center gap-2 rounded-full bg-[#243142] p-1.5">
              <input
                name="q"
                aria-label="Search content"
                placeholder="Search notes, chapters, exercises..."
                className="w-full bg-transparent px-5 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-[#087F72] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#06665B]"
              >
                Search
              </button>
            </form>
          </div>

          <div className="flex flex-col items-end space-y-4 pt-4 lg:pt-0">
            <div className="w-[85%] rounded-2xl border border-white/5 bg-[#243142] px-5 py-4 text-sm text-slate-300 shadow-lg">
              FBISE → Class 9 → Mathematics
            </div>
            <div className="w-[90%] rounded-2xl border border-[#42A99D]/40 bg-[#087F72] px-5 py-4 text-sm text-white shadow-lg">
              Real Numbers → Exercise 1.1 → Question 3
            </div>
          </div>
        </div>
      </div>

      {/* Boards Section */}
      <div className="mt-20">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#087F72]">BROWSE</p>
        <h2 className="mt-2 font-serif text-4xl text-[#182333]">Boards</h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {boards.map((board) => {
            const isFBISE = board.slug === "fbise";
            const card = (
              <div
                key={board.slug}
                className="flex h-full flex-col rounded-3xl border border-[#DED8CA] bg-[#FCF9F1] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#087F72]">BOARD</p>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${isFBISE ? "bg-[#E2F1ED] text-[#087F72]" : "bg-[#E8E4D9] text-[#6F6F68]"}`}>
                    {isFBISE ? "Demo ready" : "Soon"}
                  </span>
                </div>
                <h3 className="mt-3 pr-4 font-serif text-2xl font-medium leading-tight text-[#182333]">
                  {board.title.replace("(", "\n(")}
                </h3>
                <p className="mt-auto pt-8 text-[13px] leading-relaxed text-[#6F6F68]">
                  Class 9 to 12 notes, exercises, and papers
                </p>
              </div>
            );

            if (isFBISE) {
              return (
                <Link href="/fbise" key={board.slug} className="block">
                  {card}
                </Link>
              );
            }

            return <div key={board.slug}>{card}</div>;
          })}
        </div>
      </div>

      {/* Latest Notes Section */}
      <div className="mt-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#087F72]">JUST PUBLISHED</p>
            <h2 className="mt-2 font-serif text-4xl text-[#182333]">Latest notes</h2>
          </div>
          <Link href="/search" className="text-sm font-semibold text-[#182333] hover:text-[#087F72]">
            Browse all
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {latestNotes.map((note) => (
            <article
              key={note.title}
              className="flex flex-col overflow-hidden rounded-3xl border border-[#DED8CA] bg-[#FCF9F1] shadow-sm"
            >
              <div className="bg-[#182333] px-6 py-6 text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {note.board}
                </p>
                <h3 className="mt-2 font-serif text-2xl font-medium text-white">{note.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{note.subject}</p>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[13px] text-slate-400">{note.className}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
                  {note.description}
                </p>
                <Link href={note.path} className="mt-auto pt-6 text-[13px] font-bold text-[#182333] hover:text-[#087F72]">
                  Open notes →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
