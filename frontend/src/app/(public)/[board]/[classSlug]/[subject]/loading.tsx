export default function SubjectLoading() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-4 w-48 animate-pulse rounded-full bg-accent/10" />
      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card/50 px-8 py-10 shadow-xl sm:px-10">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-5 w-20 animate-pulse rounded-full bg-accent/10" />
          ))}
        </div>
        <div className="mt-4 h-8 w-56 animate-pulse rounded-lg bg-accent/10" />
        <div className="mt-2 h-4 w-40 animate-pulse rounded bg-muted/20" />
      </div>
      <div className="mt-6 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-7 w-24 animate-pulse rounded-full bg-accent/10" />
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl border border-border bg-card/50" />
        ))}
      </div>
    </section>
  );
}
