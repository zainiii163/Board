"use client";

import { useEffect, useState } from "react";

import { apiAuthFetch, apiDelete, apiPut } from "@/lib/api-client";
import type { UserRole, UserSummary } from "@/lib/shared-types";

const roles: UserRole[] = ["admin", "editor", "teacher", "student"];

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiAuthFetch<UserSummary[]>("/api/users")
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  async function changeRole(id: number | string, role: UserRole) {
    const updated = await apiPut<UserSummary>(`/api/users/${id}/role`, { role });
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  }

  async function deleteUser(id: number | string) {
    await apiDelete(`/api/users/${id}`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-black text-foreground">Manage Users</h1>
      <p className="mt-2 text-muted">Assign roles for admin, editor, teacher, and student accounts.</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-background text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-muted">
                  Loading users…
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                <td className="px-4 py-3 text-muted">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => changeRole(user.id, e.target.value as UserRole)}
                    className="rounded-lg border border-border bg-background px-2 py-1.5"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => deleteUser(user.id)}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
