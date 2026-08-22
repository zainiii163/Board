import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { memoryStore } from "../../store/memory-store.js";
import * as authService from "../auth/auth.service.js";
import * as contactService from "../contact/contact.service.js";
import * as reportsService from "../reports/reports.service.js";

export type AuditRecord = {
  id: number;
  userId: number;
  userName: string;
  action: string;
  target: string;
  createdAt: string;
};

export async function listAuditLogs(): Promise<AuditRecord[]> {
  if (useDb()) {
    const rows = await db.query.auditLogs.findMany({
      with: { user: true },
      orderBy: (a, { desc }) => [desc(a.createdAt)],
      limit: 100,
    });
    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      userName: row.user.name,
      action: row.action,
      target: row.target,
      createdAt: (row.createdAt ?? new Date()).toISOString(),
    }));
  }
  return memoryStore.audit.list();
}

export async function addAuditLog(input: {
  userId: number;
  action: string;
  target: string;
}) {
  if (useDb()) {
    await db.insert(schema.auditLogs).values(input);
    return;
  }
  const user = await authService.getUserById(input.userId);
  memoryStore.audit.add({
    userId: input.userId,
    userName: user?.name ?? "Unknown",
    action: input.action,
    target: input.target,
  });
}

export async function getDashboardStats() {
  const [users, reports, contacts] = await Promise.all([
    authService.listUsers(),
    reportsService.listReports(),
    contactService.listContactMessages(),
  ]);

  const openReports = reports.filter((r) => r.status === "open").length;

  let boardCount = 4;
  if (useDb()) {
    const boards = await db.query.boards.findMany();
    boardCount = boards.length;
  }

  return {
    users: users.length,
    openReports,
    contactMessages: contacts.length,
    boards: boardCount,
  };
}
