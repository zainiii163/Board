export default function ExerciseLoading() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-4 w-80 animate-pulse rounded-full bg-accent/10" />
      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card/50 px-8 py-10 shadow-xl sm:px-10">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-5 w-20 animate-pulse rounded-full bg-accent/10" />
          ))}
        </div>
        <div className="mt-4 h-8 w-64 animate-pulse rounded-lg bg-accent/10" />
      </div>
      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="h-20 w-full animate-pulse rounded-xl bg-muted/10" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded-xl border border-border bg-background" />
          ))}
        </div>
      </div>
    </section>
  );
}
