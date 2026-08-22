"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/locale-context";
import { Button } from "@/components/ui/button";

type AuthFormProps = {
  mode: "login" | "register";
};

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-accent";

export function AuthForm({ mode }: AuthFormProps) {
  const { signIn, signUp } = useAuth();
  const { tr } = useLocale();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(name, email, password);
      }
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : tr("somethingWrong"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
        {mode === "login" ? tr("welcomeBack") : tr("createAccount")}
      </p>
      <h1 className="mt-2 font-serif text-3xl font-black text-foreground">
        {mode === "login" ? tr("signIn") : tr("signUp")}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {mode === "login" ? tr("authLoginDesc") : tr("authRegisterDesc")}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === "register" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">{tr("fullName")}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder={tr("yourName")}
              required
            />
          </div>
        )}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">{tr("email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">{tr("password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder={tr("passwordHint")}
            minLength={6}
            required
          />
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? tr("pleaseWait") : mode === "login" ? tr("signIn") : tr("createAccountBtn")}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            {tr("noAccount")}{" "}
            <Link href="/register" className="font-semibold text-accent hover:underline">
              {tr("signUpFree")}
            </Link>
          </>
        ) : (
          <>
            {tr("alreadyHaveAccount")}{" "}
            <Link href="/login" className="font-semibold text-accent hover:underline">
              {tr("signIn")}
            </Link>
          </>
        )}
      </p>

      {mode === "login" && (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-4 text-xs text-muted">
          <p className="font-semibold text-foreground">{tr("demoAccounts")}</p>
          <p className="mt-1">admin@boardnotes.com / admin123</p>
          <p>editor@boardnotes.com / editor123</p>
          <p>teacher@boardnotes.com / teacher123</p>
          <p>student@boardnotes.com / student123</p>
        </div>
      )}
    </div>
  );
}
