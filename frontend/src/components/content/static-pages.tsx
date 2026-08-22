"use client";

import { PageHeading } from "@/components/layout/page-heading";
import { ContactForm } from "@/components/content/contact-form";

export function ContactPageContent() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <PageHeading titleKey="contact" subtitleKey="contactDesc" />
        <ContactForm />
      </div>
    </section>
  );
}
