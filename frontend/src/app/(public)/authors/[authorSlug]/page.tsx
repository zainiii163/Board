export default async function AuthorPage({
  params,
}: {
  params: Promise<{ authorSlug: string }>;
}) {
  const { authorSlug } = await params;
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold capitalize">
        {authorSlug.replace(/-/g, " ")}
      </h1>
      <p className="mt-2 text-muted">Published notes by this author.</p>
    </section>
  );
}
