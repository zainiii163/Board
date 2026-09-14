export default function ChapterLoading() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-4 w-64 animate-pulse rounded-full bg-accent/10" />
      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card/50 px-8 py-10 shadow-xl sm:px-10">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-5 w-20 animate-pulse rounded-full bg-accent/10" />
          ))}
        </div>
        <div className="mt-4 h-8 w-72 animate-pulse rounded-lg bg-accent/10" />
      </div>
      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-full animate-pulse rounded bg-muted/20" />
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="h-48 animate-pulse rounded-2xl border border-border bg-background" />
          <div className="h-48 animate-pulse rounded-2xl border border-border bg-background" />
        </div>
      </div>
    </section>
  );
}
