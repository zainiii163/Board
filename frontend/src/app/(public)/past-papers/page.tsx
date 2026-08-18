import { apiFetch } from "@/lib/api-client";

type PastPaper = {
  year: string;
  subject: string;
  board: string;
};

async function getPastPapers() {
  try {
    return await apiFetch<PastPaper[]>("/api/past-papers");
  } catch {
    return [];
  }
}

export default async function PastPapersPage() {
  const papers = await getPastPapers();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-black text-slate-900">Past Papers</h1>
        <p className="mt-3 text-slate-600">Board-wise past papers by year and subject.</p>

        <div className="mt-8 space-y-3">
          {papers.map((paper) => (
            <div key={`${paper.board}-${paper.year}-${paper.subject}`} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">{paper.board}</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">{paper.subject}</h2>
              </div>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">
                {paper.year}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
