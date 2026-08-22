import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <AuthForm mode="login" />
    </section>
  );
}
