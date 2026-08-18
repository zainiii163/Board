export default async function QuestionPage({
  params,
}: {
  params: Promise<{
    board: string;
    classSlug: string;
    subject: string;
    chapter: string;
    exercise: string;
    questionNum: string;
  }>;
}) {
  const { questionNum } = await params;
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">Question {questionNum}</h1>
      <p className="mt-2 text-muted">Step-by-step solution.</p>
    </section>
  );
}
