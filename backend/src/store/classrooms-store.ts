export type ClassroomRecord = {
  id: number;
  teacherUserId: number;
  name: string;
  joinCode: string;
  boardSlug: string;
  classSlug: string;
  subjectSlug: string;
  createdAt: string;
};

export type ClassroomMemberRecord = {
  id: number;
  classroomId: number;
  userId: number;
  userName: string;
  joinedAt: string;
};

export type ClassroomAssignmentRecord = {
  id: number;
  classroomId: number;
  title: string;
  exercisePath: string;
  dueDate: string | null;
  createdAt: string;
};

export type ClassroomScoreRecord = {
  userId: number;
  userName: string;
  chapterKey: string;
  score: number;
  total: number;
  createdAt: string;
};

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateJoinCode() {
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

let classroomIdCounter = 2;
let memberIdCounter = 1;
let assignmentIdCounter = 2;

const classrooms: ClassroomRecord[] = [
  {
    id: 1,
    teacherUserId: 4,
    name: "FBISE Class 9 Math — Section A",
    joinCode: "FB9MAT",
    boardSlug: "fbise",
    classSlug: "9",
    subjectSlug: "mathematics",
    createdAt: new Date().toISOString(),
  },
];

const members: ClassroomMemberRecord[] = [];
const assignments: ClassroomAssignmentRecord[] = [
  {
    id: 1,
    classroomId: 1,
    title: "Exercise 1.1 — Real Numbers",
    exercisePath: "/fbise/9/mathematics/real-numbers/exercise-1-1",
    dueDate: null,
    createdAt: new Date().toISOString(),
  },
];

const quizScores: ClassroomScoreRecord[] = [];

export const classroomsStore = {
  listAll: () => [...classrooms].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  listForTeacher: (teacherUserId: number) =>
    classrooms.filter((c) => c.teacherUserId === teacherUserId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  listForStudent: (userId: number) => {
    const classroomIds = members.filter((m) => m.userId === userId).map((m) => m.classroomId);
    return classrooms.filter((c) => classroomIds.includes(c.id));
  },

  getById: (id: number) => classrooms.find((c) => c.id === id) ?? null,

  getByJoinCode: (joinCode: string) =>
    classrooms.find((c) => c.joinCode === joinCode.toUpperCase()) ?? null,

  create: (input: Omit<ClassroomRecord, "id" | "joinCode" | "createdAt">) => {
    let joinCode = generateJoinCode();
    while (classrooms.some((c) => c.joinCode === joinCode)) joinCode = generateJoinCode();
    const entry: ClassroomRecord = {
      ...input,
      id: classroomIdCounter++,
      joinCode,
      createdAt: new Date().toISOString(),
    };
    classrooms.push(entry);
    return entry;
  },

  listMembers: (classroomId: number, resolveName: (userId: number) => string) =>
    members
      .filter((m) => m.classroomId === classroomId)
      .map((m) => ({ ...m, userName: resolveName(m.userId) }))
      .sort((a, b) => a.joinedAt.localeCompare(b.joinedAt)),

  addMember: (classroomId: number, userId: number, userName: string) => {
    if (members.some((m) => m.classroomId === classroomId && m.userId === userId)) {
      return members.find((m) => m.classroomId === classroomId && m.userId === userId)!;
    }
    const entry: ClassroomMemberRecord = {
      id: memberIdCounter++,
      classroomId,
      userId,
      userName,
      joinedAt: new Date().toISOString(),
    };
    members.push(entry);
    return entry;
  },

  listAssignments: (classroomId: number) =>
    assignments
      .filter((a) => a.classroomId === classroomId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  createAssignment: (input: Omit<ClassroomAssignmentRecord, "id" | "createdAt">) => {
    const entry: ClassroomAssignmentRecord = {
      ...input,
      id: assignmentIdCounter++,
      createdAt: new Date().toISOString(),
    };
    assignments.push(entry);
    return entry;
  },

  deleteAssignment: (classroomId: number, assignmentId: number) => {
    const index = assignments.findIndex((a) => a.id === assignmentId && a.classroomId === classroomId);
    if (index < 0) return false;
    assignments.splice(index, 1);
    return true;
  },

  listScoresForClassroom: (classroomId: number, memberUserIds: number[]) =>
    quizScores
      .filter((s) => memberUserIds.includes(s.userId))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  recordQuizScore: (userId: number, userName: string, chapterKey: string, score: number, total: number) => {
    quizScores.unshift({
      userId,
      userName,
      chapterKey,
      score,
      total,
      createdAt: new Date().toISOString(),
    });
  },

  getQuizScoresForUser: (userId: number) =>
    quizScores.filter((s) => s.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
};
