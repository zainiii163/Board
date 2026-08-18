export default async function BoardPage({
  params,
}: {
  params: Promise<{ board: string }>;
}) {
  const { board } = await params;
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold capitalize">{board}</h1>
      <p className="mt-2 text-muted">Select a class to continue.</p>
    </section>
  );
}
