"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/lib/auth-context";
import { LocaleToggle } from "@/lib/locale-context";
import { ThemeToggle } from "@/lib/theme-context";

type NavLink = {
  label: string;
  href: string;
  roles: string[];
  icon: string;
};

type LinkSection = {
  title: string;
  icon: string;
  links: NavLink[];
};

const sections: LinkSection[] = [
  {
    title: "Content",
    icon: "📄",
    links: [
      { label: "Dashboard", href: "/admin", roles: ["admin", "editor", "teacher"], icon: "📊" },
      { label: "Boards", href: "/admin/boards", roles: ["admin", "editor"], icon: "📚" },
      { label: "Classes", href: "/admin/classes", roles: ["admin", "editor", "teacher"], icon: "🎓" },
      { label: "Subjects", href: "/admin/subjects", roles: ["admin", "editor", "teacher"], icon: "📖" },
      { label: "Chapters", href: "/admin/chapters", roles: ["admin", "editor", "teacher"], icon: "📑" },
      { label: "Exercises", href: "/admin/exercises", roles: ["admin", "editor", "teacher"], icon: "✏️" },
      { label: "Questions", href: "/admin/questions", roles: ["admin", "editor", "teacher"], icon: "❓" },
      { label: "MCQs", href: "/admin/mcqs", roles: ["admin", "editor", "teacher"], icon: "🔘" },
      { label: "Authors", href: "/admin/authors", roles: ["admin", "editor"], icon: "✍️" },
      { label: "Uploads", href: "/admin/uploads", roles: ["admin", "editor", "teacher"], icon: "📁" },
      { label: "Content Review", href: "/admin/content-review", roles: ["admin", "editor"], icon: "🔍" },
      { label: "Comments", href: "/admin/comments", roles: ["admin", "editor"], icon: "💬" },
    ],
  },
  {
    title: "Portal",
    icon: "🌐",
    links: [
      { label: "Books", href: "/admin/books", roles: ["admin", "editor", "teacher"], icon: "📕" },
      { label: "Portal Resources", href: "/admin/resources", roles: ["admin", "editor", "teacher"], icon: "📦" },
      { label: "Categories", href: "/admin/categories", roles: ["admin", "editor"], icon: "🏷️" },
      { label: "Past Papers", href: "/admin/past-papers", roles: ["admin", "editor", "teacher"], icon: "📋" },
      { label: "Exam Dates", href: "/admin/exams", roles: ["admin", "editor"], icon: "📅" },
    ],
  },
  {
    title: "Users",
    icon: "👥",
    links: [
      { label: "Users", href: "/admin/users", roles: ["admin"], icon: "👤" },
      { label: "Classroom", href: "/admin/classroom", roles: ["admin", "editor", "teacher"], icon: "🏫" },
    ],
  },
  {
    title: "Reports",
    icon: "🚩",
    links: [
      { label: "Reports", href: "/admin/reports", roles: ["admin", "editor"], icon: "⚠️" },
      { label: "Contact", href: "/admin/contact", roles: ["admin", "editor"], icon: "✉️" },
    ],
  },
  {
    title: "System",
    icon: "⚙️",
    links: [
      { label: "Legal Pages", href: "/admin/legal-pages", roles: ["admin", "editor"], icon: "📜" },
      { label: "Audit Log", href: "/admin/audit-log", roles: ["admin", "editor"], icon: "📋" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const visibleSections = sections
    .map((section) => ({
      ...section,
      links: section.links.filter((link) => user && link.roles.includes(user.role)),
    }))
    .filter((section) => section.links.length > 0);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border p-5">
        <Link href="/" className="font-serif text-xl font-black text-foreground">
          BoardNotes
        </Link>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">Admin CMS</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {visibleSections.map((section) => {
          const isCollapsed = collapsed[section.title] ?? false;
          const hasActive = section.links.some((l) => pathname === l.href);

          return (
            <div key={section.title} className="mb-1">
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  hasActive ? "text-accent" : "text-muted/70 hover:text-muted"
                }`}
              >
                <span className="text-sm">{section.icon}</span>
                <span className="flex-1 text-left">{section.title}</span>
                <span className={`text-[10px] transition-transform ${isCollapsed ? "" : "rotate-90"}`}>▸</span>
              </button>
              {!isCollapsed && (
                <div className="mt-0.5 space-y-0.5 pl-2">
                  {section.links.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
                          active
                            ? "bg-gradient-to-r from-accent/15 to-accent/5 text-accent shadow-sm"
                            : "text-foreground/80 hover:bg-background hover:text-accent"
                        }`}
                      >
                        <span className="text-sm w-5 text-center">{link.icon}</span>
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
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
