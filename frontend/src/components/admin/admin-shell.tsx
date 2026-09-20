"use client";

import { useState } from "react";

import { AdminGuard } from "@/components/auth/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <AdminSidebar onLinkClick={() => setSidebarOpen(false)} />
        </div>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="mb-4 inline-flex items-center justify-center rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground lg:hidden"
          >
            <span className="mr-2">☰</span> Menu
          </button>
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
