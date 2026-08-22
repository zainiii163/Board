"use client";

import { AdminGuard } from "@/components/auth/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-background text-foreground">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-6 sm:p-8">{children}</main>
      </div>
    </AdminGuard>
  );
}
