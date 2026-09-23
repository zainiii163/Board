export default function BoardLoading() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-4 w-48 animate-pulse rounded-full bg-accent/10" />
      <div className="mt-6 rounded-3xl border border-border bg-card p-6">
        <div className="h-4 w-24 animate-pulse rounded-full bg-muted/30" />
        <div className="mt-3 h-8 w-64 animate-pulse rounded-lg bg-muted/30" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded bg-muted/20" />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl border border-border bg-card/50" />
        ))}
      </div>
    </section>
  );
}
