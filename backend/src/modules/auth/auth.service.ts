import { eq } from "drizzle-orm";
import type { UserRole } from "@boardnotes/shared";

import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { ensureMemorySeed, memoryStore } from "../../store/memory-store.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { signToken } from "../../utils/jwt.js";
import { ApiError } from "../../utils/api-error.js";

export type PublicUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  emailUpdates: boolean;
};

function toPublicUser(user: {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  emailUpdates?: boolean | null;
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailUpdates: Boolean(user.emailUpdates),
  };
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}): Promise<{ user: PublicUser; token: string }> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!name || name.length < 2) throw ApiError.badRequest("Name must be at least 2 characters.");
  if (!email.includes("@")) throw ApiError.badRequest("Enter a valid email address.");
  if (password.length < 6) throw ApiError.badRequest("Password must be at least 6 characters.");

  const role: UserRole = input.role === "admin" ? "student" : (input.role ?? "student");
  const passwordHash = await hashPassword(password);

  if (useDb()) {
    const existing = await db.query.users.findFirst({ where: eq(schema.users.email, email) });
    if (existing) throw ApiError.badRequest("An account with this email already exists.");

    const [created] = await db
      .insert(schema.users)
      .values({ name, email, passwordHash, role })
      .returning();

    const user = toPublicUser(created);
    return { user, token: signToken({ userId: user.id, email: user.email, role: user.role }) };
  }

  await ensureMemorySeed();
  if (memoryStore.users.findByEmail(email)) {
    throw ApiError.badRequest("An account with this email already exists.");
  }
  const created = memoryStore.users.create({ name, email, passwordHash, role, emailUpdates: false });
  const user = toPublicUser(created);
  return { user, token: signToken({ userId: user.id, email: user.email, role: user.role }) };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ user: PublicUser; token: string }> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) throw ApiError.badRequest("Email and password are required.");

  if (useDb()) {
    const user = await db.query.users.findFirst({ where: eq(schema.users.email, email) });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw ApiError.unauthorized("Invalid email or password.");
    }
    const publicUser = toPublicUser(user);
    return { user: publicUser, token: signToken({ userId: publicUser.id, email: publicUser.email, role: publicUser.role }) };
  }

  await ensureMemorySeed();
  const user = memoryStore.users.findByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw ApiError.unauthorized("Invalid email or password.");
  }
  const publicUser = toPublicUser(user);
  return { user: publicUser, token: signToken({ userId: publicUser.id, email: publicUser.email, role: publicUser.role }) };
}

export async function getUserById(id: number): Promise<PublicUser | null> {
  if (useDb()) {
    const user = await db.query.users.findFirst({ where: eq(schema.users.id, id) });
    return user ? toPublicUser(user) : null;
  }
  await ensureMemorySeed();
  const user = memoryStore.users.findById(id);
  return user ? toPublicUser(user) : null;
}

export async function listUsers(): Promise<PublicUser[]> {
  if (useDb()) {
    const users = await db.query.users.findMany({ orderBy: (u, { desc }) => [desc(u.createdAt)] });
    return users.map(toPublicUser);
  }
  await ensureMemorySeed();
  return memoryStore.users.list().map(toPublicUser);
}

export async function updateUserRole(id: number, role: UserRole): Promise<PublicUser | null> {
  if (useDb()) {
    const [updated] = await db
      .update(schema.users)
      .set({ role })
      .where(eq(schema.users.id, id))
      .returning();
    return updated ? toPublicUser(updated) : null;
  }
  await ensureMemorySeed();
  const updated = memoryStore.users.updateRole(id, role);
  return updated ? toPublicUser(updated) : null;
}

export async function updateEmailUpdates(id: number, emailUpdates: boolean): Promise<PublicUser | null> {
  if (useDb()) {
    const [updated] = await db
      .update(schema.users)
      .set({ emailUpdates: Boolean(emailUpdates) })
      .where(eq(schema.users.id, id))
      .returning();
    return updated ? toPublicUser(updated) : null;
  }
  await ensureMemorySeed();
  const updated = memoryStore.users.updateEmailUpdates(id, Boolean(emailUpdates));
  return updated ? toPublicUser(updated) : null;
}

export async function deleteUser(id: number): Promise<boolean> {
  if (useDb()) {
    const deleted = await db.delete(schema.users).where(eq(schema.users.id, id)).returning();
    return deleted.length > 0;
  }
  await ensureMemorySeed();
  return memoryStore.users.remove(id);
}

export async function seedDefaultUsers() {
  const defaults = [
    { name: "Admin User", email: "admin@boardnotes.com", password: "admin123", role: "admin" as UserRole },
    { name: "Editor User", email: "editor@boardnotes.com", password: "editor123", role: "editor" as UserRole },
    { name: "Demo Teacher", email: "teacher@boardnotes.com", password: "teacher123", role: "teacher" as UserRole },
    { name: "Demo Student", email: "student@boardnotes.com", password: "student123", role: "student" as UserRole },
  ];

  for (const entry of defaults) {
    if (useDb()) {
      const existing = await db.query.users.findFirst({ where: eq(schema.users.email, entry.email) });
      if (existing) continue;
      await db.insert(schema.users).values({
        name: entry.name,
        email: entry.email,
        passwordHash: await hashPassword(entry.password),
        role: entry.role,
      });
      continue;
    }

    await ensureMemorySeed();
    if (!memoryStore.users.findByEmail(entry.email)) {
      memoryStore.users.create({
        name: entry.name,
        email: entry.email,
        passwordHash: await hashPassword(entry.password),
        role: entry.role,
        emailUpdates: false,
      });
    }
  }
}
