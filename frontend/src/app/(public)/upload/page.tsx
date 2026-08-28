import { UploadForm } from "@/components/portal/upload-form";

export const dynamic = "force-dynamic";

export default function UploadPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">Upload a Resource</h1>
        <p className="mt-2 text-sm text-muted sm:text-base">
          Share a PDF book, notes, past paper or any study resource with students for free.
        </p>
      </div>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <UploadForm />
      </div>
    </section>
  );
}