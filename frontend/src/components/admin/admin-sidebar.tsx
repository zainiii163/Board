import Link from "next/link";

const links = [
  { label: "Dashboard", href: "/admin" },
  { label: "Boards", href: "/admin/boards" },
  { label: "Classes", href: "/admin/classes" },
  { label: "Subjects", href: "/admin/subjects" },
  { label: "Chapters", href: "/admin/chapters" },
  { label: "Exercises", href: "/admin/exercises" },
  { label: "Questions", href: "/admin/questions" },
  { label: "Content Review", href: "/admin/content-review" },
  { label: "Uploads", href: "/admin/uploads" },
  { label: "Users", href: "/admin/users" },
  { label: "Reports", href: "/admin/reports" },
  { label: "Audit Log", href: "/admin/audit-log" },
  { label: "Legal Pages", href: "/admin/legal-pages" },
];

export function AdminSidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-border bg-card p-4">
      <p className="mb-4 text-xs font-semibold uppercase text-muted">CMS</p>
      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded px-2 py-1.5 text-sm hover:bg-background"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
