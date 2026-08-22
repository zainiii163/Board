"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth-context";

export function AccountGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/account");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted">
        Loading your account…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-muted">Redirecting to sign in…</p>
        <Link href="/login" className="mt-3 inline-block text-accent hover:underline">
          Sign in
        </Link>
      </div>
    );
  }

  return children;
}
