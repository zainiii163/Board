export default async function ClassPage({
  params,
}: {
  params: Promise<{ board: string; classSlug: string }>;
}) {
  const { board, classSlug } = await params;
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">
        Class {classSlug} — {board.toUpperCase()}
      </h1>
      <p className="mt-2 text-muted">Choose a subject.</p>
    </section>
  );
}
