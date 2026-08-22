import type { UserRole } from "@boardnotes/shared";

import { hashPassword } from "../utils/password.js";

export type MemoryUser = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  emailUpdates: boolean;
  createdAt: string;
};

export type MemoryReport = {
  id: number;
  pageUrl: string;
  boardSlug: string | null;
  questionRef: string | null;
  message: string;
  status: "open" | "resolved";
  createdAt: string;
};

export type MemoryContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type MemoryBookmark = {
  id: number;
  userId: number;
  title: string;
  path: string;
  createdAt: string;
};

export type MemoryAuditEntry = {
  id: number;
  userId: number;
  userName: string;
  action: string;
  target: string;
  createdAt: string;
};

let userIdCounter = 5;
let reportIdCounter = 1;
let contactIdCounter = 1;
let bookmarkIdCounter = 1;
let auditIdCounter = 1;

const users: MemoryUser[] = [];
const reports: MemoryReport[] = [];
const contacts: MemoryContactMessage[] = [];
const bookmarks: MemoryBookmark[] = [];
const auditLogs: MemoryAuditEntry[] = [];

let seeded = false;

export async function ensureMemorySeed() {
  if (seeded) return;
  seeded = true;

  users.push(
    {
      id: 1,
      name: "Admin User",
      email: "admin@boardnotes.com",
      passwordHash: await hashPassword("admin123"),
      role: "admin",
      emailUpdates: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Editor User",
      email: "editor@boardnotes.com",
      passwordHash: await hashPassword("editor123"),
      role: "editor",
      emailUpdates: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Demo Student",
      email: "student@boardnotes.com",
      passwordHash: await hashPassword("student123"),
      role: "student",
      emailUpdates: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 4,
      name: "Demo Teacher",
      email: "teacher@boardnotes.com",
      passwordHash: await hashPassword("teacher123"),
      role: "teacher",
      emailUpdates: false,
      createdAt: new Date().toISOString(),
    },
  );
}

export const memoryStore = {
  users: {
    list: () => users,
    findByEmail: (email: string) => users.find((u) => u.email === email.toLowerCase()),
    findById: (id: number) => users.find((u) => u.id === id),
    create: (data: Omit<MemoryUser, "id" | "createdAt">) => {
      const user: MemoryUser = {
        ...data,
        emailUpdates: data.emailUpdates ?? false,
        id: userIdCounter++,
        email: data.email.toLowerCase(),
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      return user;
    },
    updateRole: (id: number, role: UserRole) => {
      const user = users.find((u) => u.id === id);
      if (!user) return null;
      user.role = role;
      return user;
    },
    updateEmailUpdates: (id: number, emailUpdates: boolean) => {
      const user = users.find((u) => u.id === id);
      if (!user) return null;
      user.emailUpdates = emailUpdates;
      return user;
    },
    remove: (id: number) => {
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) return false;
      users.splice(index, 1);
      return true;
    },
  },
  reports: {
    list: () => [...reports].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    create: (data: Omit<MemoryReport, "id" | "status" | "createdAt">) => {
      const report: MemoryReport = {
        ...data,
        id: reportIdCounter++,
        status: "open",
        createdAt: new Date().toISOString(),
      };
      reports.unshift(report);
      return report;
    },
    resolve: (id: number) => {
      const report = reports.find((r) => r.id === id);
      if (!report) return null;
      report.status = "resolved";
      return report;
    },
  },
  contacts: {
    list: () => [...contacts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    create: (data: Omit<MemoryContactMessage, "id" | "createdAt">) => {
      const entry: MemoryContactMessage = {
        ...data,
        id: contactIdCounter++,
        createdAt: new Date().toISOString(),
      };
      contacts.unshift(entry);
      return entry;
    },
  },
  bookmarks: {
    listForUser: (userId: number) =>
      bookmarks.filter((b) => b.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    find: (userId: number, path: string) =>
      bookmarks.find((b) => b.userId === userId && b.path === path),
    create: (data: Omit<MemoryBookmark, "id" | "createdAt">) => {
      const existing = bookmarks.find((b) => b.userId === data.userId && b.path === data.path);
      if (existing) return existing;
      const entry: MemoryBookmark = {
        ...data,
        id: bookmarkIdCounter++,
        createdAt: new Date().toISOString(),
      };
      bookmarks.unshift(entry);
      return entry;
    },
    remove: (userId: number, id: number) => {
      const index = bookmarks.findIndex((b) => b.id === id && b.userId === userId);
      if (index === -1) return false;
      bookmarks.splice(index, 1);
      return true;
    },
  },
  audit: {
    list: () => [...auditLogs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    add: (data: Omit<MemoryAuditEntry, "id" | "createdAt">) => {
      const entry: MemoryAuditEntry = {
        ...data,
        id: auditIdCounter++,
        createdAt: new Date().toISOString(),
      };
      auditLogs.unshift(entry);
      return entry;
    },
  },
};
