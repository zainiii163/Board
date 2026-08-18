export default async function ExercisePage({
  params,
}: {
  params: Promise<{
    board: string;
    classSlug: string;
    subject: string;
    chapter: string;
    exercise: string;
  }>;
}) {
  const { exercise } = await params;
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold capitalize">
        {exercise.replace(/-/g, " ")}
      </h1>
      <p className="mt-2 text-muted">Questions and solutions.</p>
    </section>
  );
}
