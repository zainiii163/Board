"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/lib/auth-context";
import { LocaleToggle } from "@/lib/locale-context";
import { ThemeToggle } from "@/lib/theme-context";

const links = [
  { label: "Dashboard", href: "/admin", roles: ["admin", "editor", "teacher"] },
  { label: "Boards", href: "/admin/boards", roles: ["admin", "editor"] },
  { label: "Classes", href: "/admin/classes", roles: ["admin", "editor", "teacher"] },
  { label: "Subjects", href: "/admin/subjects", roles: ["admin", "editor", "teacher"] },
  { label: "Chapters", href: "/admin/chapters", roles: ["admin", "editor", "teacher"] },
  { label: "Classroom", href: "/admin/classroom", roles: ["admin", "editor", "teacher"] },
  { label: "Exercises", href: "/admin/exercises", roles: ["admin", "editor", "teacher"] },
  { label: "Questions", href: "/admin/questions", roles: ["admin", "editor", "teacher"] },
  { label: "Authors", href: "/admin/authors", roles: ["admin", "editor"] },
  { label: "MCQs", href: "/admin/mcqs", roles: ["admin", "editor", "teacher"] },
  { label: "Books", href: "/admin/books", roles: ["admin", "editor", "teacher"] },
  { label: "Portal Resources", href: "/admin/resources", roles: ["admin", "editor", "teacher"] },
  { label: "Categories", href: "/admin/categories", roles: ["admin", "editor"] },
  { label: "Past Papers", href: "/admin/past-papers", roles: ["admin", "editor", "teacher"] },
  { label: "Exam Dates", href: "/admin/exams", roles: ["admin", "editor"] },
  { label: "Uploads", href: "/admin/uploads", roles: ["admin", "editor", "teacher"] },
  { label: "Legal Pages", href: "/admin/legal-pages", roles: ["admin", "editor"] },
  { label: "Reports", href: "/admin/reports", roles: ["admin", "editor"] },
  { label: "Users", href: "/admin/users", roles: ["admin"] },
  { label: "Contact", href: "/admin/contact", roles: ["admin", "editor"] },
  { label: "Content Review", href: "/admin/content-review", roles: ["admin", "editor"] },
  { label: "Comments", href: "/admin/comments", roles: ["admin", "editor"] },
  { label: "Audit Log", href: "/admin/audit-log", roles: ["admin", "editor"] },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const visibleLinks = links.filter(
    (link) => user && link.roles.includes(user.role),
  );

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border p-5">
        <Link href="/" className="font-serif text-xl font-black text-foreground">
          BoardNotes
        </Link>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">Admin CMS</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {visibleLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-accent text-white"
                  : "text-foreground hover:bg-background hover:text-accent"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          <LocaleToggle />
          <ThemeToggle />
        </div>
        <p className="text-xs text-muted">Signed in as</p>
        <p className="text-sm font-semibold text-foreground">{user?.name}</p>
        <div className="mt-3 flex gap-2">
          <Link href="/" className="text-xs font-semibold text-accent hover:underline">
            View site
          </Link>
          <button type="button" onClick={signOut} className="text-xs font-semibold text-muted hover:underline">
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
