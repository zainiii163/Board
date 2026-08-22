import { and, desc, eq, inArray } from "drizzle-orm";

import { db } from "../../db/index.js";
import { useDb } from "../../db/mode.js";
import * as schema from "../../db/schema.js";
import { getUserById } from "../auth/auth.service.js";
import {
  classroomsStore,
  type ClassroomAssignmentRecord,
  type ClassroomRecord,
} from "../../store/classrooms-store.js";
import { cmsStore } from "../../store/cms-store.js";
import { ApiError } from "../../utils/api-error.js";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateJoinCode() {
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

function mapClassroom(row: typeof schema.classrooms.$inferSelect): ClassroomRecord {
  return {
    id: row.id,
    teacherUserId: row.teacherUserId,
    name: row.name,
    joinCode: row.joinCode,
    boardSlug: row.boardSlug,
    classSlug: row.classSlug,
    subjectSlug: row.subjectSlug,
    createdAt: row.createdAt.toISOString(),
  };
}

async function resolveUserName(userId: number) {
  const user = await getUserById(userId);
  return user?.name ?? "Student";
}

export async function listClassroomsForUser(userId: number, role: string) {
  if (role === "teacher" || role === "admin" || role === "editor") {
    if (useDb()) {
      const rows = await db.query.classrooms.findMany({
        where: eq(schema.classrooms.teacherUserId, userId),
        orderBy: [desc(schema.classrooms.createdAt)],
      });
      return rows.map(mapClassroom);
    }
    return classroomsStore.listForTeacher(userId);
  }

  if (useDb()) {
    const memberships = await db.query.classroomMembers.findMany({
      where: eq(schema.classroomMembers.userId, userId),
      with: { classroom: true },
    });
    return memberships.map((m) => mapClassroom(m.classroom));
  }
  return classroomsStore.listForStudent(userId);
}

export async function createClassroom(
  teacherUserId: number,
  input: { name: string; boardSlug: string; classSlug: string; subjectSlug: string },
) {
  if (!input.name.trim()) throw ApiError.badRequest("Classroom name is required.");

  if (useDb()) {
    let joinCode = generateJoinCode();
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const existing = await db.query.classrooms.findFirst({ where: eq(schema.classrooms.joinCode, joinCode) });
      if (!existing) break;
      joinCode = generateJoinCode();
    }
    const [row] = await db
      .insert(schema.classrooms)
      .values({
        teacherUserId,
        name: input.name.trim(),
        joinCode,
        boardSlug: input.boardSlug.trim(),
        classSlug: input.classSlug.trim(),
        subjectSlug: input.subjectSlug.trim(),
      })
      .returning();
    return mapClassroom(row);
  }

  return classroomsStore.create({
    teacherUserId,
    name: input.name.trim(),
    boardSlug: input.boardSlug.trim(),
    classSlug: input.classSlug.trim(),
    subjectSlug: input.subjectSlug.trim(),
  });
}

export async function joinClassroom(userId: number, joinCode: string) {
  const code = joinCode.trim().toUpperCase();
  if (code.length < 4) throw ApiError.badRequest("Enter a valid class code.");

  if (useDb()) {
    const classroom = await db.query.classrooms.findFirst({ where: eq(schema.classrooms.joinCode, code) });
    if (!classroom) throw ApiError.notFound("Class code not found.");
    const existing = await db.query.classroomMembers.findFirst({
      where: and(
        eq(schema.classroomMembers.classroomId, classroom.id),
        eq(schema.classroomMembers.userId, userId),
      ),
    });
    if (existing) return mapClassroom(classroom);
    await db.insert(schema.classroomMembers).values({ classroomId: classroom.id, userId });
    return mapClassroom(classroom);
  }

  const classroom = classroomsStore.getByJoinCode(code);
  if (!classroom) throw ApiError.notFound("Class code not found.");
  const userName = await resolveUserName(userId);
  classroomsStore.addMember(classroom.id, userId, userName);
  return classroom;
}

