export default async function ChapterPage({
  params,
}: {
  params: Promise<{
    board: string;
    classSlug: string;
    subject: string;
    chapter: string;
  }>;
}) {
  const { chapter } = await params;
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold capitalize">
        {chapter.replace(/-/g, " ")}
      </h1>
      <p className="mt-2 text-muted">
        Summary, formulas, and list of exercises.
      </p>
    </section>
  );
}
