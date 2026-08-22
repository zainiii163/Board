import { and, eq, inArray } from "drizzle-orm";

import { env } from "../../config/env.js";
import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { classroomsStore } from "../../store/classrooms-store.js";
import { ensureMemorySeed, memoryStore } from "../../store/memory-store.js";
import { sendUserMail } from "../../utils/mail.js";

type PublishedChapterRef = {
  title: string;
  boardSlug: string;
  classSlug: string;
  subjectSlug: string;
  slug: string;
};

type Recipient = {
  email: string;
  name: string;
  classroomName: string;
};

async function findRecipients(chapter: PublishedChapterRef): Promise<Recipient[]> {
  const recipients: Recipient[] = [];
  const seenEmails = new Set<string>();

  if (useDb()) {
    const rooms = await db.query.classrooms.findMany({
      where: and(
        eq(schema.classrooms.boardSlug, chapter.boardSlug),
        eq(schema.classrooms.classSlug, chapter.classSlug),
        eq(schema.classrooms.subjectSlug, chapter.subjectSlug),
      ),
      with: { members: true },
    });

    const memberIds = [...new Set(rooms.flatMap((room) => room.members.map((m) => m.userId)))];
    if (memberIds.length === 0) return [];

    const users = await db.query.users.findMany({
      where: inArray(schema.users.id, memberIds),
    });
    const usersById = new Map(users.map((u) => [u.id, u]));

    for (const room of rooms) {
      for (const member of room.members) {
        const user = usersById.get(member.userId);
        if (!user?.emailUpdates || seenEmails.has(user.email)) continue;
        seenEmails.add(user.email);
        recipients.push({
          email: user.email,
          name: user.name,
          classroomName: room.name,
        });
      }
    }
    return recipients;
  }

  await ensureMemorySeed();
  for (const room of classroomsStore.listAll()) {
    if (
      room.boardSlug !== chapter.boardSlug ||
      room.classSlug !== chapter.classSlug ||
      room.subjectSlug !== chapter.subjectSlug
    ) {
      continue;
    }
    const members = classroomsStore.listMembers(room.id, (id) => memoryStore.users.findById(id)?.name ?? "Student");
    for (const member of members) {
      const user = memoryStore.users.findById(member.userId);
      if (!user?.emailUpdates || seenEmails.has(user.email)) continue;
      seenEmails.add(user.email);
      recipients.push({
        email: user.email,
        name: user.name,
        classroomName: room.name,
      });
    }
  }

  return recipients;
}

export async function notifyClassroomOfPublishedChapter(chapter: PublishedChapterRef) {
  const recipients = await findRecipients(chapter);
  if (recipients.length === 0) {
    return { notified: 0 };
  }

  const path = `/${chapter.boardSlug}/${chapter.classSlug}/${chapter.subjectSlug}/${chapter.slug}`;
  const url = `${env.publicSiteUrl}${path}`;
  let notified = 0;

  for (const recipient of recipients) {
    const subject = `New notes in ${recipient.classroomName}: ${chapter.title}`;
    const text = [
      `Hi ${recipient.name},`,
      "",
      `New notes were published for your class "${recipient.classroomName}".`,
      "",
      `Chapter: ${chapter.title}`,
      `Open: ${url}`,
      "",
      "You can turn off these emails anytime from your BoardNotes account page.",
      "",
      "— BoardNotes",
    ].join("\n");

    await sendUserMail({ to: recipient.email, subject, text });
    notified += 1;
  }

  return { notified };
}