export async function getClassroomDetail(classroomId: number, userId: number, role: string) {
  if (useDb()) {
    const classroom = await db.query.classrooms.findFirst({ where: eq(schema.classrooms.id, classroomId) });
    if (!classroom) throw ApiError.notFound("Classroom not found.");
    const isTeacher = classroom.teacherUserId === userId || role === "admin" || role === "editor";
    const membership = await db.query.classroomMembers.findFirst({
      where: and(
        eq(schema.classroomMembers.classroomId, classroomId),
        eq(schema.classroomMembers.userId, userId),
      ),
    });
    if (!isTeacher && !membership) throw ApiError.forbidden("You are not in this classroom.");

    const members = await db.query.classroomMembers.findMany({
      where: eq(schema.classroomMembers.classroomId, classroomId),
      with: { user: true },
    });
    const assignmentRows = await db.query.classroomAssignments.findMany({
      where: eq(schema.classroomAssignments.classroomId, classroomId),
      orderBy: [desc(schema.classroomAssignments.createdAt)],
    });

    return {
      classroom: mapClassroom(classroom),
      members: members.map((m) => ({
        id: m.id,
        userId: m.userId,
        userName: m.user.name,
        joinedAt: m.joinedAt.toISOString(),
      })),
      assignments: assignmentRows.map((a) => ({
        id: a.id,
        classroomId: a.classroomId,
        title: a.title,
        exercisePath: a.exercisePath,
        dueDate: a.dueDate?.toISOString() ?? null,
        createdAt: a.createdAt.toISOString(),
      })),
      isTeacher,
    };
  }

  const classroom = classroomsStore.getById(classroomId);
  if (!classroom) throw ApiError.notFound("Classroom not found.");
  const isTeacher = classroom.teacherUserId === userId || role === "admin" || role === "editor";
  const memberRows = classroomsStore.listMembers(classroomId, (id) => {
    if (id === 3) return "Demo Student";
    if (id === 4) return "Demo Teacher";
    return "Student";
  });
  if (!isTeacher && !memberRows.some((m) => m.userId === userId)) {
    throw ApiError.forbidden("You are not in this classroom.");
  }

  return {
    classroom,
    members: memberRows,
    assignments: classroomsStore.listAssignments(classroomId),
    isTeacher,
  };
}

export async function createAssignment(
  classroomId: number,
  teacherUserId: number,
  role: string,
  input: { title: string; exercisePath: string; dueDate?: string },
) {
  const detail = await getClassroomDetail(classroomId, teacherUserId, role);
  if (!detail.isTeacher) throw ApiError.forbidden("Only the classroom teacher can assign work.");

  if (useDb()) {
    const [row] = await db
      .insert(schema.classroomAssignments)
      .values({
        classroomId,
        title: input.title.trim(),
        exercisePath: input.exercisePath.trim(),
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
      })
      .returning();
    return {
      id: row.id,
      classroomId: row.classroomId,
      title: row.title,
      exercisePath: row.exercisePath,
      dueDate: row.dueDate?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
    } satisfies ClassroomAssignmentRecord;
  }

  return classroomsStore.createAssignment({
    classroomId,
    title: input.title.trim(),
    exercisePath: input.exercisePath.trim(),
    dueDate: input.dueDate ?? null,
  });
}

export async function deleteAssignment(classroomId: number, assignmentId: number, userId: number, role: string) {
  const detail = await getClassroomDetail(classroomId, userId, role);
  if (!detail.isTeacher) throw ApiError.forbidden("Only the classroom teacher can remove assignments.");

  if (useDb()) {
    const deleted = await db
      .delete(schema.classroomAssignments)
      .where(
        and(
          eq(schema.classroomAssignments.id, assignmentId),
          eq(schema.classroomAssignments.classroomId, classroomId),
        ),
      )
      .returning();
    if (deleted.length === 0) throw ApiError.notFound("Assignment not found.");
    return { deleted: true };
  }

  if (!classroomsStore.deleteAssignment(classroomId, assignmentId)) throw ApiError.notFound("Assignment not found.");
  return { deleted: true };
}

export async function getClassroomScores(classroomId: number, userId: number, role: string) {
  const detail = await getClassroomDetail(classroomId, userId, role);
  if (!detail.isTeacher) throw ApiError.forbidden("Only the classroom teacher can view scores.");

  const memberIds = detail.members.map((m) => m.userId);
  if (memberIds.length === 0) return [];

  if (useDb()) {
    const rows = await db.query.quizScores.findMany({
      where: inArray(schema.quizScores.userId, memberIds),
      orderBy: [desc(schema.quizScores.createdAt)],
      with: { user: true },
    });
    return rows.map((row) => ({
      userId: row.userId,
      userName: row.user?.name ?? "Student",
      chapterKey: row.chapterKey,
      score: row.score,
      total: row.total,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  return classroomsStore.listScoresForClassroom(classroomId, memberIds).length
    ? classroomsStore.listScoresForClassroom(classroomId, memberIds)
    : memberIds.flatMap((memberId) => {
        const userName = memberId === 3 ? "Demo Student" : memberId === 4 ? "Demo Teacher" : "Student";
        return cmsStore.getQuizScoresForUser(memberId).map((row) => ({
          userId: memberId,
          userName,
          chapterKey: row.chapterKey,
          score: row.score,
          total: row.total,
          createdAt: row.createdAt,
        }));
      });
}
