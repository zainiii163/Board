import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { memoryStore } from "../../store/memory-store.js";
import { ApiError } from "../../utils/api-error.js";
import { notifyAdmin } from "../../utils/mail.js";

export type ContactRecord = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

function mapContact(row: {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: Date | null;
}): ContactRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: (row.createdAt ?? new Date()).toISOString(),
  };
}

export async function listContactMessages(): Promise<ContactRecord[]> {
  if (useDb()) {
    const rows = await db.query.contactMessages.findMany({
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });
    return rows.map(mapContact);
  }
  return memoryStore.contacts.list();
}

export async function createContactMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<ContactRecord> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const message = input.message.trim();

  if (name.length < 2) throw ApiError.badRequest("Please enter your name.");
  if (!email.includes("@")) throw ApiError.badRequest("Enter a valid email address.");
  if (message.length < 10) throw ApiError.badRequest("Message must be at least 10 characters.");

  const notify = () => {
    void notifyAdmin({
      subject: `[BoardNotes] Contact from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }).catch((err) => console.error("Contact notify failed", err));
  };

  if (useDb()) {
    const [created] = await db
      .insert(schema.contactMessages)
      .values({ name, email, message })
      .returning();
    const record = mapContact(created);
    notify();
    return record;
  }

  const record = memoryStore.contacts.create({ name, email, message });
  notify();
  return record;
}
