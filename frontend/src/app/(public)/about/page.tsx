export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-black text-slate-900">About BoardNotes</h1>
        <p className="mt-4 text-base leading-7 text-slate-700">
          BoardNotes helps students prepare for board exams through clean chapter summaries, worked exercises, and downloadable PDFs. The platform is designed to keep learning straightforward, structured, and exam-focused.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-lg font-bold text-slate-900">Clear steps</h2>
            <p className="mt-2 text-sm text-slate-600">Every exercise is broken into simple working steps.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-lg font-bold text-slate-900">Board coverage</h2>
            <p className="mt-2 text-sm text-slate-600">FBISE, Punjab, KPK, and Sindh resources in one place.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-lg font-bold text-slate-900">Exam ready</h2>
            <p className="mt-2 text-sm text-slate-600">Support for revision, quick learning, and practice.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
