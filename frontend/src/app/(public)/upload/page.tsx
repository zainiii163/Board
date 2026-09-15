import { UploadForm } from "@/components/portal/upload-form";

export const dynamic = "force-dynamic";

export default function UploadPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M17 8l-5-5-5 5" />
            <path d="M12 3v12" />
          </svg>
          Community Upload
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">Upload a Resource</h1>
        <p className="mt-3 text-sm text-muted sm:text-base">
          Share a PDF book, notes, past paper or any study resource with students for free.
        </p>
      </div>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <UploadForm />
      </div>
    </section>
  );
}
