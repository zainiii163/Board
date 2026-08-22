"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth-context";

type AdminGuardProps = {
  children: React.ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading, isStaff } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isStaff)) {
      router.replace("/login?next=/admin");
    }
  }, [loading, user, isStaff, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted">
        Checking access…
      </div>
    );
  }

  if (!user || !isStaff) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-foreground">Admin access required</h1>
          <p className="mt-2 text-sm text-muted">Sign in with an admin, editor, or teacher account.</p>
          <Link
            href="/login?next=/admin"
            className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
