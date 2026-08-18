export default async function SubjectPage({
  params,
}: {
  params: Promise<{ board: string; classSlug: string; subject: string }>;
}) {
  const { board, classSlug, subject } = await params;
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold capitalize">
        {subject.replace(/-/g, " ")}
      </h1>
      <p className="mt-2 text-muted">
        {board.toUpperCase()} — Class {classSlug}
      </p>
    </section>
  );
}
