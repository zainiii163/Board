export default function BoardLoading() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-4 w-48 animate-pulse rounded-full bg-accent/10" />
      <div className="hero-gradient relative mt-6 overflow-hidden rounded-3xl px-8 py-10 shadow-xl sm:px-10">
        <div className="h-5 w-32 animate-pulse rounded-full bg-white/20" />
        <div className="mt-4 h-8 w-64 animate-pulse rounded-lg bg-white/20" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded bg-white/15" />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl border border-border bg-card/50" />
        ))}
      </div>
    </section>
  );
}
