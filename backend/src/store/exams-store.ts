export type ExamRecord = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  classSlug: string;
  classTitle: string;
  title: string;
  examDate: string;
};

let examIdCounter = 3;

const exams: ExamRecord[] = [
  {
    id: 1,
    boardSlug: "fbise",
    boardTitle: "Federal Board (FBISE)",
    classSlug: "9",
    classTitle: "Class 9",
    title: "FBISE Class 9 Annual Exams 2026",
    examDate: "2026-03-15T09:00:00+05:00",
  },
  {
    id: 2,
    boardSlug: "fbise",
    boardTitle: "Federal Board (FBISE)",
    classSlug: "10",
    classTitle: "Class 10",
    title: "FBISE Class 10 Annual Exams 2026",
    examDate: "2026-03-22T09:00:00+05:00",
  },
];

export const examsStore = {
  list: () => [...exams].sort((a, b) => a.examDate.localeCompare(b.examDate)),

  upcoming: () => {
    const now = Date.now();
    return examsStore.list().filter((exam) => new Date(exam.examDate).getTime() > now);
  },

  getById: (id: number) => exams.find((e) => e.id === id) ?? null,

  create: (input: Omit<ExamRecord, "id">) => {
    const entry: ExamRecord = { ...input, id: examIdCounter++ };
    exams.push(entry);
    return entry;
  },

  update: (id: number, input: Partial<Omit<ExamRecord, "id">>) => {
    const index = exams.findIndex((e) => e.id === id);
    if (index < 0) return null;
    exams[index] = { ...exams[index], ...input };
    return exams[index];
  },

  delete: (id: number) => {
    const index = exams.findIndex((e) => e.id === id);
    if (index < 0) return false;
    exams.splice(index, 1);
    return true;
  },
};
